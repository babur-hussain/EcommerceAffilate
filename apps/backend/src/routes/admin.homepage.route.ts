import { Router, Request, Response } from 'express';
import { HomepageConfig } from '../models/homepageConfig.model';
import { requireRoles } from '../middlewares/rbac';
import { delCache } from '../utils/cache';

// Admin: full control; Managers limited (create/update/reorder but not publish?)
const router = Router();
const requireAdminOrManager = requireRoles(['ADMIN', 'BUSINESS_MANAGER']);
const requireAdminOnly = requireRoles(['ADMIN']);

// Ensure a single config document exists
async function getOrCreateConfig() {
  const existing = await HomepageConfig.findOne();
  if (existing) return existing;
  return HomepageConfig.create({ sections: [], isPublished: false });
}

// GET /api/admin/homepage
router.get('/admin/homepage', requireAdminOrManager, async (_req: Request, res: Response) => {
  const cfg = await getOrCreateConfig();
  res.json(cfg);
});

// POST /api/admin/homepage/sections (create new section at end)
router.post('/admin/homepage/sections', requireAdminOrManager, async (req: Request, res: Response) => {
  const { type, title, subtitle, config, enabled } = req.body || {};
  const cfg = await getOrCreateConfig();
  const maxOrder = cfg.sections.reduce((m, s) => Math.max(m, s.order), 0);
  cfg.sections.push({
    type,
    title,
    subtitle,
    config: config || {},
    enabled: enabled !== false,
    order: maxOrder + 1,
  } as any);
  cfg.draftVersion += 1;
  await cfg.save();
  delCache('homepage:rendered');
  res.status(201).json(cfg);
});

// PUT /api/admin/homepage/sections/:id (update section)
router.put('/admin/homepage/sections/:id', requireAdminOrManager, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, subtitle, config, enabled, type } = req.body || {};
  const cfg = await getOrCreateConfig();
  const section = (cfg.sections as any).id(id);
  if (!section) return res.status(404).json({ error: 'Section not found' });
  if (type) (section as any).type = type;
  if (title !== undefined) (section as any).title = title;
  if (subtitle !== undefined) (section as any).subtitle = subtitle;
  if (enabled !== undefined) (section as any).enabled = !!enabled;
  if (config !== undefined) (section as any).config = config;
  cfg.draftVersion += 1;
  await cfg.save();
  delCache('homepage:rendered');
  res.json(cfg);
});

// PATCH /api/admin/homepage/reorder
router.patch('/admin/homepage/reorder', requireAdminOrManager, async (req: Request, res: Response) => {
  const { orderedIds } = req.body as { orderedIds: string[] };
  const cfg = await getOrCreateConfig();
  const orderMap = new Map(orderedIds.map((id, idx) => [id, idx + 1]));
  cfg.sections.forEach((s: any) => {
    const o = orderMap.get(String(s._id));
    if (o) s.order = o;
  });
  cfg.sections.sort((a: any, b: any) => a.order - b.order);
  cfg.draftVersion += 1;
  await cfg.save();
  delCache('homepage:rendered');
  res.json(cfg);
});

// POST /api/admin/homepage/publish (admin only)
router.post('/admin/homepage/publish', requireAdminOnly, async (_req: Request, res: Response) => {
  const cfg = await getOrCreateConfig();
  cfg.isPublished = true;
  cfg.publishedVersion = cfg.draftVersion;
  await cfg.save();
  delCache('homepage:rendered');
  res.json(cfg);
});

export default router;
