import { Router, Request, Response } from 'express';
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
import { User } from '../models/user.model';
import { Transaction } from '../models/transaction.model';
import mongoose from 'mongoose';

const router = Router();

// GET /wallet/history - Fetch transaction history
router.get('/wallet/history', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const transactions = await Transaction.find({ userId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Transaction.countDocuments({ userId });

        return res.json({
            transactions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching wallet history:', error);
        return res.status(500).json({ error: 'Failed to fetch wallet history' });
    }
});

// POST /wallet/add - Add coins (Admin/Internal use, or restricted)
// For now, we'll keep it simple. In a real app, this should be admin-only or server-to-server.
router.post('/wallet/add', verifyFirebaseToken, async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Basic authorization check - in real world check for ADMIN role
        // const requestUser = await User.findById(req.user?.id);
        // if (requestUser?.role !== 'ADMIN') ...

        const { userId, amount, description, referenceId } = req.body;

        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        // 1. Update User Balance
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { coins: amount } },
            { new: true, session }
        );

        if (!user) {
            throw new Error('User not found');
        }

        // 2. Create Transaction Record
        const transaction = new Transaction({
            userId,
            type: 'CREDIT',
            amount,
            description: description || 'Coins added',
            referenceId,
            status: 'COMPLETED'
        });

        await transaction.save({ session });

        await session.commitTransaction();
        return res.json({ success: true, newBalance: user.coins, transaction });

    } catch (error: any) {
        await session.abortTransaction();
        console.error('Error adding coins:', error);
        return res.status(500).json({ error: error.message || 'Failed to add coins' });
    } finally {
        session.endSession();
    }
});

// POST /wallet/deduct - Deduct coins
router.post('/wallet/deduct', verifyFirebaseToken, async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { userId, amount, description, referenceId } = req.body;

        // Use authenticated user ID if not provided in body (self-spend)
        // Or if admin, allow specifying userId
        const targetUserId = userId || req.user?.id;

        if (!targetUserId || !amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid parameters' });
        }

        const user = await User.findById(targetUserId).session(session);
        if (!user) {
            throw new Error('User not found');
        }

        if ((user.coins || 0) < amount) {
            throw new Error('Insufficient balance');
        }

        user.coins = (user.coins || 0) - amount;
        await user.save({ session });

        const transaction = new Transaction({
            userId: targetUserId,
            type: 'DEBIT',
            amount,
            description: description || 'Coins spent',
            referenceId,
            status: 'COMPLETED'
        });

        await transaction.save({ session });

        await session.commitTransaction();
        return res.json({ success: true, newBalance: user.coins, transaction });

    } catch (error: any) {
        await session.abortTransaction();
        console.error('Error deducting coins:', error);
        return res.status(400).json({ error: error.message || 'Failed to deduct coins' });
    } finally {
        session.endSession();
    }
});

export default router;
