import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { Address } from '../models/address.model';
import { requireCustomer } from '../middlewares/rbac';
import { estimateDeliveryTime } from '../utils/delivery';

const router = Router();

router.get('/cart', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    let cart = await Cart.findOne({ userId: user.id })
      .populate({
        path: 'items.productId',
        populate: {
          path: 'businessId',
          select: 'addresses'
        }
      })
      .lean();

    if (!cart) {
      // Create new cart if not exists (using Model to create)
      const newCart = await Cart.create({ userId: user.id, items: [] });
      return res.json(newCart);
    }

    // Fetch user's delivery address for estimation
    // Try to find default, otherwise first available
    const address = await Address.findOne({ userId: user.id })
      .sort({ isDefault: -1, updatedAt: -1 })
      .lean();

    const destinationPincode = address?.pincode;

    // Calculate delivery estimates for each item
    if (cart.items && cart.items.length > 0) {
      cart.items = cart.items.map((item: any) => {
        if (item.productId && typeof item.productId === 'object') {
          const product = item.productId;

          let deliveryEstimate = null;
          if (destinationPincode) {
            // Determine origin
            let origin = '110001'; // Default warehouse Delhi
            if (product.pickupLocation) {
              origin = product.pickupLocation;
            } else if (product.businessId && (product.businessId as any).addresses) {
              const biz = product.businessId as any;
              origin = biz.addresses?.operational?.pincode
                || biz.addresses?.registered?.pincode
                || '110001';
            }

            deliveryEstimate = estimateDeliveryTime(origin, String(destinationPincode));
          }

          // Attach to product
          item.productId = {
            ...product,
            deliveryEstimate
          };
        }
        return item;
      });
    }

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch cart', message: error.message });
  }
});

router.post('/cart/add', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, quantity } = req.body as { productId?: string; quantity?: number };

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be an integer >= 1' });
    }

    const product = await Product.findOne({ _id: productId, isActive: true }).select(
      '_id stock'
    );
    if (!product) {
      return res.status(400).json({ error: 'Product not found or inactive' });
    }

    let cart = await Cart.findOne({ userId: user.id });
    if (!cart) {
      cart = new Cart({ userId: user.id, items: [] });
    } else {
      // Auto-cleanup ghost items
      cart.items = cart.items.filter((item) => item && item.productId);
    }

    const existingItem = cart.items.find((item) => item.productId.toString() === productId);

    const qty = quantity as number;
    if (existingItem) {
      const desiredQty = existingItem.quantity + qty;
      if (desiredQty > product.stock) {
        return res.status(400).json({ error: 'Insufficient stock for requested quantity' });
      }
      existingItem.quantity = desiredQty;
    } else {
      if (qty > product.stock) {
        return res.status(400).json({ error: 'Insufficient stock for requested quantity' });
      }
      cart.items.push({ productId: new mongoose.Types.ObjectId(productId), quantity: qty });
    }

    await cart.save();
    await cart.populate('items.productId');
    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to add to cart', message: error.message });
  }
});

router.post('/cart/remove', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { productId } = req.body as { productId?: string };

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    let cart = await Cart.findOne({ userId: user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    // 1. Sanitize cart (remove ghost items)
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(item => item && item.productId);
    if (cart.items.length !== initialItemCount) {
      console.log(`🧹 cleaned up ${initialItemCount - cart.items.length} ghost items`);
    }

    // 2. Remove item
    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    if (cart.items.length === originalLength) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // 3. Save (persists cleanup)
    await cart.save();
    await cart.populate({
      path: 'items.productId',
      populate: {
        path: 'businessId',
        select: 'addresses'
      }
    });

    res.json(cart);
  } catch (error: any) {
    console.error('❌ Cart Remove Error:', error);
    res.status(500).json({ error: 'Failed to remove from cart', message: error.message });
  }
});

router.post('/cart/update', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    const { productId, quantity } = req.body as { productId?: string; quantity?: number };

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be an integer >= 1' });
    }

    let cart = await Cart.findOne({ userId: user.id });
    if (!cart) {
      console.log('❌ Cart not found');
      return res.status(404).json({ error: 'Cart not found' });
    }

    // 1. Sanitize cart (remove ghost items)
    const initialItemCount = cart.items.length;
    cart.items = cart.items.filter(item => item && item.productId);
    if (cart.items.length !== initialItemCount) {
      console.log(`🧹 cleaned up ${initialItemCount - cart.items.length} ghost items`);
    }

    // 2. Find target item
    const itemIndex = cart.items.findIndex((i) => i.productId.toString() === productId);

    if (itemIndex === -1) {
      console.log(`❌ Item not found in cart. Existing items: ${cart.items.map(i => i.productId.toString()).join(', ')}`);
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    const product = await Product.findOne({ _id: productId, isActive: true }).select(
      '_id stock'
    );
    if (!product) {
      console.log('❌ Product not found or inactive');
      return res.status(400).json({ error: 'Product not found or inactive' });
    }

    const qty2 = quantity as number;
    if (qty2 > product.stock) {
      console.log(`❌ Insufficient stock. Req: ${qty2}, Stock: ${product.stock}`);
      return res.status(400).json({ error: 'Insufficient stock for requested quantity' });
    }

    // 3. Update item
    cart.items[itemIndex].quantity = qty2;

    // 4. Save (triggers validation and persists cleanup)
    await cart.save();
    await cart.populate({
      path: 'items.productId',
      populate: {
        path: 'businessId',
        select: 'addresses'
      }
    });

    res.json(cart);
  } catch (error: any) {
    console.error('❌ Cart Update Error:', error);
    res.status(500).json({ error: 'Failed to update cart item', message: error.message });
  }
});

router.post('/cart/clear', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    let cart = await Cart.findOne({ userId: user.id });
    if (!cart) {
      cart = await Cart.create({ userId: user.id, items: [] });
    } else {
      cart.items = [];
      await cart.save();
    }

    res.json(cart);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to clear cart', message: error.message });
  }
});

export default router;
