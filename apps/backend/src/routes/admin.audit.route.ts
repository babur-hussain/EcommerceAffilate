import { Router, Request, Response } from 'express';
import { requireAdmin } from '../middlewares/rbac';
import { AuditLog } from '../models/auditLog.model';

const router = Router();

// Guard only the /admin audit routes
router.use('/admin', requireAdmin);

router.get('/admin/audit-logs', async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const { entityType, action, startDate, endDate } = req.query as { entityType?: string; action?: string; startDate?: string; endDate?: string };

    const filter: Record<string, any> = {};
    if (entityType) filter.entityType = entityType;
    if (action) filter.action = action;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const [data, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      AuditLog.countDocuments(filter),
    ]);

    res.json({ data, page, limit, total });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch audit logs', message: error.message });
  }
});

export default router;
