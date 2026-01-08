import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Brand } from '../models/brand.model';
import { getBrandProducts, getBrandSponsorships } from '../services/brand.service';
import { requireRoles } from '../middlewares/rbac';
import { UserRole } from '../models/user.model';

const router = Router();

// GET /brands - List all brands under user's business
router.get('/brands', requireRoles(['BUSINESS_OWNER', 'BUSINESS_MANAGER', 'BUSINESS_STAFF', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string; businessId?: string; role?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    let query: any = { isActive: true };
    
    // ADMIN bypasses business scope, sees all brands
    if (user.role !== 'ADMIN' && user.businessId) {
      query.businessId = new mongoose.Types.ObjectId(user.businessId);
    }

    const brands = await Brand.find(query).select('_id name businessId isActive createdAt updatedAt').lean();
    res.json(brands);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch brands', message: error.message });
  }
});

// POST /brands - Create a new brand
router.post('/brands', requireRoles(['BUSINESS_OWNER', 'BUSINESS_MANAGER', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const user = (req as any).user as { id?: string; businessId?: string; role?: string } | undefined;
    
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Brand name is required and must be a string' });
    }

    // Determine businessId: ADMIN can create for any business, otherwise use user's business
    let businessId = user.businessId;
    if (user.role === 'ADMIN' && (req.body.businessId || (req.body.businessId !== undefined && typeof req.body.businessId === 'string'))) {
      businessId = req.body.businessId;
    }

    if (!businessId) {
      return res.status(400).json({ error: 'Business context is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(businessId)) {
      return res.status(400).json({ error: 'Invalid businessId' });
    }

    const brand = await Brand.create({
      name: name.trim(),
      businessId: new mongoose.Types.ObjectId(businessId),
      isActive: true,
    });

    res.status(201).json(brand);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Brand with this name already exists for this business' });
    }
    res.status(500).json({ error: 'Failed to create brand', message: error.message });
  }
});

// GET /brands/:id - Get a specific brand
router.get('/brands/:id', requireRoles(['BUSINESS_OWNER', 'BUSINESS_MANAGER', 'BUSINESS_STAFF', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user as { id?: string; businessId?: string; role?: string } | undefined;

    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid brand ID' });
    }

    const brand = await Brand.findById(id).lean();
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    // Check ownership unless ADMIN
    if (user.role !== 'ADMIN' && brand.businessId.toString() !== user.businessId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    res.json(brand);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch brand', message: error.message });
  }
});

// PUT /brands/:id - Update brand (name, businessId if ADMIN)
router.put('/brands/:id', requireRoles(['BUSINESS_OWNER', 'BUSINESS_MANAGER', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const user = (req as any).user as { id?: string; businessId?: string; role?: string } | undefined;

    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid brand ID' });
    }

    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    // Check ownership unless ADMIN
    if (user.role !== 'ADMIN' && brand.businessId.toString() !== user.businessId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (name && typeof name === 'string' && name.trim()) {
      brand.name = name.trim();
    }

    const updated = await brand.save();
    res.json(updated);
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Brand with this name already exists for this business' });
    }
    res.status(500).json({ error: 'Failed to update brand', message: error.message });
  }
});

// PATCH /brands/:id/status - Activate/deactivate brand
router.patch('/brands/:id/status', requireRoles(['BUSINESS_OWNER', 'BUSINESS_MANAGER', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const user = (req as any).user as { id?: string; businessId?: string; role?: string } | undefined;

    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid brand ID' });
    }

    const brand = await Brand.findById(id);
    if (!brand) return res.status(404).json({ error: 'Brand not found' });

    // Check ownership unless ADMIN
    if (user.role !== 'ADMIN' && brand.businessId.toString() !== user.businessId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    brand.isActive = isActive;
    const updated = await brand.save();
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update brand status', message: error.message });
  }
});

// Legacy endpoints: /brand/products, /brand/sponsorships
router.get('/brand/products', requireRoles(['BUSINESS_OWNER', 'BUSINESS_MANAGER', 'BUSINESS_STAFF', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string; businessId?: string } | undefined;
    if (!user?.id || !user.businessId) return res.status(401).json({ error: 'Unauthorized' });

    const products = await getBrandProducts(user.businessId);
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch brand products', message: error.message });
  }
});

router.get('/brand/sponsorships', requireRoles(['BUSINESS_OWNER', 'BUSINESS_MANAGER', 'BUSINESS_STAFF', 'ADMIN']), async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string; businessId?: string } | undefined;
    if (!user?.id || !user.businessId) return res.status(401).json({ error: 'Unauthorized' });

    const sponsorships = await getBrandSponsorships(user.businessId);
    // Filter out populated docs where product didn't match owner
    const filtered = sponsorships.filter((s) => (s as any).productId);
    res.json(filtered);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch brand sponsorships', message: error.message });
  }
});

export default router;
