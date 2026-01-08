import { Router, Request, Response } from 'express';
import { requireAdmin, requireCustomer } from '../middlewares/rbac';
import { applyCoupon, validateCoupon } from '../services/coupon.service';
import { Coupon } from '../models/coupon.model';

const router = Router();

router.post('/coupons/validate', requireCustomer, async (req: Request, res: Response) => {
  try {
    const { code, orderAmount } = req.body as { code?: string; orderAmount?: number };
    if (typeof code !== 'string' || typeof orderAmount !== 'number') {
      return res.status(400).json({ error: 'code and orderAmount are required' });
    }
    const { coupon, discount } = await validateCoupon(code, orderAmount);
    res.json({ valid: true, code: coupon.code, type: coupon.type, discount });
  } catch (error: any) {
    res.status(400).json({ valid: false, error: error?.message || 'Failed to validate coupon' });
  }
});

router.post('/coupons/apply', requireCustomer, async (req: Request, res: Response) => {
  try {
    const { code, orderAmount } = req.body as { code?: string; orderAmount?: number };
    if (typeof code !== 'string' || typeof orderAmount !== 'number') {
      return res.status(400).json({ error: 'code and orderAmount are required' });
    }
    const { coupon, discount, finalAmount } = await applyCoupon(code, orderAmount);
    res.json({ code: coupon.code, type: coupon.type, discount, finalAmount });
  } catch (error: any) {
    res.status(400).json({ error: error?.message || 'Failed to apply coupon' });
  }
});

router.post('/admin/coupons', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { code, type, value, minOrderAmount, maxDiscount, startDate, endDate, usageLimit, isActive } =
      (req.body as any) ?? {};

    if (typeof code !== 'string' || (type !== 'FLAT' && type !== 'PERCENT') || typeof value !== 'number') {
      return res.status(400).json({ error: 'code, type, value are required' });
    }

    const payload: any = {
      code: code.trim().toUpperCase(),
      type,
      value,
      minOrderAmount: typeof minOrderAmount === 'number' ? minOrderAmount : 0,
      isActive: isActive !== false,
    };
    if (typeof maxDiscount === 'number') payload.maxDiscount = maxDiscount;
    if (typeof usageLimit === 'number') payload.usageLimit = usageLimit;
    if (startDate) payload.startDate = new Date(startDate);
    if (endDate) payload.endDate = new Date(endDate);

    const created = await Coupon.create(payload);
    res.status(201).json(created);
  } catch (error: any) {
    if (error?.code === 11000) {
      return res.status(400).json({ error: 'Coupon code already exists' });
    }
    res.status(500).json({ error: 'Failed to create coupon', message: error.message });
  }
});

export default router;
