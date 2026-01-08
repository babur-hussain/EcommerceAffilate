import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { requireCustomer } from '../middlewares/rbac';
import { Wishlist } from '../models/wishlist.model';
import { Product } from '../models/product.model';

const router = Router();

router.get('/wishlist', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    let wishlist = await Wishlist.findOne({ userId: user.id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ userId: user.id, productIds: [] });
    }

    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch wishlist', message: error.message });
  }
});

router.post('/wishlist/add', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { productId } = req.body as { productId?: string };

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const product = await Product.findOne({ _id: productId, isActive: true }).select('_id');
    if (!product) {
      return res.status(400).json({ error: 'Product not found or inactive' });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: user.id },
      { $addToSet: { productIds: productId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add to wishlist', message: error.message });
  }
});

router.post('/wishlist/remove', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { productId } = req.body as { productId?: string };

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: user.id },
      { $pull: { productIds: productId } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to remove from wishlist', message: error.message });
  }
});

router.post('/wishlist/clear', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const wishlist = await Wishlist.findOneAndUpdate(
      { userId: user.id },
      { $set: { productIds: [] } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(wishlist);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to clear wishlist', message: error.message });
  }
});

export default router;
