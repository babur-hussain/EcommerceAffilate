import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';
import { Brand } from '../models/brand.model';
import { InfluencerAttribution, IInfluencerAttribution } from '../models/influencerAttribution.model';
import { Order } from '../models/order.model';
import { createNotification } from './notification.service';
import { logAction } from './audit.service';

const INFLUENCER_COMMISSION_RATE = 0.1; // 10% commission

/**
 * Create influencer attribution record when an order is placed with influencer code.
 * Validates influencer is active, product belongs to business, calculates commission.
 */
export const createInfluencerAttribution = async (
  orderId: string,
  influencerCode: string
): Promise<IInfluencerAttribution | null> => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new Error('Invalid order ID');
  }

  if (!influencerCode || typeof influencerCode !== 'string') {
    return null;
  }

  const order = await Order.findById(orderId).select('items totalAmount');
  if (!order) {
    throw new Error('Order not found');
  }

  // Find influencer by code (using email as code for now)
  const influencer = await User.findOne({
    email: influencerCode.toLowerCase(),
    role: 'INFLUENCER',
    isActive: true,
  }).select('_id businessId');

  if (!influencer) {
    // Invalid influencer code - silently fail, no attribution
    return null;
  }

  // Validate that all products in order belong to same business
  const products = await Product.find({
    _id: { $in: order.items.map((i) => i.productId) },
  }).select('businessId brandId');

  if (!products.length) {
    return null;
  }

  // All products must belong to same business
  const businessIds = new Set(products.map((p) => p.businessId.toString()));
  if (businessIds.size !== 1) {
    throw new Error('Order contains products from multiple businesses');
  }

  const businessId = products[0].businessId;
  const brandId = products[0].brandId;

  // Calculate commission based on order total
  const commissionAmount = order.totalAmount * INFLUENCER_COMMISSION_RATE;

  // Create attribution record
  const attribution = await InfluencerAttribution.create({
    influencerUserId: influencer._id,
    businessId,
    brandId,
    productId: order.items[0].productId, // Reference first product
    orderId: new mongoose.Types.ObjectId(orderId),
    commissionAmount,
    status: 'PENDING',
  });

  // Notify influencer of new attribution
  await createNotification(
    influencer._id.toString(),
    'COMMISSION',
    'Commission earned',
    `You earned ₹${commissionAmount.toFixed(2)} from order ${orderId}`
  );

  return attribution;
};

/**
 * Reject an attribution and optionally reverse commission (if not paid).
 */
export const rejectInfluencerAttribution = async (attributionId: string): Promise<IInfluencerAttribution> => {
  if (!mongoose.Types.ObjectId.isValid(attributionId)) {
    throw new Error('Invalid attribution ID');
  }

  const attribution = await InfluencerAttribution.findById(attributionId);
  if (!attribution) {
    throw new Error('Attribution not found');
  }

  if (attribution.status === 'PAID') {
    throw new Error('Cannot reject a paid attribution');
  }

  attribution.status = 'REJECTED';
  const updated = await attribution.save();

  // Notify influencer
  const influencer = await User.findById(attribution.influencerUserId).select('_id');
  if (influencer) {
    await createNotification(
      influencer._id.toString(),
      'COMMISSION',
      'Commission cancelled',
      `Your commission of ₹${attribution.commissionAmount.toFixed(2)} for order ${attribution.orderId} was cancelled.`
    );
  }

  return updated;
};

/**
 * Get all pending/approved attributions for a business.
 */
export const getAttributionsByBusiness = async (
  businessId: string,
  status?: string
): Promise<IInfluencerAttribution[]> => {
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    throw new Error('Invalid business ID');
  }

  const query: any = { businessId: new mongoose.Types.ObjectId(businessId) };
  if (status) {
    query.status = status;
  }

  return InfluencerAttribution.find(query)
    .populate('influencerUserId', 'email')
    .populate('brandId', 'name')
    .populate('productId', 'title')
    .sort({ createdAt: -1 });
};

/**
 * Get all attributions for an influencer.
 */
export const getAttributionsByInfluencer = async (
  influencerId: string,
  status?: string
): Promise<IInfluencerAttribution[]> => {
  if (!mongoose.Types.ObjectId.isValid(influencerId)) {
    throw new Error('Invalid influencer ID');
  }

  const query: any = { influencerUserId: new mongoose.Types.ObjectId(influencerId) };
  if (status) {
    query.status = status;
  }

  return InfluencerAttribution.find(query)
    .populate('businessId', 'name')
    .populate('brandId', 'name')
    .populate('productId', 'title')
    .sort({ createdAt: -1 });
};

/**
 * Calculate total commission for an influencer.
 */
export const getTotalCommissionByInfluencer = async (
  influencerId: string,
  status?: string
): Promise<number> => {
  if (!mongoose.Types.ObjectId.isValid(influencerId)) {
    throw new Error('Invalid influencer ID');
  }

  const pipeline: any[] = [
    {
      $match: {
        influencerUserId: new mongoose.Types.ObjectId(influencerId),
      },
    },
  ];

  if (status) {
    pipeline[0].$match.status = status;
  }

  pipeline.push({
    $group: {
      _id: null,
      total: { $sum: '$commissionAmount' },
    },
  });

  const result = await InfluencerAttribution.aggregate(pipeline);
  return result[0]?.total ?? 0;
};

/**
 * Calculate total commission for a business.
 */
export const getTotalCommissionByBusiness = async (
  businessId: string,
  status?: string
): Promise<number> => {
  if (!mongoose.Types.ObjectId.isValid(businessId)) {
    throw new Error('Invalid business ID');
  }

  const pipeline: any[] = [
    {
      $match: {
        businessId: new mongoose.Types.ObjectId(businessId),
      },
    },
  ];

  if (status) {
    pipeline[0].$match.status = status;
  }

  pipeline.push({
    $group: {
      _id: null,
      total: { $sum: '$commissionAmount' },
    },
  });

  const result = await InfluencerAttribution.aggregate(pipeline);
  return result[0]?.total ?? 0;
};
