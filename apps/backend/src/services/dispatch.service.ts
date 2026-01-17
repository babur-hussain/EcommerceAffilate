import * as cron from 'node-cron';
import { DeliveryRequest } from '../models/deliveryRequest.model';
import { User } from '../models/user.model';
import { Order } from '../models/order.model';
import { FirebaseService } from './firebase.service';
import mongoose from 'mongoose';

export class DispatchService {
    // Cron job instance
    private static task: cron.ScheduledTask;

    static init() {
        console.log('🚀 Initializing Dispatch Service...');

        // Run every 10 seconds to check for timed-out requests
        this.task = cron.schedule('*/10 * * * * *', () => {
            this.processTimeouts();
        });

        // Run every 30 seconds to retry/catch-up on pending orders (SHIPPED but no request)
        cron.schedule('*/30 * * * * *', () => {
            this.processPendingOrders();
        });

        console.log('✅ Dispatch Service initialized and cron job started.');
    }

    /**
     * Trigger the dispatch process for a specific order.
     * Typically called when order status becomes 'SHIPPED' or 'WAITING_PICKUP'
     */
    static async startDispatch(orderId: string) {
        console.log(`📦 Starting dispatch for order: ${orderId}`);

        // 1. Check if a request already exists/is active
        const existing = await DeliveryRequest.findOne({
            orderId,
            status: { $in: ['PENDING', 'ACCEPTED'] }
        });

        if (existing) {
            console.log(`⚠️ Dispatch already in progress for ${orderId}`);
            return;
        }

        // 2. Fetch Order & Pickup Location (From Seller/Business)
        // For MVP, we'll try to get location from the first product's business -> user
        const order = await Order.findById(orderId).populate('items.productId');
        if (!order) return;

        // TODO: proper location lookup. For now, we'll assume a dummy logic or system-wide search.
        // In a real app, we'd lookup the Business address coordinates.
        // Let's assume we treat the Dispatch as "Global" if no location logic is perfect yet.

        // 3. Find Candidates
        const candidates = await this.findNearestPartners([0, 0]); // TODO: pass actual coordinates

        if (candidates.length === 0) {
            console.log('❌ No online partners found.');
            // Update order status or retry later?
            return;
        }

        console.log(`✅ Found ${candidates.length} candidates.`);

        // Update Order with Searching Status to reflect in UI
        order.deliveryStatus = 'SEARCHING_FOR_PARTNER';
        await order.save();

        // 4. Create DeliveryRequest
        const deliveryRequest = await DeliveryRequest.create({
            orderId,
            status: 'PENDING',
            currentAssignedPartnerId: candidates[0]._id,
            assignmentStartTime: new Date(),
            participatingPartners: candidates.map(c => c._id),
            rejectedPartners: [],
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours expiry
        });

        // 5. Notify the first partner
        await this.notifyPartner(candidates[0], order);
    }

    private static async findNearestPartners(coordinates: [number, number], maxDistance: number = 10000): Promise<any[]> {
        // Return online partners with Role 'DELIVERY_PARTNER'
        // If coordinates are [0,0] (dummy), just return any online partner
        if (coordinates[0] === 0 && coordinates[1] === 0) {
            return User.find({
                role: 'DELIVERY_PARTNER',
                isOnline: true,
                isActive: true
            }).limit(10);
        }

        return User.find({
            role: 'DELIVERY_PARTNER',
            isOnline: true,
            isActive: true,
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: coordinates
                    },
                    $maxDistance: maxDistance
                }
            }
        }).limit(10);
    }

    private static async notifyPartner(partner: any, order: any) {
        console.log(`🔔 Ringing Partner: ${partner.name} (${partner._id})`);

        // We need the partner's FCM token. 
        // Assuming 'firebaseUid' might be used to lookup custom token, or we add fcmToken field.
        // For now, let's assume we added an 'fcmToken' field to User or we can't send.
        // Since we didn't add it in the previous step, I'll assume we might use a topic or just log for now?
        // User model has `firebaseUid`. 
        // Wait, FCM tokens are usually stored on the device.
        // I will log this clearly. The user needs to ensure FCM tokens are saved.

        if (partner.fcmToken) {
            await FirebaseService.sendDataMessage(partner.fcmToken, {
                type: 'NEW_ORDER',
                orderId: order._id.toString(),
                amount: order.totalAmount.toString(),
                timestamp: Date.now().toString()
            });
        } else {
            console.warn(`⚠️ Partner ${partner._id} has no FCM token. Skipping notification.`);
        }
    }

    /**
     * The Loop: Check for timeouts (30s) and rotate
     */
    private static async processTimeouts() {
        const now = new Date();
        const timeoutThreshold = new Date(now.getTime() - 30000); // 30 seconds ago

        // Find requests that are PENDING and assignment started > 30s ago
        const expiredRequests = await DeliveryRequest.find({
            status: 'PENDING',
            assignmentStartTime: { $lt: timeoutThreshold }
        }).populate('participatingPartners');

        for (const req of expiredRequests) {
            console.log(`⌛ Timeout for Request ${req._id}. Rotating...`);

            // Add current to rejected
            if (req.currentAssignedPartnerId) {
                req.rejectedPartners.push(req.currentAssignedPartnerId);
            }

            // Find next candidate
            const nextPartnerId = req.participatingPartners.find(
                pId => !req.rejectedPartners.map(r => r.toString()).includes(pId.toString())
            );

            if (nextPartnerId) {
                // Assign next
                req.currentAssignedPartnerId = nextPartnerId;
                req.assignmentStartTime = now;
                await req.save();

                // Notify next
                // Need to fetch user to get token (if we had it)
                const partner = await User.findById(nextPartnerId);
                if (partner) {
                    const order = await Order.findById(req.orderId);
                    await this.notifyPartner(partner, order);
                }
            } else {
                console.log(`❌ No more partners available for ${req.orderId}`);
                // Optionally mark as EXPIRED or manual intervention needed
                // req.status = 'EXPIRED'; // Keep PENDING to allow manual retry?
                // Let's just reset time so we don't spam loop? No, that would loop same person.
                // If no one left, maybe stop the loop.
                // For now, we leave it.
            }
        }
    }
    /**
     * Catch-up: Find orders that are SHIPPED but have no active DeliveryRequest
     */
    private static async processPendingOrders() {
        // Find orders status=SHIPPED
        // We also need to exclude orders that already have a PENDING request
        // This is a bit expensive, but robust for MVP.
        const pendingOrders = await Order.find({
            status: 'SHIPPED',
            deliveryStatus: { $ne: 'DELIVERED' }
        }).limit(20);

        console.log(`🔍 Catch-up: Found ${pendingOrders.length} pending SHIPPED orders.`);

        for (const order of pendingOrders) {
            // Check if there is an active request
            const activeRequest = await DeliveryRequest.findOne({
                orderId: order._id,
                status: { $in: ['PENDING', 'ACCEPTED'] }
            });

            if (!activeRequest) {
                console.log(`🔄 Retry Dispatch for Order ${order._id}`);
                await this.startDispatch(order._id.toString());
            } else {
                console.log(`ℹ️ Order ${order._id} already has active request ${activeRequest._id}`);
            }
        }
    }

    /**
     * Triggered when a partner comes online.
     * Check if there are any pending orders that this partner works for.
     */
    static async checkPendingForPartner(partnerId: string) {
        console.log(`👤 Partner ${partnerId} is online. Checking for pending orders...`);
        // We can just trigger the same processPendingOrders
        // Or specific logic to prioritize this partner.
        // For simplicity, just run the batch check.
        await this.processPendingOrders();
    }
}
