import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Sponsorship } from '../models/sponsorship.model';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { requireRoles } from '../middlewares/rbac';

const router = Router();

// POST /api/sponsorships - Create a sponsorship (BUSINESS_OWNER, BUSINESS_MANAGER only)
router.post('/sponsorships', requireRoles(['BUSINESS_OWNER', 'BUSINESS_MANAGER', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { productId, startDate, endDate, budget, dailyBudget } = req.body;
    const user = (req as any).user as { id?: string; businessId?: string; role?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    // Validate required fields
    if (!productId || !startDate || !endDate || !budget || !dailyBudget) {
      res.status(400).json({
        error: 'Missing required fields: productId, startDate, endDate, budget, dailyBudget',
      });
      return;
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    // Validate product exists and is active
    const product = await Product.findById(productId).select('brandId businessId isActive title');
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    if (!product.isActive) {
      return res.status(400).json({ error: 'Cannot sponsor an inactive product' });
    }

    // Validate brand exists and is active
    const brand = await Brand.findById(product.brandId).select('businessId isActive');
    if (!brand || !brand.isActive) {
      return res.status(404).json({ error: 'Brand not found or inactive' });
    }

    // Ownership check: product → brand → business
    if (user.role !== 'ADMIN') {
      if (!user.businessId) {
        return res.status(403).json({ error: 'Business context is required' });
      }
      if (product.businessId.toString() !== user.businessId) {
        return res.status(403).json({ error: 'Forbidden: Product does not belong to your business' });
      }
    }

    // Validate budget values
    if (typeof budget !== 'number' || budget <= 0) {
      res.status(400).json({
        error: 'Budget must be a number greater than 0',
      });
      return;
    }

    if (typeof dailyBudget !== 'number' || dailyBudget <= 0) {
      res.status(400).json({
        error: 'Daily budget must be a number greater than 0',
      });
      return;
    }

    if (dailyBudget > budget) {
      res.status(400).json({
        error: 'Daily budget cannot exceed total budget',
      });
      return;
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({
        error: 'Invalid date format',
      });
      return;
    }

    if (end <= start) {
      res.status(400).json({
        error: 'End date must be after start date',
      });
      return;
    }

    // Create sponsorship with businessId and PENDING status
    const sponsorship = await Sponsorship.create({
      productId,
      businessId: product.businessId,
      startDate: start,
      endDate: end,
      budget,
      dailyBudget,
      isActive: false,
      status: 'PENDING',
    });

    res.status(201).json(sponsorship);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to create sponsorship',
      message: error.message,
    });
  }
});

// GET /api/sponsorships/mine - Sponsorships for the authenticated business's products
router.get('/sponsorships/mine', requireRoles(['BUSINESS_OWNER', 'BUSINESS_MANAGER', 'BUSINESS_STAFF', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string; businessId?: string; role?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    let query: any = {};
    
    // ADMIN bypasses business scope
    if (user.role !== 'ADMIN' && user.businessId) {
      query.businessId = new mongoose.Types.ObjectId(user.businessId);
    }

    const sponsorships = await Sponsorship.find(query)
      .populate('productId', 'title businessId brandId isActive')
      .sort({ createdAt: -1 });

    res.json(sponsorships);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch sponsorships',
      message: error.message,
    });
  }
});

// PATCH /api/sponsorships/:id/approve - Admin approves sponsorship
router.patch('/sponsorships/:id/approve', requireRoles(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid sponsorship ID' });
    }

    const sponsorship = await Sponsorship.findById(id);
    if (!sponsorship) {
      return res.status(404).json({ error: 'Sponsorship not found' });
    }

    if (sponsorship.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only PENDING sponsorships can be approved' });
    }

    sponsorship.status = 'APPROVED';
    const updated = await sponsorship.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to approve sponsorship',
      message: error.message,
    });
  }
});

// PATCH /api/sponsorships/:id/reject - Admin rejects sponsorship
router.patch('/sponsorships/:id/reject', requireRoles(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid sponsorship ID' });
    }

    const sponsorship = await Sponsorship.findById(id);
    if (!sponsorship) {
      return res.status(404).json({ error: 'Sponsorship not found' });
    }

    if (sponsorship.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only PENDING sponsorships can be rejected' });
    }

    sponsorship.status = 'REJECTED';
    const updated = await sponsorship.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to reject sponsorship',
      message: error.message,
    });
  }
});

// PATCH /api/sponsorships/:id/activate - Admin activates an APPROVED sponsorship
router.patch('/sponsorships/:id/activate', requireRoles(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid sponsorship ID' });
    }

    const sponsorship = await Sponsorship.findById(id);
    if (!sponsorship) {
      return res.status(404).json({ error: 'Sponsorship not found' });
    }

    if (sponsorship.status !== 'APPROVED') {
      return res.status(400).json({ error: 'Only APPROVED sponsorships can be activated' });
    }

    sponsorship.status = 'ACTIVE';
    sponsorship.isActive = true;
    const updated = await sponsorship.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to activate sponsorship',
      message: error.message,
    });
  }
});

// PATCH /api/sponsorships/:id/pause - Admin pauses a sponsorship
router.patch('/sponsorships/:id/pause', requireRoles(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid sponsorship ID' });
    }

    const sponsorship = await Sponsorship.findById(id);
    if (!sponsorship) {
      return res.status(404).json({ error: 'Sponsorship not found' });
    }

    sponsorship.status = 'PAUSED';
    sponsorship.isActive = false;
    const updated = await sponsorship.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to pause sponsorship',
      message: error.message,
    });
  }
});

// GET /api/sponsorships/active - Get active sponsorships (PUBLIC)
router.get('/sponsorships/active', async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();

    // Find sponsorships that are:
    // 1. status = ACTIVE
    // 2. isActive = true
    // 3. Current date is between startDate and endDate
    const sponsorships = await Sponsorship.find({
      status: 'ACTIVE',
      isActive: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    })
      .populate('productId', 'title slug price category brand image businessId')
      .sort({ createdAt: -1 });

    res.json(sponsorships);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to fetch active sponsorships',
      message: error.message,
    });
  }
});

export default router;
