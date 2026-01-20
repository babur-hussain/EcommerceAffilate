import { Router, Request, Response } from 'express';
import { requireCustomer } from '../middlewares/rbac';
import * as cartService from '../services/cart.service';
import mongoose from 'mongoose';

const router = Router();

// ==========================================
// 🛒 CART API ROUTES
// ==========================================

/**
 * GET /cart
 * Get the current user's cart with populated product details
 */
router.get('/cart', requireCustomer, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
    }

    const result = await cartService.getCart(userId);

    if (!result.success) {
      return res.status(500).json({
        error: result.error,
        code: result.code,
      });
    }

    return res.json(result.cart);
  } catch (error: any) {
    console.error('GET /cart error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * POST /cart/add
 * Add an item to the cart
 * Body: { productId: string, quantity?: number }
 */
router.post('/cart/add', requireCustomer, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
    }

    const { productId, quantity = 1 } = req.body;

    // Validate productId is provided
    if (!productId) {
      return res.status(400).json({
        error: 'Product ID is required',
        code: 'MISSING_PRODUCT_ID',
      });
    }

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        error: 'Invalid product ID format',
        code: 'INVALID_PRODUCT_ID',
      });
    }

    // Validate quantity
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 1) {
      return res.status(400).json({
        error: 'Quantity must be a positive integer',
        code: 'INVALID_QUANTITY',
      });
    }

    if (qty > 99) {
      return res.status(400).json({
        error: 'Maximum quantity per item is 99',
        code: 'QUANTITY_EXCEEDED',
      });
    }

    const result = await cartService.addToCart(userId, productId, qty);

    if (!result.success) {
      const statusCode = result.code === 'PRODUCT_NOT_FOUND' ? 404 :
        result.code === 'OUT_OF_STOCK' || result.code === 'PRODUCT_UNAVAILABLE' ? 400 : 500;

      return res.status(statusCode).json({
        error: result.error,
        code: result.code,
        details: result.details,
      });
    }

    // Include warning in response if quantity was adjusted
    const response: any = result.cart;
    if (result.details?.warning) {
      response.warning = result.details.warning;
    }

    return res.json(response);
  } catch (error: any) {
    console.error('POST /cart/add error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * POST /cart/update
 * Update the quantity of a cart item
 * Body: { productId: string, quantity: number }
 */
router.post('/cart/update', requireCustomer, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    console.log('🔧 CART UPDATE - userId:', userId, 'body:', JSON.stringify(req.body));

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
    }

    const { productId, quantity } = req.body;

    // Validate productId is provided
    if (!productId) {
      return res.status(400).json({
        error: 'Product ID is required',
        code: 'MISSING_PRODUCT_ID',
      });
    }

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        error: 'Invalid product ID format',
        code: 'INVALID_PRODUCT_ID',
      });
    }

    // Validate quantity
    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        error: 'Quantity is required',
        code: 'MISSING_QUANTITY',
      });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      return res.status(400).json({
        error: 'Quantity must be a non-negative integer',
        code: 'INVALID_QUANTITY',
      });
    }

    if (qty > 99) {
      return res.status(400).json({
        error: 'Maximum quantity per item is 99',
        code: 'QUANTITY_EXCEEDED',
      });
    }

    console.log('🔧 CART UPDATE - Calling service with userId:', userId, 'productId:', productId, 'qty:', qty);
    const result = await cartService.updateCartItemQuantity(userId, productId, qty);
    console.log('🔧 CART UPDATE - Service result:', JSON.stringify(result, null, 2));

    if (!result.success) {
      const statusCode =
        result.code === 'CART_NOT_FOUND' || result.code === 'ITEM_NOT_IN_CART' ? 404 :
          result.code === 'PRODUCT_UNAVAILABLE' ? 400 : 500;

      return res.status(statusCode).json({
        error: result.error,
        code: result.code,
        details: result.details,
      });
    }

    // Include warning in response if quantity was adjusted
    const response: any = result.cart;
    if (result.details?.warning) {
      response.warning = result.details.warning;
    }

    return res.json(response);
  } catch (error: any) {
    console.error('POST /cart/update error:', error.message, error.stack);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * POST /cart/remove
 * Remove an item from the cart
 * Body: { productId: string }
 */
router.post('/cart/remove', requireCustomer, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
    }

    const { productId } = req.body;

    // Validate productId is provided
    if (!productId) {
      return res.status(400).json({
        error: 'Product ID is required',
        code: 'MISSING_PRODUCT_ID',
      });
    }

    // Validate productId format
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        error: 'Invalid product ID format',
        code: 'INVALID_PRODUCT_ID',
      });
    }

    const result = await cartService.removeFromCart(userId, productId);

    if (!result.success) {
      return res.status(500).json({
        error: result.error,
        code: result.code,
      });
    }

    return res.json(result.cart);
  } catch (error: any) {
    console.error('POST /cart/remove error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * POST /cart/clear
 * Clear all items from the cart
 */
router.post('/cart/clear', requireCustomer, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
    }

    const result = await cartService.clearCart(userId);

    if (!result.success) {
      return res.status(500).json({
        error: result.error,
        code: result.code,
      });
    }

    return res.json(result.cart);
  } catch (error: any) {
    console.error('POST /cart/clear error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * POST /cart/sync
 * Sync guest cart to user cart after login
 * Body: { items: [{ productId: string, quantity: number }] }
 */
router.post('/cart/sync', requireCustomer, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
    }

    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({
        error: 'Items array is required',
        code: 'MISSING_ITEMS',
      });
    }

    const result = await cartService.syncGuestCart(userId, items);

    if (!result.success) {
      return res.status(500).json({
        error: result.error,
        code: result.code,
      });
    }

    return res.json(result.cart);
  } catch (error: any) {
    console.error('POST /cart/sync error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

/**
 * POST /cart/validate
 * Validate cart for checkout (re-check stock, remove unavailable items)
 */
router.post('/cart/validate', requireCustomer, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({
        error: 'User not authenticated',
        code: 'UNAUTHORIZED',
      });
    }

    const result = await cartService.validateCartForCheckout(userId);

    if (!result.success) {
      const statusCode = result.code === 'EMPTY_CART' || result.code === 'NO_VALID_ITEMS' ? 400 : 500;

      return res.status(statusCode).json({
        error: result.error,
        code: result.code,
        details: result.details,
      });
    }

    const response: any = result.cart;
    if (result.details?.warnings) {
      response.warnings = result.details.warnings;
    }

    return res.json(response);
  } catch (error: any) {
    console.error('POST /cart/validate error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      code: 'INTERNAL_ERROR',
    });
  }
});

export default router;
