import mongoose, { Schema, Document } from 'mongoose';

export type CouponType = 'FLAT' | 'PERCENT';

export interface ICoupon extends Document {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount: number;
  maxDiscount?: number;
  startDate?: Date;
  endDate?: Date;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const couponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, trim: true, uppercase: true },
    type: { type: String, enum: ['FLAT', 'PERCENT'], required: true },
    value: { type: Number, required: true, min: 0 },
    minOrderAmount: { type: Number, default: 0, min: 0 },
    maxDiscount: { type: Number, min: 0 },
    startDate: { type: Date },
    endDate: { type: Date },
    usageLimit: { type: Number, min: 1 },
    usedCount: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: 'coupons' }
);

couponSchema.index({ code: 1 }, { unique: true });
couponSchema.index({ isActive: 1 });
couponSchema.index({ startDate: 1, endDate: 1 });

export const Coupon = mongoose.model<ICoupon>('Coupon', couponSchema);
