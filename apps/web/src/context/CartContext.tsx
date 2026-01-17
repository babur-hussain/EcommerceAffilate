"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

interface CartItem {
  productId: string;
  quantity: number;
}

interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  cartCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<boolean>;
  removeFromCart: (productId: string) => Promise<boolean>;
  updateCartItem: (productId: string, quantity: number) => Promise<boolean>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { idToken, backendUser } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate cart count
  const cartCount =
    cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  // Fetch cart from API
  const fetchCart = async () => {
    if (!idToken || !backendUser) {
      setCart(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/cart`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Failed to load cart");
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (
    productId: string,
    quantity: number = 1
  ): Promise<boolean> => {
    if (!idToken || !backendUser) {
      setError("Please login to add items to cart");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Failed to add to cart");
        return false;
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError("Failed to add to cart");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string): Promise<boolean> => {
    if (!idToken || !backendUser) {
      setError("Please login to manage cart");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/cart/remove`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Failed to remove from cart");
        return false;
      }
    } catch (err) {
      console.error("Error removing from cart:", err);
      setError("Failed to remove from cart");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (
    productId: string,
    quantity: number
  ): Promise<boolean> => {
    if (!idToken || !backendUser) {
      setError("Please login to manage cart");
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/cart/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data);
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        setError(errorData.error || "Failed to update cart");
        return false;
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      setError("Failed to update cart");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = fetchCart;

  // Load cart when user logs in
  useEffect(() => {
    if (idToken && backendUser) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [idToken, backendUser]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        cartCount,
        addToCart,
        removeFromCart,
        updateCartItem,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
