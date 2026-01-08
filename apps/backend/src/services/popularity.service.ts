import { IProduct } from '../models/product.model';

export const calculatePopularityScore = (product: Pick<IProduct, 'views' | 'clicks'>): number => {
  const score = (product.views * 0.2) + (product.clicks * 1);
  return Math.max(0, score);
};
