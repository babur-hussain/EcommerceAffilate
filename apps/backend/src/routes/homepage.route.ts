import { Router, Request, Response } from 'express';
import { HomepageConfig } from '../models/homepageConfig.model';
import { getCache, setCache } from '../utils/cache';
import { env } from '../config/env';
import { getRankedProducts, getRankedProductsByCategory } from '../services/ranking.service';

const router = Router();
const CACHE_KEY = 'homepage:rendered';

// GET /api/homepage - public render
router.get('/homepage', async (_req: Request, res: Response) => {
  try {
    const cached = getCache(CACHE_KEY);
    if (cached) return res.json(cached);

    const cfg = await HomepageConfig.findOne();
    if (!cfg || !cfg.isPublished) {
      return res.json({ version: 0, sections: [] });
    }

    // Build rendered payload: resolve each enabled section in order
    const ordered = [...cfg.sections]
      .filter((s: any) => s.enabled)
      .sort((a: any, b: any) => a.order - b.order);

    const sections = await Promise.all(
      ordered.map(async (s: any) => {
        switch (s.type) {
          case 'HERO_BANNER':
            return { type: s.type, title: s.title, subtitle: s.subtitle, config: s.config };
          case 'TEXT_BANNER':
            return { type: s.type, title: s.title, subtitle: s.subtitle, config: s.config };
          case 'PRODUCT_CAROUSEL': {
            const data = await getRankedProducts();
            const limit = Number(s?.config?.limit ?? 12);
            return { type: s.type, title: s.title, items: data.slice(0, limit) };
          }
          case 'SPONSORED_CAROUSEL': {
            const data = await getRankedProducts();
            const limit = Number(s?.config?.limit ?? 8);
            return { type: s.type, title: s.title, items: data.slice(0, limit) };
          }
          case 'CATEGORY_GRID': {
            const category = String(s?.config?.category || '').trim();
            const limit = Number(s?.config?.limit ?? 12);
            const items = category ? await getRankedProductsByCategory(category) : await getRankedProducts();
            return { type: s.type, title: s.title, items: items.slice(0, limit) };
          }
          default:
            return { type: s.type, title: s.title, config: s.config };
        }
      })
    );

    const payload = { version: cfg.publishedVersion, sections };
    setCache(CACHE_KEY, payload, env.cache.rankingHomeTtl);
    res.json(payload);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to render homepage', message: err.message });
  }
});

export default router;
