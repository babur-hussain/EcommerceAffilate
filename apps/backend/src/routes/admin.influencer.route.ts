import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { InfluencerAttribution } from '../models/influencerAttribution.model';
import { User } from '../models/user.model';
import { requireAdmin } from '../middlewares/rbac';
import { createNotification } from '../services/notification.service';
import { logAction } from '../services/audit.service';
import {
  getAttributionsByBusiness,
  getTotalCommissionByBusiness,
  getTotalCommissionByInfluencer,
} from '../services/influencer.service';
import { User } from '../models/user.model';

const router = Router();

// GET /admin/influencer/payouts - List all pending/approved payouts
router.get('/admin/influencer/payouts', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { status, businessId, influencerId, page = 1, limit = 50 } = req.query;

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(100, Math.max(1, Number(limit) || 50));
    const skip = (pageNum - 1) * limitNum;

    let query: any = {};

    // Filter by status if provided
    if (typeof status === 'string' && ['PENDING', 'APPROVED', 'PAID', 'REJECTED'].includes(status)) {
      query.status = status;
    }

    // Filter by business if provided
    if (businessId && mongoose.Types.ObjectId.isValid(businessId as string)) {
      query.businessId = new mongoose.Types.ObjectId(businessId as string);
    }

    // Filter by influencer if provided
    if (influencerId && mongoose.Types.ObjectId.isValid(influencerId as string)) {
      query.influencerUserId = new mongoose.Types.ObjectId(influencerId as string);
    }

    const total = await InfluencerAttribution.countDocuments(query);
    const payouts = await InfluencerAttribution.find(query)
      .populate('influencerUserId', 'email')
      .populate('businessId', 'name')
      .populate('brandId', 'name')
      .populate('productId', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      data: payouts,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch payouts', message: error.message });
  }
});

// GET /admin/influencer/payouts/:id - Get specific payout details
router.get('/admin/influencer/payouts/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid payout ID' });
    }

    const payout = await InfluencerAttribution.findById(id)
      .populate('influencerUserId', 'email')
      .populate('businessId', 'name ownerUserId')
      .populate('brandId', 'name')
      .populate('productId', 'title')
      .populate('orderId', 'totalAmount status');

    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' });
    }

    res.json(payout);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch payout', message: error.message });
  }
});

// POST /admin/influencer/payouts/:id/approve - Approve a pending payout
router.post('/admin/influencer/payouts/:id/approve', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid payout ID' });
    }

    const payout = await InfluencerAttribution.findById(id);
    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' });
    }

    if (payout.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only PENDING payouts can be approved' });
    }

    payout.status = 'APPROVED';
    const updated = await payout.save();

    // Notify influencer
    const influencer = await User.findById(payout.influencerUserId).select('_id');
    if (influencer) {
      await createNotification(
        influencer._id.toString(),
        'PAYOUT',
        'Commission approved',
        `Your commission of ₹${payout.commissionAmount.toFixed(2)} has been approved for payout.`
      );
    }

    void logAction({
      userId: (req as any)?.user?.id,
      role: (req as any)?.user?.role,
      action: 'INFLUENCER_PAYOUT_APPROVED',
      entityType: 'INFLUENCER_ATTRIBUTION',
      entityId: payout._id.toString(),
      metadata: { influencerId: payout.influencerUserId.toString(), amount: payout.commissionAmount },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to approve payout', message: error.message });
  }
});

// POST /admin/influencer/payouts/:id/reject - Reject a pending payout
router.post('/admin/influencer/payouts/:id/reject', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body as { reason?: string };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid payout ID' });
    }

    const payout = await InfluencerAttribution.findById(id);
    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' });
    }

    if (payout.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only PENDING payouts can be rejected' });
    }

    payout.status = 'REJECTED';
    const updated = await payout.save();

    // Notify influencer
    const influencer = await User.findById(payout.influencerUserId).select('_id');
    if (influencer) {
      await createNotification(
        influencer._id.toString(),
        'PAYOUT',
        'Commission rejected',
        `Your commission of ₹${payout.commissionAmount.toFixed(2)} was rejected. Reason: ${reason || 'No reason provided'}`
      );
    }

    void logAction({
      userId: (req as any)?.user?.id,
      role: (req as any)?.user?.role,
      action: 'INFLUENCER_PAYOUT_REJECTED',
      entityType: 'INFLUENCER_ATTRIBUTION',
      entityId: payout._id.toString(),
      metadata: { influencerId: payout.influencerUserId.toString(), amount: payout.commissionAmount, reason },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to reject payout', message: error.message });
  }
});

// POST /admin/influencer/payouts/:id/pay - Mark payout as paid
router.post('/admin/influencer/payouts/:id/pay', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid payout ID' });
    }

    const payout = await InfluencerAttribution.findById(id);
    if (!payout) {
      return res.status(404).json({ error: 'Payout not found' });
    }

    if (payout.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Only APPROVED payouts can be paid' });
    }

    payout.status = 'PAID';
    const updated = await payout.save();

    // Notify influencer
    const influencer = await User.findById(payout.influencerUserId).select('_id');
    if (influencer) {
      await createNotification(
        influencer._id.toString(),
        'PAYOUT',
        'Payment processed',
        `Your commission of ₹${payout.commissionAmount.toFixed(2)} has been paid to your account.`
      );
    }

    void logAction({
      userId: (req as any)?.user?.id,
      role: (req as any)?.user?.role,
      action: 'INFLUENCER_PAYOUT_PAID',
      entityType: 'INFLUENCER_ATTRIBUTION',
      entityId: payout._id.toString(),
      metadata: { influencerId: payout.influencerUserId.toString(), amount: payout.commissionAmount },
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to process payout', message: error.message });
  }
});

// GET /admin/influencer/payouts/business/:businessId/summary - Get business payout summary
router.get('/admin/influencer/payouts/business/:businessId/summary', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { businessId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ error: 'Invalid business ID' });
    }

    const pending = await getTotalCommissionByBusiness(businessId, 'PENDING');
    const approved = await getTotalCommissionByBusiness(businessId, 'APPROVED');
    const paid = await getTotalCommissionByBusiness(businessId, 'PAID');
    const rejected = await getTotalCommissionByBusiness(businessId, 'REJECTED');

    const attributions = await getAttributionsByBusiness(businessId);

    res.json({
      businessId,
      summary: {
        pending,
        approved,
        paid,
        rejected,
        total: pending + approved + paid + rejected,
      },
      attributionCount: attributions.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch business payout summary', message: error.message });
  }
});

// GET /admin/influencers - List influencers
router.get('/admin/influencers', requireAdmin, async (req: Request, res: Response) => {
  try {
    const influencers = await User.find({ role: 'INFLUENCER' }).select('_id email isActive createdAt updatedAt').sort({ createdAt: -1 });
    res.json(influencers);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch influencers', message: error.message });
  }
});

// PATCH /admin/influencers/:id/status - Approve/Suspend influencer
router.patch('/admin/influencers/:id/status', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body as { isActive?: boolean };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid influencer ID' });
    }
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    const updated = await User.findOneAndUpdate({ _id: id, role: 'INFLUENCER' }, { isActive }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Influencer not found' });

    void logAction({
      userId: (req as any)?.user?.id,
      role: (req as any)?.user?.role,
      action: isActive ? 'INFLUENCER_APPROVED' : 'INFLUENCER_SUSPENDED',
      entityType: 'USER',
      entityId: id,
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update influencer', message: error.message });
  }
});

// GET /admin/influencers/:id/summary - Earnings summary
router.get('/admin/influencers/:id/summary', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid influencer ID' });
    }

    const summary = await Promise.all([
      getTotalCommissionByInfluencer(id, 'PENDING'),
      getTotalCommissionByInfluencer(id, 'APPROVED'),
      getTotalCommissionByInfluencer(id, 'PAID'),
      getTotalCommissionByInfluencer(id, 'REJECTED'),
    ]);

    res.json({
      influencerId: id,
      pending: summary[0],
      approved: summary[1],
      paid: summary[2],
      rejected: summary[3],
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch influencer summary', message: error.message });
  }
});

export default router;
