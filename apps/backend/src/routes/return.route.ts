import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ReturnRequest } from '../models/returnRequest.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';
import { requireCustomer, requireBrand, requireAdmin } from '../middlewares/rbac';
import { createNotification } from '../services/notification.service';
import { logAction } from '../services/audit.service';

const router = Router();

// ============ CUSTOMER ENDPOINTS ============

// POST /api/returns - Create a new return request
router.post('/returns', requireCustomer, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as { id?: string } | undefined;
        if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

        const { orderId, items, customerNote, images } = req.body as {
            orderId: string;
            items: Array<{
                productId: string;
                quantity: number;
                reason: string;
                condition: string;
            }>;
            customerNote?: string;
            images?: string[];
        };

        if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ error: 'Valid orderId is required' });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'At least one item is required for return' });
        }

        // Find the order
        const order = await Order.findOne({ _id: orderId, userId: user.id })
            .populate('items.productId', 'title primaryImage images');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        if (order.status !== 'DELIVERED') {
            return res.status(400).json({ error: 'Only delivered orders can be returned' });
        }

        // Check if return already exists for this order
        const existingReturn = await ReturnRequest.findOne({ orderId, status: { $ne: 'CANCELLED' } });
        if (existingReturn) {
            return res.status(400).json({ error: 'A return request already exists for this order' });
        }

        // Validate items and calculate refund amount
        let refundAmount = 0;
        const returnItems: any[] = [];

        for (const item of items) {
            const orderItem = order.items.find(
                (oi: any) => oi.productId._id.toString() === item.productId || oi.productId.toString() === item.productId
            );

            if (!orderItem) {
                return res.status(400).json({ error: `Product ${item.productId} not found in order` });
            }

            if (item.quantity > orderItem.quantity) {
                return res.status(400).json({ error: `Return quantity exceeds ordered quantity for product ${item.productId}` });
            }

            const product = orderItem.productId as any;
            const itemRefund = orderItem.price * item.quantity;
            refundAmount += itemRefund;

            returnItems.push({
                productId: typeof product === 'object' ? product._id : product,
                productTitle: typeof product === 'object' ? product.title : 'Unknown Product',
                productImage: typeof product === 'object' ? (product.primaryImage || product.images?.[0]) : undefined,
                quantity: item.quantity,
                price: orderItem.price,
                reason: item.reason,
                condition: item.condition,
            });
        }

        // Get businessId from the first product
        const firstProduct = await Product.findById(returnItems[0].productId).select('businessId');
        if (!firstProduct?.businessId) {
            return res.status(400).json({ error: 'Could not determine seller for return request' });
        }

        // Create return request
        const returnRequest = new ReturnRequest({
            orderId,
            userId: user.id,
            businessId: firstProduct.businessId,
            items: returnItems,
            customerNote,
            images: images || [],
            refundAmount,
            status: 'PENDING',
        });

        await returnRequest.save();

        // Update order status
        order.status = 'RETURN_REQUESTED';
        order.returnReason = customerNote || returnItems.map(i => i.reason).join(', ');
        await order.save();

        res.status(201).json(returnRequest);

        // Log action
        void logAction({
            userId: user.id,
            role: (req as any)?.user?.role,
            action: 'RETURN_REQUESTED',
            entityType: 'RETURN',
            entityId: returnRequest._id.toString(),
            metadata: { orderId, itemCount: returnItems.length, refundAmount },
        });

    } catch (error: any) {
        console.error('Failed to create return request:', error);
        res.status(500).json({ error: 'Failed to create return request', message: error.message });
    }
});

// GET /api/returns/mine - Get customer's return requests
router.get('/returns/mine', requireCustomer, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as { id?: string } | undefined;
        if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

        const returns = await ReturnRequest.find({ userId: user.id })
            .sort({ createdAt: -1 })
            .populate('orderId', 'shippingAddress totalAmount createdAt');

        res.json(returns);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch return requests', message: error.message });
    }
});

// GET /api/returns/:id - Get return request details
router.get('/returns/:id', requireCustomer, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user as { id?: string } | undefined;
        if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid return request id' });
        }

        const returnRequest = await ReturnRequest.findOne({ _id: id, userId: user.id })
            .populate('orderId', 'shippingAddress totalAmount createdAt status');

        if (!returnRequest) {
            return res.status(404).json({ error: 'Return request not found' });
        }

        res.json(returnRequest);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch return request', message: error.message });
    }
});

// ============ SELLER ENDPOINTS ============

// GET /api/business/returns - List seller's return requests
router.get('/business/returns', requireBrand, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as { businessId?: string } | undefined;
        if (!user?.businessId) return res.status(401).json({ error: 'Unauthorized' });

        const { status, page = 1, limit = 20 } = req.query;

        const query: any = { businessId: user.businessId };
        if (status && typeof status === 'string') {
            query.status = status.toUpperCase();
        }

        const skip = (Number(page) - 1) * Number(limit);

        const [returns, total] = await Promise.all([
            ReturnRequest.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate('orderId', 'shippingAddress totalAmount createdAt')
                .populate('userId', 'name email phone'),
            ReturnRequest.countDocuments(query),
        ]);

        res.json({
            returns,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                pages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch return requests', message: error.message });
    }
});

// GET /api/business/returns/stats - Get return statistics
router.get('/business/returns/stats', requireBrand, async (req: Request, res: Response) => {
    try {
        const user = (req as any).user as { businessId?: string } | undefined;
        if (!user?.businessId) return res.status(401).json({ error: 'Unauthorized' });

        const stats = await ReturnRequest.aggregate([
            { $match: { businessId: new mongoose.Types.ObjectId(user.businessId) } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalRefund: { $sum: '$refundAmount' },
                },
            },
        ]);

        const result: any = {
            pending: 0,
            approved: 0,
            rejected: 0,
            completed: 0,
            totalRefundAmount: 0,
        };

        stats.forEach((s) => {
            if (s._id === 'PENDING') result.pending = s.count;
            else if (s._id === 'APPROVED' || s._id === 'PICKUP_SCHEDULED' || s._id === 'PICKED_UP' || s._id === 'RECEIVED') {
                result.approved += s.count;
            } else if (s._id === 'REJECTED') result.rejected = s.count;
            else if (s._id === 'REFUND_COMPLETED') {
                result.completed = s.count;
                result.totalRefundAmount += s.totalRefund;
            }
        });

        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch return stats', message: error.message });
    }
});

// GET /api/business/returns/:id - Get return request details for seller
router.get('/business/returns/:id', requireBrand, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = (req as any).user as { businessId?: string } | undefined;
        if (!user?.businessId) return res.status(401).json({ error: 'Unauthorized' });

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid return request id' });
        }

        const returnRequest = await ReturnRequest.findOne({ _id: id, businessId: user.businessId })
            .populate('orderId', 'shippingAddress totalAmount createdAt status paymentProvider')
            .populate('userId', 'name email phone');

        if (!returnRequest) {
            return res.status(404).json({ error: 'Return request not found' });
        }

        res.json(returnRequest);
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch return request', message: error.message });
    }
});

// PATCH /api/business/returns/:id/approve - Approve return request
router.patch('/business/returns/:id/approve', requireBrand, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { sellerNote } = req.body;
        const user = (req as any).user as { id?: string; businessId?: string } | undefined;
        if (!user?.businessId) return res.status(401).json({ error: 'Unauthorized' });

        const returnRequest = await ReturnRequest.findOne({ _id: id, businessId: user.businessId });
        if (!returnRequest) {
            return res.status(404).json({ error: 'Return request not found' });
        }

        if (returnRequest.status !== 'PENDING') {
            return res.status(400).json({ error: 'Return request is not pending' });
        }

        returnRequest.status = 'APPROVED';
        returnRequest.sellerNote = sellerNote;
        returnRequest.timeline.push({
            status: 'APPROVED',
            timestamp: new Date(),
            note: sellerNote || 'Return approved by seller',
            updatedBy: user.id ? new mongoose.Types.ObjectId(user.id) : undefined,
        });

        await returnRequest.save();
        res.json(returnRequest);

        // Notify customer
        await createNotification(
            returnRequest.userId.toString(),
            'RETURN',
            'Return Approved',
            `Your return request ${returnRequest.returnRequestNumber} has been approved.`
        );

    } catch (error: any) {
        res.status(500).json({ error: 'Failed to approve return', message: error.message });
    }
});

// PATCH /api/business/returns/:id/reject - Reject return request
router.patch('/business/returns/:id/reject', requireBrand, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { rejectionReason, sellerNote } = req.body;
        const user = (req as any).user as { id?: string; businessId?: string } | undefined;
        if (!user?.businessId) return res.status(401).json({ error: 'Unauthorized' });

        if (!rejectionReason) {
            return res.status(400).json({ error: 'Rejection reason is required' });
        }

        const returnRequest = await ReturnRequest.findOne({ _id: id, businessId: user.businessId });
        if (!returnRequest) {
            return res.status(404).json({ error: 'Return request not found' });
        }

        if (returnRequest.status !== 'PENDING') {
            return res.status(400).json({ error: 'Return request is not pending' });
        }

        returnRequest.status = 'REJECTED';
        returnRequest.rejectionReason = rejectionReason;
        returnRequest.sellerNote = sellerNote;
        returnRequest.timeline.push({
            status: 'REJECTED',
            timestamp: new Date(),
            note: rejectionReason,
            updatedBy: user.id ? new mongoose.Types.ObjectId(user.id) : undefined,
        });

        await returnRequest.save();

        // Update order status back to DELIVERED
        await Order.findByIdAndUpdate(returnRequest.orderId, { status: 'DELIVERED', returnReason: undefined });

        res.json(returnRequest);

        // Notify customer
        await createNotification(
            returnRequest.userId.toString(),
            'RETURN',
            'Return Rejected',
            `Your return request ${returnRequest.returnRequestNumber} has been rejected. Reason: ${rejectionReason}`
        );

    } catch (error: any) {
        res.status(500).json({ error: 'Failed to reject return', message: error.message });
    }
});

// PATCH /api/business/returns/:id/pickup - Schedule pickup
router.patch('/business/returns/:id/pickup', requireBrand, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { scheduledDate, courierName } = req.body;
        const user = (req as any).user as { id?: string; businessId?: string } | undefined;
        if (!user?.businessId) return res.status(401).json({ error: 'Unauthorized' });

        const returnRequest = await ReturnRequest.findOne({ _id: id, businessId: user.businessId });
        if (!returnRequest) {
            return res.status(404).json({ error: 'Return request not found' });
        }

        if (returnRequest.status !== 'APPROVED') {
            return res.status(400).json({ error: 'Return must be approved before scheduling pickup' });
        }

        returnRequest.status = 'PICKUP_SCHEDULED';
        returnRequest.pickupDetails = {
            scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
            courierName: courierName || 'Self Pickup',
        };
        returnRequest.timeline.push({
            status: 'PICKUP_SCHEDULED',
            timestamp: new Date(),
            note: `Pickup scheduled for ${scheduledDate || 'today'}`,
            updatedBy: user.id ? new mongoose.Types.ObjectId(user.id) : undefined,
        });

        await returnRequest.save();
        res.json(returnRequest);

        // Notify customer
        await createNotification(
            returnRequest.userId.toString(),
            'RETURN',
            'Pickup Scheduled',
            `Pickup for your return ${returnRequest.returnRequestNumber} has been scheduled.`
        );

    } catch (error: any) {
        res.status(500).json({ error: 'Failed to schedule pickup', message: error.message });
    }
});

// PATCH /api/business/returns/:id/received - Mark as received
router.patch('/business/returns/:id/received', requireBrand, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { sellerNote } = req.body;
        const user = (req as any).user as { id?: string; businessId?: string } | undefined;
        if (!user?.businessId) return res.status(401).json({ error: 'Unauthorized' });

        const returnRequest = await ReturnRequest.findOne({ _id: id, businessId: user.businessId });
        if (!returnRequest) {
            return res.status(404).json({ error: 'Return request not found' });
        }

        if (!['PICKUP_SCHEDULED', 'PICKED_UP', 'APPROVED'].includes(returnRequest.status)) {
            return res.status(400).json({ error: 'Invalid status for marking as received' });
        }

        returnRequest.status = 'RECEIVED';
        if (returnRequest.pickupDetails) {
            returnRequest.pickupDetails.completedDate = new Date();
        }
        returnRequest.timeline.push({
            status: 'RECEIVED',
            timestamp: new Date(),
            note: sellerNote || 'Product received by seller',
            updatedBy: user.id ? new mongoose.Types.ObjectId(user.id) : undefined,
        });

        await returnRequest.save();
        res.json(returnRequest);

    } catch (error: any) {
        res.status(500).json({ error: 'Failed to mark as received', message: error.message });
    }
});

// PATCH /api/business/returns/:id/refund - Process refund
router.patch('/business/returns/:id/refund', requireBrand, async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    try {
        const { id } = req.params;
        const { refundMethod, refundAmount } = req.body;
        const user = (req as any).user as { id?: string; businessId?: string } | undefined;
        if (!user?.businessId) return res.status(401).json({ error: 'Unauthorized' });

        let updatedReturn: any = null;

        await session.withTransaction(async () => {
            const returnRequest = await ReturnRequest.findOne({ _id: id, businessId: user.businessId }).session(session);
            if (!returnRequest) throw new Error('NOT_FOUND');

            if (returnRequest.status !== 'RECEIVED') {
                throw new Error('INVALID_STATE');
            }

            const finalRefundAmount = refundAmount || returnRequest.refundAmount;

            // Restore stock
            for (const item of returnRequest.items) {
                await Product.updateOne(
                    { _id: item.productId },
                    { $inc: { stock: item.quantity } },
                    { session }
                );
            }

            // Update return request
            returnRequest.status = 'REFUND_INITIATED';
            returnRequest.refundMethod = refundMethod || 'WALLET';
            returnRequest.refundAmount = finalRefundAmount;
            returnRequest.refundStatus = 'PROCESSING';
            returnRequest.timeline.push({
                status: 'REFUND_INITIATED',
                timestamp: new Date(),
                note: `Refund of ₹${finalRefundAmount} initiated via ${refundMethod || 'WALLET'}`,
                updatedBy: user.id ? new mongoose.Types.ObjectId(user.id) : undefined,
            });

            await returnRequest.save({ session });

            // Update order
            await Order.findByIdAndUpdate(
                returnRequest.orderId,
                { status: 'REFUNDED', refundAmount: finalRefundAmount },
                { session }
            );

            // TODO: Integrate with actual payment/wallet service
            // For now, mark as completed immediately
            returnRequest.status = 'REFUND_COMPLETED';
            returnRequest.refundStatus = 'COMPLETED';
            returnRequest.refundTransactionId = `REF${Date.now()}`;
            returnRequest.timeline.push({
                status: 'REFUND_COMPLETED',
                timestamp: new Date(),
                note: `Refund completed. Transaction ID: ${returnRequest.refundTransactionId}`,
            });

            await returnRequest.save({ session });
            updatedReturn = returnRequest;
        });

        res.json(updatedReturn);

        // Notify customer
        if (updatedReturn) {
            await createNotification(
                updatedReturn.userId.toString(),
                'RETURN',
                'Refund Processed',
                `Your refund of ₹${updatedReturn.refundAmount} for return ${updatedReturn.returnRequestNumber} has been processed.`
            );
        }

    } catch (error: any) {
        if (error?.message === 'NOT_FOUND') {
            return res.status(404).json({ error: 'Return request not found' });
        }
        if (error?.message === 'INVALID_STATE') {
            return res.status(400).json({ error: 'Return must be received before processing refund' });
        }
        res.status(500).json({ error: 'Failed to process refund', message: error.message });
    } finally {
        await session.endSession();
    }
});

// ============ ADMIN ENDPOINTS ============

// GET /api/super-admin/returns - List all returns
router.get('/super-admin/returns', requireAdmin, async (req: Request, res: Response) => {
    try {
        const { status, businessId, page = 1, limit = 50 } = req.query;

        const query: any = {};
        if (status) query.status = status;
        if (businessId) query.businessId = businessId;

        const skip = (Number(page) - 1) * Number(limit);

        const [returns, total] = await Promise.all([
            ReturnRequest.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit))
                .populate('orderId', 'shippingAddress totalAmount')
                .populate('businessId', 'businessIdentity.tradeName')
                .populate('userId', 'name email'),
            ReturnRequest.countDocuments(query),
        ]);

        res.json({
            returns,
            pagination: { total, page: Number(page), limit: Number(limit) },
        });
    } catch (error: any) {
        res.status(500).json({ error: 'Failed to fetch returns', message: error.message });
    }
});

// PATCH /api/super-admin/returns/:id/override - Admin override
router.patch('/super-admin/returns/:id/override', requireAdmin, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, adminNote, refundAmount } = req.body;
        const user = (req as any).user as { id?: string } | undefined;

        const returnRequest = await ReturnRequest.findById(id);
        if (!returnRequest) {
            return res.status(404).json({ error: 'Return request not found' });
        }

        returnRequest.status = status || returnRequest.status;
        returnRequest.adminNote = adminNote;
        if (refundAmount !== undefined) {
            returnRequest.refundAmount = refundAmount;
        }
        returnRequest.timeline.push({
            status: `ADMIN_OVERRIDE: ${status}`,
            timestamp: new Date(),
            note: adminNote || 'Status overridden by admin',
            updatedBy: user?.id ? new mongoose.Types.ObjectId(user.id) : undefined,
        });

        await returnRequest.save();
        res.json(returnRequest);

    } catch (error: any) {
        res.status(500).json({ error: 'Failed to override return', message: error.message });
    }
});

export default router;
