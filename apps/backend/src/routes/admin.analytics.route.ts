import { Router, Request, Response } from 'express';
import { getProductStats, getSponsorshipStats } from '../services/analytics.service';
import { requireAdmin } from '../middlewares/rbac';

const router = Router();

// Apply admin guard only for /admin-prefixed analytics routes
router.use('/admin', requireAdmin);

router.get('/admin/analytics/products/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stats = await getProductStats(id);
    res.json(stats);
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch product analytics';
    const status = message.includes('Invalid') ? 400 : message.includes('not found') ? 404 : 500;
    res.status(status).json({ error: 'Failed to fetch product analytics', message });
  }
});

router.get('/admin/analytics/sponsorships/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const stats = await getSponsorshipStats(id);
    res.json(stats);
  } catch (error: any) {
    const message = error?.message || 'Failed to fetch sponsorship analytics';
    const status = message.includes('Invalid') ? 400 : message.includes('not found') ? 404 : 500;
    res.status(status).json({ error: 'Failed to fetch sponsorship analytics', message });
  }
});

export default router;
