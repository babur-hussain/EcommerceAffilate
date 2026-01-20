import mongoose from 'mongoose';
import { Cart, ICart, ICartItem } from '../models/cart.model';
import { Product, IProduct } from '../models/product.model';

// Fields to populate for cart items
const PRODUCT_POPULATE_FIELDS = '_id title price mrp image images stock isActive isCodAvailable shippingCharges';

export interface CartOperationResult {
    success: boolean;
    cart?: any; // Can be ICart document or lean object
    error?: string;
    code?: string;
    details?: Record<string, any>;
}

export interface CartItemInput {
    productId: string;
    quantity: number;
}

// Helper to safely convert string to ObjectId
function toObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
}

/**
 * Get a user's cart with populated product details
 */
export async function getCart(userId: string): Promise<CartOperationResult> {
    try {
        const userObjectId = toObjectId(userId);
        let cart: any = await Cart.findOne({ userId: userObjectId })
            .populate({
                path: 'items.productId',
                select: PRODUCT_POPULATE_FIELDS,
            })
            .lean();

        // If no cart exists, create an empty one
        if (!cart) {
            const newCart = await Cart.create({ userId: userObjectId, items: [] });
            cart = newCart.toObject();
        }

        // Filter out items where the product was deleted or is inactive
        if (cart.items && cart.items.length > 0) {
            const validItems = cart.items.filter((item: any) => {
                const product = item.productId;
                return product && product._id && product.isActive !== false;
            });

            // If some items were filtered out, update the cart
            if (validItems.length !== cart.items.length) {
                await Cart.updateOne(
                    { userId: userObjectId },
                    { $set: { items: validItems.map((item: any) => ({ productId: item.productId._id, quantity: item.quantity })) } }
                );
                cart.items = validItems;
            }
        }

        return { success: true, cart };
    } catch (error: any) {
        console.error('Error getting cart:', error);
        return {
            success: false,
            error: 'Failed to fetch cart',
            code: 'CART_FETCH_ERROR',
        };
    }
}

/**
 * Add an item to the cart with stock validation
 */
export async function addToCart(
    userId: string,
    productId: string,
    quantity: number = 1
): Promise<CartOperationResult> {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return {
                success: false,
                error: 'Invalid product ID',
                code: 'INVALID_PRODUCT_ID',
            };
        }

        // Validate quantity
        if (!Number.isInteger(quantity) || quantity < 1) {
            return {
                success: false,
                error: 'Quantity must be a positive integer',
                code: 'INVALID_QUANTITY',
            };
        }

        if (quantity > 99) {
            return {
                success: false,
                error: 'Maximum quantity per item is 99',
                code: 'QUANTITY_EXCEEDED',
            };
        }

        // Fetch product to validate stock
        const product = await Product.findById(productId).select('_id title stock isActive').lean();

        if (!product) {
            return {
                success: false,
                error: 'Product not found',
                code: 'PRODUCT_NOT_FOUND',
            };
        }

        if (!product.isActive) {
            return {
                success: false,
                error: 'This product is currently unavailable',
                code: 'PRODUCT_UNAVAILABLE',
            };
        }

        if (product.stock <= 0) {
            return {
                success: false,
                error: 'This product is out of stock',
                code: 'OUT_OF_STOCK',
                details: { productId, availableStock: 0 },
            };
        }

        // Find or create cart
        const userObjectId = toObjectId(userId);
        let cart = await Cart.findOne({ userId: userObjectId });
        if (!cart) {
            cart = new Cart({ userId: userObjectId, items: [] });
        }

        // Check if product already in cart
        const existingItemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        let finalQuantity = quantity;

        if (existingItemIndex > -1) {
            // Update existing item quantity
            finalQuantity = cart.items[existingItemIndex].quantity + quantity;
        }

        // Cap to available stock
        let stockWarning: string | undefined;
        if (finalQuantity > product.stock) {
            finalQuantity = product.stock;
            stockWarning = `Quantity adjusted to available stock (${product.stock})`;
        }

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity = finalQuantity;
        } else {
            cart.items.push({
                productId: new mongoose.Types.ObjectId(productId),
                quantity: finalQuantity,
            } as ICartItem);
        }

        await cart.save();

        // Return populated cart
        const populatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.productId',
                select: PRODUCT_POPULATE_FIELDS,
            })
            .lean();

        const result: CartOperationResult = {
            success: true,
            cart: populatedCart,
        };

        if (stockWarning) {
            result.details = { warning: stockWarning };
        }

        return result;
    } catch (error: any) {
        console.error('Error adding to cart:', error);
        return {
            success: false,
            error: 'Failed to add item to cart',
            code: 'CART_ADD_ERROR',
        };
    }
}

/**
 * Update the quantity of a cart item
 */
export async function updateCartItemQuantity(
    userId: string,
    productId: string,
    quantity: number
): Promise<CartOperationResult> {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return {
                success: false,
                error: 'Invalid product ID',
                code: 'INVALID_PRODUCT_ID',
            };
        }

        // Validate quantity
        if (!Number.isInteger(quantity) || quantity < 0) {
            return {
                success: false,
                error: 'Quantity must be a non-negative integer',
                code: 'INVALID_QUANTITY',
            };
        }

        if (quantity > 99) {
            return {
                success: false,
                error: 'Maximum quantity per item is 99',
                code: 'QUANTITY_EXCEEDED',
            };
        }

        // If quantity is 0, remove the item
        if (quantity === 0) {
            return removeFromCart(userId, productId);
        }

        // Find cart
        const userObjectId = toObjectId(userId);
        const cart = await Cart.findOne({ userId: userObjectId });
        if (!cart) {
            return {
                success: false,
                error: 'Cart not found',
                code: 'CART_NOT_FOUND',
            };
        }

        // Find item in cart
        const itemIndex = cart.items.findIndex(
            (item) => item.productId.toString() === productId
        );

        if (itemIndex === -1) {
            return {
                success: false,
                error: 'Item not found in cart',
                code: 'ITEM_NOT_IN_CART',
            };
        }

        // Check stock
        const product = await Product.findById(productId).select('stock isActive').lean();

        if (!product || !product.isActive) {
            // Remove unavailable product from cart
            cart.items.splice(itemIndex, 1);
            await cart.save();
            return {
                success: false,
                error: 'Product is no longer available and has been removed from cart',
                code: 'PRODUCT_UNAVAILABLE',
            };
        }

        // Cap to available stock
        let finalQuantity = quantity;
        let stockWarning: string | undefined;

        if (quantity > product.stock) {
            finalQuantity = product.stock;
            stockWarning = `Quantity adjusted to available stock (${product.stock})`;
        }

        cart.items[itemIndex].quantity = finalQuantity;
        await cart.save();

        // Return populated cart
        const populatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.productId',
                select: PRODUCT_POPULATE_FIELDS,
            })
            .lean();

        const result: CartOperationResult = {
            success: true,
            cart: populatedCart,
        };

        if (stockWarning) {
            result.details = { warning: stockWarning };
        }

        return result;
    } catch (error: any) {
        console.error('Error updating cart:', error);
        return {
            success: false,
            error: 'Failed to update cart',
            code: 'CART_UPDATE_ERROR',
        };
    }
}

/**
 * Remove an item from the cart
 */
export async function removeFromCart(
    userId: string,
    productId: string
): Promise<CartOperationResult> {
    try {
        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return {
                success: false,
                error: 'Invalid product ID',
                code: 'INVALID_PRODUCT_ID',
            };
        }

        // Find and update cart
        const userObjectId = toObjectId(userId);
        const cart = await Cart.findOneAndUpdate(
            { userId: userObjectId },
            { $pull: { items: { productId: new mongoose.Types.ObjectId(productId) } } },
            { new: true }
        )
            .populate({
                path: 'items.productId',
                select: PRODUCT_POPULATE_FIELDS,
            })
            .lean();

        if (!cart) {
            // Return empty cart if no cart exists
            return {
                success: true,
                cart: { userId, items: [] } as any,
            };
        }

        return { success: true, cart };
    } catch (error: any) {
        console.error('Error removing from cart:', error);
        return {
            success: false,
            error: 'Failed to remove item from cart',
            code: 'CART_REMOVE_ERROR',
        };
    }
}

/**
 * Clear all items from the cart
 */
export async function clearCart(userId: string): Promise<CartOperationResult> {
    try {
        const userObjectId = toObjectId(userId);
        const cart = await Cart.findOneAndUpdate(
            { userId: userObjectId },
            { $set: { items: [] } },
            { new: true, upsert: true }
        ).lean();

        return { success: true, cart };
    } catch (error: any) {
        console.error('Error clearing cart:', error);
        return {
            success: false,
            error: 'Failed to clear cart',
            code: 'CART_CLEAR_ERROR',
        };
    }
}

/**
 * Sync guest cart items to user cart on login
 * Merges guest items with existing cart, respecting stock limits
 */
export async function syncGuestCart(
    userId: string,
    guestItems: CartItemInput[]
): Promise<CartOperationResult> {
    try {
        if (!guestItems || !Array.isArray(guestItems) || guestItems.length === 0) {
            return getCart(userId);
        }

        // Process each guest item
        for (const item of guestItems) {
            if (
                item.productId &&
                mongoose.Types.ObjectId.isValid(item.productId) &&
                item.quantity > 0
            ) {
                await addToCart(userId, item.productId, item.quantity);
            }
        }

        // Return final cart state
        return getCart(userId);
    } catch (error: any) {
        console.error('Error syncing guest cart:', error);
        return {
            success: false,
            error: 'Failed to sync cart',
            code: 'CART_SYNC_ERROR',
        };
    }
}

/**
 * Validate cart items and re-check stock before checkout
 * Returns the cart with any out-of-stock items removed or quantities adjusted
 */
export async function validateCartForCheckout(userId: string): Promise<CartOperationResult> {
    try {
        const userObjectId = toObjectId(userId);
        const cart = await Cart.findOne({ userId: userObjectId });

        if (!cart || cart.items.length === 0) {
            return {
                success: false,
                error: 'Cart is empty',
                code: 'EMPTY_CART',
            };
        }

        const productIds = cart.items.map((item) => item.productId);
        const products = await Product.find({
            _id: { $in: productIds },
            isActive: true,
        }).select('_id stock').lean();

        const productMap = new Map(products.map((p) => [p._id.toString(), p]));
        const validItems: ICartItem[] = [];
        const issues: string[] = [];

        for (const item of cart.items) {
            const product = productMap.get(item.productId.toString());

            if (!product) {
                issues.push(`Product ${item.productId} is no longer available`);
                continue;
            }

            if (product.stock <= 0) {
                issues.push(`Product ${item.productId} is out of stock`);
                continue;
            }

            if (item.quantity > product.stock) {
                validItems.push({
                    productId: item.productId,
                    quantity: product.stock,
                } as ICartItem);
                issues.push(`Quantity for product ${item.productId} adjusted to ${product.stock}`);
            } else {
                validItems.push(item);
            }
        }

        if (validItems.length !== cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        if (validItems.length === 0) {
            return {
                success: false,
                error: 'No valid items in cart',
                code: 'NO_VALID_ITEMS',
                details: { issues },
            };
        }

        // Return populated cart
        const populatedCart = await Cart.findById(cart._id)
            .populate({
                path: 'items.productId',
                select: PRODUCT_POPULATE_FIELDS,
            })
            .lean();

        return {
            success: true,
            cart: populatedCart,
            details: issues.length > 0 ? { warnings: issues } : undefined,
        };
    } catch (error: any) {
        console.error('Error validating cart:', error);
        return {
            success: false,
            error: 'Failed to validate cart',
            code: 'CART_VALIDATION_ERROR',
        };
    }
}
