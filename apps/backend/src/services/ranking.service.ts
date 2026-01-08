import { Product, IProduct } from '../models/product.model';
import { Sponsorship } from '../models/sponsorship.model';
import { consumeBudget } from './sponsorship.service';
import mongoose from 'mongoose';
import { buildOptimizedVariants, resolvePrimaryImage } from '../utils/image';
import { getCategoryMeta } from '../utils/categoryMeta';

const formatProduct = (product: any) => {
  const obj = typeof product.toObject === 'function' ? product.toObject() : product;
  const primaryImage = resolvePrimaryImage(obj);
  return {
    ...obj,
    primaryImage,
    optimizedImages: buildOptimizedVariants(primaryImage),
    seoTitle: obj.metaTitle || obj.title,
    seoDescription: obj.metaDescription || obj.description,
    seoKeywords: obj.metaKeywords || [],
    categoryMeta: getCategoryMeta(obj.category),
  };
};

/**
 * Get product IDs that currently have active sponsorships
 * Filters by:
 * - isActive = true
 * - Current date between startDate and endDate
 */
export const getActiveSponsoredProductIds = async (): Promise<mongoose.Types.ObjectId[]> => {
  const currentDate = new Date();

  const activeSponsors = await Sponsorship.find({
    isActive: true,
    startDate: { $lte: currentDate },
    endDate: { $gte: currentDate },
  }).select('productId');

  return activeSponsors.map((s) => s.productId);
};

/**
 * Get ranked products for homepage/listings
 * 
 * Algorithm:
 * 1. Fetch active sponsored product IDs
 * 2. Fetch all active products
 * 3. Separate into sponsored vs organic
 * 4. Sort sponsored by sponsoredScore DESC
 * 5. Sort organic by (popularityScore + rating) DESC
 * 6. Merge: sponsored first, then organic
 * 7. Remove duplicates
 */
export const getRankedProducts = async (): Promise<IProduct[]> => {
  // Get currently sponsored products
  const sponsoredProductIds = await getActiveSponsoredProductIds();
  const sponsoredIdStrings = sponsoredProductIds.map((id) => id.toString());

  // Fetch all active products
  const allProducts = await Product.find({ isActive: true });

  // Separate sponsored vs organic
  const sponsoredProductsRaw = allProducts.filter((product) =>
    sponsoredIdStrings.includes(product._id.toString())
  );

  const sponsoredProducts: IProduct[] = [];
  for (const product of sponsoredProductsRaw) {
    const allowed = await consumeBudget(product._id.toString());
    if (allowed) {
      product.isSponsored = true;
      sponsoredProducts.push(product);
    }
  }

  const organicProducts = allProducts.filter(
    (product) => !sponsoredIdStrings.includes(product._id.toString())
  );

  // Sort sponsored by sponsoredScore DESC
  sponsoredProducts.sort((a, b) => b.sponsoredScore - a.sponsoredScore);

  // Sort organic by (popularityScore + rating) DESC
  organicProducts.sort((a, b) => b.popularityScore - a.popularityScore);

  // Merge: sponsored first, then organic
  const rankedProducts = [...sponsoredProducts, ...organicProducts];

  // Remove duplicates (in case a product appears in both lists)
  const uniqueProducts = Array.from(
    new Map(rankedProducts.map((p) => [p._id.toString(), p])).values()
  );

  return uniqueProducts.map(formatProduct);
};

/**
 * Get ranked products for a specific category
 * Uses the same rules as homepage ranking but filters products to the category first.
 */
export const getRankedProductsByCategory = async (category: string): Promise<IProduct[]> => {
  if (!category) return [];

  const sponsoredProductIds = await getActiveSponsoredProductIds();
  const sponsoredIdStrings = new Set(sponsoredProductIds.map((id) => id.toString()));

  // Only pull active products in this category
  const categoryProducts = await Product.find({ isActive: true, category });

  const sponsoredProductsRaw = categoryProducts.filter((product) =>
    sponsoredIdStrings.has(product._id.toString())
  );

  const sponsoredWithBudget: IProduct[] = [];
  for (const product of sponsoredProductsRaw) {
    const allowed = await consumeBudget(product._id.toString());
    if (allowed) {
      product.isSponsored = true;
      sponsoredWithBudget.push(product);
    }
  }

  const organicProducts = categoryProducts.filter(
    (product) => !sponsoredIdStrings.has(product._id.toString())
  );

  sponsoredWithBudget.sort((a, b) => b.sponsoredScore - a.sponsoredScore);

  organicProducts.sort((a, b) => b.popularityScore - a.popularityScore);

  const rankedProducts = [...sponsoredWithBudget, ...organicProducts];

  const uniqueProducts = Array.from(
    new Map(rankedProducts.map((p) => [p._id.toString(), p])).values()
  );

  return uniqueProducts.map(formatProduct);
};

/**
 * Get ranked products for a search query
 * Uses the same sponsored-first ordering but filters products by query match.
 */
export const searchRankedProducts = async (query: string): Promise<IProduct[]> => {
  const normalizedQuery = (query || '').trim().toLowerCase();
  if (!normalizedQuery) return [];

  const sponsoredProductIds = await getActiveSponsoredProductIds();
  const sponsoredIdStrings = new Set(sponsoredProductIds.map((id) => id.toString()));

  // Text search with fallback to regex if no hits
  const textMatches = await Product.find(
    {
      isActive: true,
      $text: { $search: normalizedQuery },
    },
    { score: { $meta: 'textScore' } }
  )
    .sort({ score: { $meta: 'textScore' } })
    .lean();

  let matchedProducts: Array<IProduct & { score?: number }> = textMatches as any;

  if (!matchedProducts.length) {
    matchedProducts = (await Product.find({
      isActive: true,
      $or: [
        { title: { $regex: normalizedQuery, $options: 'i' } },
        { category: { $regex: normalizedQuery, $options: 'i' } },
        { brand: { $regex: normalizedQuery, $options: 'i' } },
        { description: { $regex: normalizedQuery, $options: 'i' } },
      ],
    }).lean()) as any;
  }

  const sponsoredProductsRaw = matchedProducts.filter((product) =>
    sponsoredIdStrings.has(product._id.toString())
  );

  const sponsoredProducts: IProduct[] = [];
  for (const product of sponsoredProductsRaw) {
    const allowed = await consumeBudget(product._id.toString());
    if (allowed) {
      product.isSponsored = true;
      sponsoredProducts.push(product);
    }
  }

  const organicProducts = matchedProducts.filter(
    (product) => !sponsoredIdStrings.has(product._id.toString())
  );

  sponsoredProducts.sort((a, b) => b.sponsoredScore - a.sponsoredScore);

  organicProducts.sort((a, b) => {
    const scoreA = (a.popularityScore * 0.7) + (a.rating * 0.3);
    const scoreB = (b.popularityScore * 0.7) + (b.rating * 0.3);
    return scoreB - scoreA;
  });

  const rankedProducts = [...sponsoredProducts, ...organicProducts];

  const uniqueProducts = Array.from(
    new Map(rankedProducts.map((p) => [p._id.toString(), p])).values()
  );

  return uniqueProducts.map(formatProduct);
};
