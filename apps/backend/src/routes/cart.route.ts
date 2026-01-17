import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Cart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { requireCustomer } from '../middlewares/rbac';

const router = Router();

router.get('/cart', requireCustomer, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user as { id?: string } | undefined;
    if (!user?.id) return res.status(401).json({ error: 'Unauthorized' });

    let cart = await Cart.findOne({ userId: user.id }).populate('items.productId');
    if (!cart) {
      cart = await Cart.create({ userId: user.id, items: [] });
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

    const cart = await Cart.findOne({ userId: user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const originalLength = cart.items.length;
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);

    if (cart.items.length === originalLength) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    await cart.save();
    await cart.populate('items.productId');
    res.json(cart);
  } catch (error: any) {
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

    const cart = await Cart.findOne({ userId: user.id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    const product = await Product.findOne({ _id: productId, isActive: true }).select(
      '_id stock'
    );
    if (!product) {
      return res.status(400).json({ error: 'Product not found or inactive' });
    }

    const qty2 = quantity as number;
    if (qty2 > product.stock) {
      return res.status(400).json({ error: 'Insufficient stock for requested quantity' });
    }

    item.quantity = qty2;

    await cart.save();
    await cart.populate('items.productId');
    res.json(cart);
  } catch (error: any) {
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
