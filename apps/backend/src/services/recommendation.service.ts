import mongoose from 'mongoose';
import { Product, IProduct } from '../models/product.model';
import { Wishlist } from '../models/wishlist.model';
import { Order } from '../models/order.model';
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

export const getTrendingProducts = async (limit = 20): Promise<any[]> => {
  const products = await Product.find({ isActive: true })
    .sort({ popularityScore: -1 })
    .limit(limit)
    .lean();

  return products.map(formatProduct);
};

export const getRelatedProducts = async (productId: string, limit = 20): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(productId)) return [];

  const source = await Product.findById(productId).select('category').lean();
  if (!source?.category) return [];

  const products = await Product.find({
    isActive: true,
    category: source.category,
    _id: { $ne: productId },
  })
    .sort({ popularityScore: -1 })
    .limit(limit)
    .lean();

  return products.map(formatProduct);
};

export const getUserRecommendations = async (userId: string, limit = 20): Promise<any[]> => {
  if (!mongoose.Types.ObjectId.isValid(userId)) return getTrendingProducts(limit);

  const categories = new Set<string>();

  const wishlist = await Wishlist.findOne({ userId }).lean();
  if (wishlist?.productIds?.length) {
    const wishlistProducts = await Product.find({ _id: { $in: wishlist.productIds }, isActive: true })
      .select('category')
      .lean();
    wishlistProducts.forEach((p) => p.category && categories.add(p.category));
  }

  const userOrders = await Order.find({ userId })
    .select('items.productId')
    .lean();

  const orderProductIds = new Set<string>();
  userOrders.forEach((o) => {
    o.items?.forEach((item) => orderProductIds.add(item.productId.toString()));
  });

  if (orderProductIds.size > 0) {
    const products = await Product.find({ _id: { $in: Array.from(orderProductIds) }, isActive: true })
      .select('category')
      .lean();
    products.forEach((p) => p.category && categories.add(p.category));
  }

  if (categories.size === 0) {
    return getTrendingProducts(limit);
  }

  const recommendations = await Product.find({ isActive: true, category: { $in: Array.from(categories) } })
    .sort({ popularityScore: -1 })
    .limit(limit)
    .lean();

  // De-duplicate by _id
  const unique = Array.from(new Map(recommendations.map((p) => [p._id.toString(), p])).values());

  return unique.map(formatProduct);
};
