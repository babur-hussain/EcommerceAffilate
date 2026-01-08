import { Coupon } from '../models/coupon.model';

export const validateCoupon = async (code: string, orderAmount: number) => {
  if (!code || typeof code !== 'string') throw new Error('Invalid coupon code');
  if (typeof orderAmount !== 'number' || orderAmount < 0) throw new Error('Invalid order amount');

  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase() });
  if (!coupon) throw new Error('COUPON_NOT_FOUND');
  if (!coupon.isActive) throw new Error('COUPON_INACTIVE');
  const now = new Date();
  if (coupon.startDate && now < coupon.startDate) throw new Error('COUPON_NOT_STARTED');
  if (coupon.endDate && now > coupon.endDate) throw new Error('COUPON_EXPIRED');
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) throw new Error('COUPON_USAGE_EXCEEDED');
  if (orderAmount < coupon.minOrderAmount) throw new Error('ORDER_AMOUNT_TOO_LOW');

  // compute discount
  let discount = 0;
  if (coupon.type === 'FLAT') {
    discount = coupon.value;
  } else {
    discount = (orderAmount * coupon.value) / 100;
  }
  if (coupon.maxDiscount != null) {
    discount = Math.min(discount, coupon.maxDiscount);
  }
  discount = Math.max(0, Math.min(discount, orderAmount));

  return { coupon, discount };
};

export const applyCoupon = async (code: string, orderAmount: number) => {
  const { coupon, discount } = await validateCoupon(code, orderAmount);
  const finalAmount = Math.max(0, orderAmount - discount);
  return { coupon, discount, finalAmount };
};

export const incrementUsage = async (code: string) => {
  const result = await Coupon.findOneAndUpdate(
    { code: code.trim().toUpperCase() },
    { $inc: { usedCount: 1 } },
    { new: true }
  );
  return result;
};
