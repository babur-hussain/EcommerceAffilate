import { Router, Request, Response } from 'express';
import { getPlatformMetrics } from '../services/adminDashboard.service';
import { requireAdmin } from '../middlewares/rbac';

const router = Router();

// Restrict admin guard to /admin dashboard routes only
router.use('/admin', requireAdmin);

router.get('/admin/dashboard/metrics', async (_req: Request, res: Response) => {
  try {
    const metrics = await getPlatformMetrics();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch dashboard metrics',
      message: error.message,
    });
  }
});

export default router;
