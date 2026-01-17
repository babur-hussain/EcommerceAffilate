import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../lib/api';
import { useAuth } from './AuthContext';

interface CartItem {
    productId: string | {
        _id: string;
        name: string;
        price: number;
        images: string[];
        stock: number;
    }; // Populated or just ID
    quantity: number;
}

interface Cart {
    _id?: string;
    items: CartItem[];
    userId?: string;
}

interface CartContextType {
    cart: Cart | null;
    loading: boolean;
    addToCart: (productId: string, quantity?: number, productDetails?: any) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    clearCart: () => Promise<void>;
    refreshCart: () => Promise<void>;
    cartTotal: number;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState<Cart | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        refreshCart();
    }, [user]);

    const refreshCart = async () => {
        setLoading(true);
        try {
            if (user) {
                // Fetch from API
                const response = await api.get('/api/cart');

                setCart(response.data);
            } else {
                // Load from AsyncStorage
                const localCart = await AsyncStorage.getItem('guest_cart');
                if (localCart) {
                    const parsedCart = JSON.parse(localCart);
                    setCart(parsedCart);
                } else {
                    setCart({ items: [] });
                }
            }
        } catch (error) {
            console.error('Error refreshing cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveLocalCart = async (newCart: Cart) => {
        await AsyncStorage.setItem('guest_cart', JSON.stringify(newCart));
        setCart(newCart);
    };

    const addToCart = async (productId: string, quantity = 1, productDetails?: any) => {
        try {
            if (user) {
                await api.post('/api/cart/add', { productId, quantity });
                await refreshCart();
            } else {
                const currentCart = cart || { items: [] };
                const existingItemIndex = currentCart.items.findIndex(
                    (item) => (typeof item.productId === 'string' ? item.productId : item.productId._id) === productId
                );

                let newItems = [...currentCart.items];
                if (existingItemIndex > -1) {
                    newItems[existingItemIndex].quantity += quantity;
                } else {
                    // Store full product details for guest cart if provided
                    const productData = productDetails || { _id: productId };
                    newItems.push({ productId: productData, quantity });
                }
                await saveLocalCart({ ...currentCart, items: newItems });
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    const removeFromCart = async (productId: string) => {
        try {
            if (user) {
                await api.post('/api/cart/remove', { productId });
                await refreshCart();
            } else {
                if (!cart) return;
                const newItems = cart.items.filter(
                    (item) => (typeof item.productId === 'string' ? item.productId : item.productId._id) !== productId
                );
                await saveLocalCart({ ...cart, items: newItems });
            }
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    const updateQuantity = async (productId: string, quantity: number) => {
        try {
            if (user) {
                await api.post('/api/cart/update', { productId, quantity });
                await refreshCart();
            } else {
                if (!cart) return;
                const newItems = cart.items.map((item) => {
                    const id = typeof item.productId === 'string' ? item.productId : item.productId._id;
                    if (id === productId) {
                        return { ...item, quantity };
                    }
                    return item;
                });
                await saveLocalCart({ ...cart, items: newItems });
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            throw error;
        }
    };

    const clearCart = async () => {
        try {
            if (user) {
                await api.post('/api/cart/clear');
                await refreshCart();
            } else {
                await saveLocalCart({ items: [] });
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw error;
        }
    };

    // Helper to calculate total
    // Note: This requires product details (price) to be available in the cart items.
    // If the backend doesn't populate, this will be 0 until we fix the backend or fetch details.
    const cartTotal = cart?.items.reduce((total, item) => {
        const product = item.productId as any; // Cast to any to access price if populated
        const price = product?.price || 0;
        return total + price * item.quantity;
    }, 0) || 0;

    const cartCount = cart?.items.reduce((count, item) => count + item.quantity, 0) || 0;

    return (
        <CartContext.Provider
            value={{
                cart,
                loading,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                refreshCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
