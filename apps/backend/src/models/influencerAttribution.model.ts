import mongoose, { Schema, Document } from 'mongoose';

export interface IInfluencerAttribution extends Document {
  influencerUserId: mongoose.Types.ObjectId;
  businessId: mongoose.Types.ObjectId;
  brandId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  commissionAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const influencerAttributionSchema = new Schema<IInfluencerAttribution>(
  {
    influencerUserId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Influencer user ID is required'],
    },
    businessId: {
      type: Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business ID is required'],
    },
    brandId: {
      type: Schema.Types.ObjectId,
      ref: 'Brand',
      required: [true, 'Brand ID is required'],
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID is required'],
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID is required'],
      index: true,
      unique: true,
    },
    commissionAmount: {
      type: Number,
      required: [true, 'Commission amount is required'],
      min: [0, 'Commission must be non-negative'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'PAID', 'REJECTED'],
      default: 'PENDING',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries by influencer and business
influencerAttributionSchema.index({ influencerUserId: 1, businessId: 1 });
influencerAttributionSchema.index({ businessId: 1, status: 1 });
influencerAttributionSchema.index({ influencerUserId: 1, status: 1 });
influencerAttributionSchema.index({ createdAt: -1 });

export const InfluencerAttribution = mongoose.model<IInfluencerAttribution>(
  'InfluencerAttribution',
  influencerAttributionSchema
);
