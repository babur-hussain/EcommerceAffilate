import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middlewares/rbac';
import { Notification } from '../models/notification.model';
import { markAsRead } from '../services/notification.service';

const router = Router();

router.get('/notifications', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const notifications = await Notification.find({ userId: user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json(notifications);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch notifications', message: error.message });
  }
});

router.post('/notifications/:id/read', requireAuth, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid notification id' });
    }

    const updated = await Notification.findOneAndUpdate(
      { _id: id, userId: user.id },
      { isRead: true },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to mark notification as read', message: error.message });
  }
});

export default router;
