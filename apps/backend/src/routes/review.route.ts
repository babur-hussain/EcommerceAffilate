import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { requireCustomer } from '../middlewares/rbac';
import { Review } from '../models/review.model';
import { Order } from '../models/order.model';
import { Product } from '../models/product.model';

const router = Router();

router.post('/reviews', requireCustomer, async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, rating, comment } = req.body as {
      productId?: string;
      rating?: number;
      comment?: string;
    };

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    const product = await Product.findOne({ _id: productId, isActive: true }).select('_id');
    if (!product) {
      return res.status(400).json({ error: 'Product not found or inactive' });
    }

    const hasDeliveredOrder = await Order.findOne({
      userId: user.id,
      status: 'DELIVERED',
      'items.productId': productId,
    })
      .select('_id')
      .lean();

    if (!hasDeliveredOrder) {
      return res.status(400).json({ error: 'You can only review products you have received' });
    }

    let createdReview;

    await session.withTransaction(async () => {
      const existing = await Review.findOne({ productId, userId: user.id }).session(session);
      if (existing) {
        throw new Error('ALREADY_REVIEWED');
      }

      const reviewDocs = await Review.create(
        [
          {
            productId,
            userId: user.id,
            rating,
            comment,
          },
        ],
        { session }
      );

      createdReview = reviewDocs[0];

      const stats = await Review.aggregate([
        { $match: { productId: new mongoose.Types.ObjectId(productId) } },
        { $group: { _id: '$productId', count: { $sum: 1 }, avg: { $avg: '$rating' } } },
      ])
        .session(session)
        .exec();

      const agg = stats[0];
      if (agg) {
        await Product.updateOne(
          { _id: productId },
          { $set: { rating: agg.avg, ratingCount: agg.count } },
          { session }
        );
      }
    });

    res.status(201).json(createdReview);
  } catch (error: any) {
    if (error?.message === 'ALREADY_REVIEWED') {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }
    res.status(500).json({ error: 'Failed to create review', message: error.message });
  } finally {
    await session.endSession();
  }
});

router.get('/reviews/:productId', async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    const reviews = await Review.find({ productId })
      .sort({ createdAt: -1 })
      .select('userId rating comment createdAt');

    res.json(reviews);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch reviews', message: error.message });
  }
});

export default router;
