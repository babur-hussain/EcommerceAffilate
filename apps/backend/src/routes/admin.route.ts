import { Router, Request, Response } from 'express';
import {
  approveSponsorship,
  pauseSponsorship,
  rejectSponsorship,
  updateSponsoredScore,
} from '../services/sponsorship.service';
import { requireAdmin } from '../middlewares/rbac';
import { logAction } from '../services/audit.service';
import { Sponsorship } from '../models/sponsorship.model';

const router = Router();

// Scope admin auth to /admin paths so other /api routes stay public
router.use('/admin', requireAdmin);

// GET /api/admin/sponsorships?status=PENDING
router.get('/admin/sponsorships', async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const query: Record<string, any> = {};
    if (typeof status === 'string') {
      query.status = status;
    }
    const sponsorships = await Sponsorship.find(query)
      .populate('productId', 'title brand')
      .sort({ createdAt: -1 })
      .lean();
    res.json(sponsorships);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sponsorships', message: error.message });
  }
});

// POST /api/admin/sponsorships/:id/approve - Activate a sponsorship
router.post('/admin/sponsorships/:id/approve', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await approveSponsorship(id);

    void logAction({
      userId: (req as any)?.user?.id,
      role: (req as any)?.user?.role,
      action: 'SPONSORSHIP_APPROVE',
      entityType: 'SPONSORSHIP',
      entityId: id,
      metadata: { status: updated.status },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to approve sponsorship',
      message: error.message,
    });
  }
});

// POST /api/admin/sponsorships/:id/pause - Pause a sponsorship
router.post('/admin/sponsorships/:id/pause', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await pauseSponsorship(id);

    void logAction({
      userId: (req as any)?.user?.id,
      role: (req as any)?.user?.role,
      action: 'SPONSORSHIP_PAUSE',
      entityType: 'SPONSORSHIP',
      entityId: id,
      metadata: { status: updated.status },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to pause sponsorship',
      message: error.message,
    });
  }
});

// POST /api/admin/sponsorships/:id/reject - Reject a sponsorship
router.post('/admin/sponsorships/:id/reject', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updated = await rejectSponsorship(id);

    void logAction({
      userId: (req as any)?.user?.id,
      role: (req as any)?.user?.role,
      action: 'SPONSORSHIP_REJECT',
      entityType: 'SPONSORSHIP',
      entityId: id,
      metadata: { status: updated.status },
    });
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to reject sponsorship',
      message: error.message,
    });
  }
});

// POST /api/admin/products/:id/sponsored-score - Update sponsored score for ranking
router.post('/admin/products/:id/sponsored-score', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { score } = req.body;

    if (score === undefined) {
      return res.status(400).json({ error: 'Score is required' });
    }

    const updatedProduct = await updateSponsoredScore(id, score);

    void logAction({
      userId: (req as any)?.user?.id,
      role: (req as any)?.user?.role,
      action: 'SPONSORED_SCORE_UPDATE',
      entityType: 'PRODUCT',
      entityId: id,
      metadata: { score },
    });
    res.json(updatedProduct);
  } catch (error: any) {
    res.status(400).json({
      error: 'Failed to update sponsored score',
      message: error.message,
    });
  }
});

export default router;
