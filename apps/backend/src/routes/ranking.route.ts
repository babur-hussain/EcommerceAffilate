import { Router, Request, Response } from 'express';
import { getRankedProducts, getRankedProductsByCategory, searchRankedProducts } from '../services/ranking.service';
import { getCache, setCache, RANKING_CACHE_PREFIX } from '../utils/cache';
import { env } from '../config/env';

const router = Router();
const HOMEPAGE_CACHE_KEY = `${RANKING_CACHE_PREFIX}homepage`;

// GET /api/ranking/homepage - Get ranked products for homepage
router.get('/ranking/homepage', async (req: Request, res: Response) => {
  try {
    const cached = getCache(HOMEPAGE_CACHE_KEY);
    if (cached) {
      return res.json(cached);
    }

    const rankedProducts = await getRankedProducts();
    setCache(HOMEPAGE_CACHE_KEY, rankedProducts, env.cache.rankingHomeTtl);
    res.json(rankedProducts);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch ranked products',
      message: error.message,
    });
  }
});

// GET /api/ranking/category/:category - Get ranked products for a specific category
router.get('/ranking/category/:category', async (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    if (!category) {
      return res.json([]);
    }

    const cacheKey = `${RANKING_CACHE_PREFIX}category:${category}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const rankedProducts = await getRankedProductsByCategory(category);
    setCache(cacheKey, rankedProducts, env.cache.rankingCategoryTtl);
    res.json(rankedProducts);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch ranked products by category',
      message: error.message,
    });
  }
});

// GET /api/ranking/search?q=keyword - Get ranked products for a search query
router.get('/ranking/search', async (req: Request, res: Response) => {
  try {
    const rawQuery = (req.query.q as string) || '';
    const normalizedQuery = rawQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      return res.json([]);
    }

    const cacheKey = `${RANKING_CACHE_PREFIX}search:${normalizedQuery}`;
    const cached = getCache(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const rankedProducts = await searchRankedProducts(normalizedQuery);
    setCache(cacheKey, rankedProducts, env.cache.rankingSearchTtl);
    res.json(rankedProducts);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch ranked products for search',
      message: error.message,
    });
  }
});

export default router;
