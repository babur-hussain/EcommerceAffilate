import mongoose from 'mongoose';
import { Sponsorship, ISponsorship } from '../models/sponsorship.model';
import { Product, IProduct } from '../models/product.model';
import { Business } from '../models/business.model';
import { clearCacheByPrefix, RANKING_CACHE_PREFIX } from '../utils/cache';
import { createNotification } from './notification.service';
import { env } from '../config/env';

const { Types } = mongoose;

export const approveSponsorship = async (sponsorshipId: string): Promise<ISponsorship> => {
  if (!Types.ObjectId.isValid(sponsorshipId)) {
    throw new Error('Invalid sponsorship ID');
  }

  const sponsorship = await Sponsorship.findByIdAndUpdate(
    sponsorshipId,
    { status: 'APPROVED' },
    { new: true }
  );

  if (!sponsorship) {
    throw new Error('Sponsorship not found');
  }

  // Notify the product owner that the sponsorship is approved
  const product = await Product.findById(sponsorship.productId).select('businessId title');
  if (product?.businessId) {
    const business = await Business.findById(product.businessId).select('userId');
    if (business?.userId) {
      await createNotification(
        business.userId.toString(),
        'SPONSORSHIP',
        'Sponsorship approved',
        `Your sponsorship for ${product.title ?? 'a product'} has been approved.`
      );
    }
  }

  clearCacheByPrefix(RANKING_CACHE_PREFIX);
  return sponsorship;
};

export const pauseSponsorship = async (sponsorshipId: string): Promise<ISponsorship> => {
  if (!Types.ObjectId.isValid(sponsorshipId)) {
    throw new Error('Invalid sponsorship ID');
  }

  const sponsorship = await Sponsorship.findByIdAndUpdate(
    sponsorshipId,
    { isActive: false, status: 'PAUSED' },
    { new: true }
  );

  if (!sponsorship) {
    throw new Error('Sponsorship not found');
  }

  clearCacheByPrefix(RANKING_CACHE_PREFIX);
  return sponsorship;
};

export const rejectSponsorship = async (sponsorshipId: string): Promise<ISponsorship> => {
  if (!Types.ObjectId.isValid(sponsorshipId)) {
    throw new Error('Invalid sponsorship ID');
  }

  const sponsorship = await Sponsorship.findByIdAndUpdate(
    sponsorshipId,
    { isActive: false, status: 'REJECTED' },
    { new: true }
  );

  if (!sponsorship) {
    throw new Error('Sponsorship not found');
  }

  clearCacheByPrefix(RANKING_CACHE_PREFIX);
  return sponsorship;
};

export const updateSponsoredScore = async (
  productId: string,
  score: number
): Promise<IProduct> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }

  if (typeof score !== 'number' || Number.isNaN(score)) {
    throw new Error('Score must be a number');
  }

  if (score < 0 || score > 100) {
    throw new Error('Score must be between 0 and 100');
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }

  product.sponsoredScore = score;
  await product.save();

  clearCacheByPrefix(RANKING_CACHE_PREFIX);

  return product;
};

const getClickCost = (): number => {
  return env.ads.clickCost;
};

/**
 * Consume budget for a sponsored click (CPC).
 * Only APPROVED/ACTIVE sponsorships with ACTIVE products can be charged.
 * Returns true if a sponsored campaign was charged, false if none matched.
 */
export const consumeClickBudget = async (productId: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }

  const clickCost = getClickCost();
  const session = await mongoose.startSession();
  let charged = false;

  try {
    await session.withTransaction(async () => {
      const now = new Date();

      // Ensure product is active
      const product = await Product.findById(productId).select('isActive').session(session);
      if (!product || !product.isActive) {
        charged = false;
        return;
      }

      // Find ACTIVE sponsorship (must be ACTIVE status, not PENDING/APPROVED)
      const sponsorship = await Sponsorship.findOne(
        {
          productId,
          status: 'ACTIVE', // Only ACTIVE sponsorships can be charged
          isActive: true,
          startDate: { $lte: now },
          endDate: { $gte: now },
          budget: { $gte: clickCost },
        },
        null,
        { session }
      );

      if (!sponsorship) {
        charged = false;
        return;
      }

      sponsorship.budget = Math.max(0, sponsorship.budget - clickCost);
      if (sponsorship.budget <= 0) {
        sponsorship.isActive = false;
      }

      await sponsorship.save({ session });
      clearCacheByPrefix(RANKING_CACHE_PREFIX);
      charged = true;
    });
  } finally {
    await session.endSession();
  }

  return charged;
};

/**
 * Consume budget for an impression of a sponsored product.
 * Only ACTIVE sponsorships with ACTIVE products can be billed.
 * Uses a transaction to avoid negative balances and races.
 */
export const consumeBudget = async (productId: string): Promise<boolean> => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }

  const session = await mongoose.startSession();
  let consumed = false;

  try {
    await session.withTransaction(async () => {
      const now = new Date();

      // Ensure product is active
      const product = await Product.findById(productId).select('isActive').session(session);
      if (!product || !product.isActive) {
        consumed = false;
        return;
      }

      // Find ACTIVE sponsorship (must be ACTIVE status, not PENDING/APPROVED)
      const sponsorship = await Sponsorship.findOne(
        {
          productId,
          status: 'ACTIVE', // Only ACTIVE sponsorships can be billed
          isActive: true,
          startDate: { $lte: now },
          endDate: { $gte: now },
          budget: { $gt: 0 },
          dailyBudget: { $gt: 0 },
        },
        null,
        { session }
      );

      if (!sponsorship) {
        consumed = false;
        return;
      }

      consumed = true; // Impression allowed for this request.

      sponsorship.budget = Math.max(0, sponsorship.budget - 1);
      sponsorship.dailyBudget = Math.max(0, sponsorship.dailyBudget - 1);

      if (sponsorship.budget <= 0 || sponsorship.dailyBudget <= 0) {
        sponsorship.isActive = false;
      }

      await sponsorship.save({ session });
      clearCacheByPrefix(RANKING_CACHE_PREFIX);
    });
  } finally {
    await session.endSession();
  }

  return consumed;
};
