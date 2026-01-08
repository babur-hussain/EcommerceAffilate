import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { requireAdmin } from '../middlewares/rbac';
import { Business } from '../models/business.model';
import { Brand } from '../models/brand.model';
import { Product } from '../models/product.model';

const router = Router();

// Only guard admin-prefixed business routes
router.use('/admin', requireAdmin);

router.get('/admin/businesses', async (_req: Request, res: Response) => {
  try {
    const businesses = await Business.find({}).sort({ createdAt: -1 }).lean();
    res.json(businesses);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch businesses', message: error.message });
  }
});

router.patch('/admin/businesses/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body as { isActive?: boolean };

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid business ID' });
    }
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    const updated = await Business.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Business not found' });
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update business status', message: error.message });
  }
});

router.get('/admin/businesses/:id/brands', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid business ID' });
    }
    const brands = await Brand.find({ businessId: id }).lean();
    res.json(brands);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch brands', message: error.message });
  }
});

router.get('/admin/businesses/:id/products', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid business ID' });
    }
    const products = await Product.find({ businessId: id }).lean();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch products', message: error.message });
  }
});

export default router;
