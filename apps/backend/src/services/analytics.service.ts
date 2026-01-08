import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import { Sponsorship } from '../models/sponsorship.model';

const { Types } = mongoose;

export const getProductStats = async (productId: string) => {
  if (!Types.ObjectId.isValid(productId)) {
    throw new Error('Invalid product ID');
  }

  const product = await Product.findById(productId).select('views clicks popularityScore');
  if (!product) {
    throw new Error('Product not found');
  }

  return {
    views: product.views,
    clicks: product.clicks,
    popularityScore: product.popularityScore,
  };
};

export const getSponsorshipStats = async (sponsorshipId: string) => {
  if (!Types.ObjectId.isValid(sponsorshipId)) {
    throw new Error('Invalid sponsorship ID');
  }

  const sponsorship = await Sponsorship.findById(sponsorshipId).select('budget dailyBudget isActive');
  if (!sponsorship) {
    throw new Error('Sponsorship not found');
  }

  return {
    budgetRemaining: sponsorship.budget,
    dailyBudgetRemaining: sponsorship.dailyBudget,
    isActive: sponsorship.isActive,
  };
};
