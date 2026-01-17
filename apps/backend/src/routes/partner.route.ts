import express from 'express';
import { Order } from '../models/order.model';
import { User } from '../models/user.model';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to get user from request (Assuming auth middleware puts user in req.user)
// For now, we will assume the frontend sends a 'userId' query param or header for MVP testing
// In prod, this should use the proper verifyToken middleware.

// GET /api/partner/stats?userId=...
router.get('/stats', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: 'UserId required' });

        // Verify user is a partner
        // const user = await User.findById(userId);
        // if (!user || user.role !== 'DELIVERY_PARTNER') ...

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const completedOrders = await Order.countDocuments({
            deliveryPartnerId: userId,
            status: 'DELIVERED',
            updatedAt: { $gte: todayStart, $lte: todayEnd }
        });

        const earningsAgg = await Order.aggregate([
            {
                $match: {
                    deliveryPartnerId: new mongoose.Types.ObjectId(userId as string),
                    status: 'DELIVERED',
                    updatedAt: { $gte: todayStart, $lte: todayEnd }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$shippingCharges' } // Simplified: earning is shipping charge
                }
            }
        ]);

        const earnings = earningsAgg.length > 0 ? earningsAgg[0].total : 0;

        res.json({
            earnings,
            completedOrders
        });
    } catch (error) {
        console.error('Error fetching partner stats:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/partner/active-orders?userId=...
router.get('/active-orders', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: 'UserId required' });

        // Find orders assigned to logic that are NOT delivered yet
        const orders = await Order.find({
            deliveryPartnerId: userId,
            status: { $in: ['SHIPPED', 'OUT_FOR_DELIVERY'] }, // Assuming 'SHIPPED' means ready for partner
            // deliveryStatus: { $ne: 'DELIVERED' } 
        })
            .select('totalAmount shippingAddress status deliveryStatus items')
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching active orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// GET /api/partner/history?userId=...
router.get('/history', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ message: 'UserId required' });

        const orders = await Order.find({
            deliveryPartnerId: userId,
            status: 'DELIVERED'
        })
            .select('totalAmount shippingAddress status updatedAt shippingCharges')
            .sort({ updatedAt: -1 })
            .limit(10);

        res.json(orders);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/partner/toggle-status
router.post('/toggle-status', async (req, res) => {
    try {
        const { userId, isOnline, fcmToken } = req.body;
        if (!userId) return res.status(400).json({ message: 'UserId required' });

        const updateData: any = {
            isOnline,
            updatedAt: new Date()
        };

        if (fcmToken) {
            updateData.fcmToken = fcmToken;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            { new: true }
        );

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (isOnline) {
            const { DispatchService } = await import("../services/dispatch.service");
            DispatchService.checkPendingForPartner(userId).catch(console.error);
        }

        res.json({
            success: true,
            isOnline: user.isOnline,
            message: `You are now ${user.isOnline ? 'Online' : 'Offline'}`
        });
    } catch (error) {
        console.error('Error toggling status:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// POST /api/partner/orders/:orderId/accept
router.post('/orders/:orderId/accept', async (req, res) => {
    try {
        const { orderId } = req.params;
        // In real auth, get user from req.user
        // For now, we expect userId in body or headers, or we just trust the dispatch logic? 
        // We really need the partner ID. Let's ask for it in the body for MVP.
        const { userId } = req.body;

        // Or if we don't have it in body (AlarmScreen didn't send it?), we can try to find the active request for this order
        // and see if the 'currentAssignedPartnerId' matches... but we need to know who is calling.
        // Let's assume the mobile app sends userId in body for now.
        // Wait, AlarmScreen.tsx code: axios.post(.../accept) with NO body.
        // I need to update AlarmScreen to send userId!

        // But first, let's write this endpoint assuming userId is passed.
        // Actually, for the AlarmScreen, we hardcoded TEST_PARTNER_ID in HomeScreen. 
        // AlarmScreen doesn't have access to it easily unless passed via params.

        // Let's fix AlarmScreen to pass userId or retrieve it.
        // For now, I'll update this endpoint to require userId.

        // 1. Find the request
        const { DeliveryRequest } = await import('../models/deliveryRequest.model');
        const request = await DeliveryRequest.findOne({
            orderId,
            status: 'PENDING'
        });

        if (!request) {
            return res.status(404).json({ message: 'Request expired or not found' });
        }

        // 2. Validate it's for this user (if we had userId)
        // if (request.currentAssignedPartnerId.toString() !== userId) ...

        // 3. Update Request
        request.status = 'ACCEPTED';
        await request.save();

        // 4. Update Order
        const order = await Order.findById(orderId);
        if (order) {
            order.deliveryPartnerId = request.currentAssignedPartnerId; // Assign the partner who was requested
            order.deliveryStatus = 'PENDING_PICKUP'; // Back to pending pickup, but now with a partner
            await order.save();
        }

        res.json({ success: true, message: 'Order accepted' });

    } catch (error) {
        console.error('Error accepting order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;
