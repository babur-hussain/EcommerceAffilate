import mongoose from 'mongoose';
import { Product } from '../models/product.model';
import { Request, Response, NextFunction } from 'express';

export const verifyProductOwnership = async (
  productId: string,
  user: { id: string; role: string; businessId?: string }
): Promise<boolean> => {
  if (user.role === 'ADMIN') return true;
  if (!mongoose.Types.ObjectId.isValid(productId)) return false;

  // 1. Check main products collection
  const product = await Product.findById(productId).select('businessId');
  if (product) {
    return !!user.businessId && product.businessId?.toString() === user.businessId;
  }

  // 2. Check grocery_products collection
  if (mongoose.connection.db) {
    const groceryProduct = await mongoose.connection.db
      .collection('grocery_products')
      .findOne({ _id: new mongoose.Types.ObjectId(productId) }, { projection: { businessId: 1 } });

    if (groceryProduct) {
      return !!user.businessId && groceryProduct.businessId?.toString() === user.businessId;
    }
  }

  return false;
};

export const requireProductOwnership = (paramKey = 'id') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).user as { id?: string; role?: string; businessId?: string } | undefined;
      if (!user?.id || !user.role) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const productId = req.params[paramKey];
      const allowed = await verifyProductOwnership(productId, user as { id: string; role: string; businessId?: string });
      if (!allowed) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      next();
    } catch (err: any) {
      return res.status(500).json({ error: 'Ownership check failed', message: err.message });
    }
  };
};
