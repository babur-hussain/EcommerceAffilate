import { Router, Request, Response } from 'express';
import { requireCustomer } from '../middlewares/rbac';
import { verifyFirebaseTokenOptional } from '../middlewares/firebaseAuth';
import {
  getTrendingProducts,
  getRelatedProducts,
  getUserRecommendations,
} from '../services/recommendation.service';

const router = Router();

// Public read routes — optional auth for analytics context
router.get('/recommendations/trending', verifyFirebaseTokenOptional, async (_req: Request, res: Response) => {
  try {
    const products = await getTrendingProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch trending products', message: error.message });
  }
});

router.get('/recommendations/product/:id', verifyFirebaseTokenOptional, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const products = await getRelatedProducts(id);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch related products', message: error.message });
  }
});

router.get('/recommendations/user', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const products = await getUserRecommendations(user.id);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch user recommendations', message: error.message });
  }
});

export default router;
