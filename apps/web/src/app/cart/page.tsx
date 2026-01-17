"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header/Header";
import CategoryNav from "@/components/header/CategoryNav";
import Footer from "@/components/footer/Footer";
import { useAuth } from "@/context/AuthContext";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

interface Product {
  _id: string;
  title: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface CartWithProducts extends CartItem {
  product: Product;
}

export default function CartPage() {
  const router = useRouter();
  const { backendUser, loading: authLoading, idToken } = useAuth();
  const [cartItems, setCartItems] = useState<CartWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingItems, setProcessingItems] = useState<Set<string>>(
    new Set()
  );

  // Fetch cart and products in a single call
  useEffect(() => {
    const fetchCartWithProducts = async () => {
      if (!backendUser || !idToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch cart - backend already populates products
        const cartRes = await fetch(`${API_BASE}/cart`, {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!cartRes.ok) {
          if (cartRes.status === 403 || cartRes.status === 401) {
            throw new Error("Session expired. Please login again.");
          }
          throw new Error("Failed to load cart");
        }

        const cartData = await cartRes.json();
        console.log('📦 Cart data from backend:', cartData);

        if (!cartData?.items || cartData.items.length === 0) {
          setCartItems([]);
          setLoading(false);
          return;
        }

        // Backend returns populated products, so we just need to transform the data
        // The productId field contains the full product object when populated
        const transformedItems: CartWithProducts[] = cartData.items
          .map((item: any) => {
            // Check if productId is populated (object) or just an ID (string)
            const product = typeof item.productId === 'object' ? item.productId : null;

            if (!product) {
              console.warn('Product not populated for item:', item);
              return null;
            }

            // Transform to match our interface
            return {
              productId: product._id,
              quantity: item.quantity,
              product: {
                _id: product._id,
                title: product.name || product.title || 'Unknown Product',
                price: product.price || 0,
                image: product.images?.[0] || product.image || '/placeholder.png',
                stock: product.stock || 0,
                description: product.description,
              },
            };
          })
          .filter((item): item is CartWithProducts => item !== null);

        console.log('📦 Transformed cart items:', transformedItems);
        setCartItems(transformedItems);
      } catch (err) {
        console.error("Error loading cart:", err);
        setError(err instanceof Error ? err.message : "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };

    fetchCartWithProducts();
  }, [backendUser, idToken]);

  // Handle quantity update
  const handleUpdateQuantity = async (
    productId: string,
    newQuantity: number
  ) => {
    if (!idToken || processingItems.has(productId)) return;

    setProcessingItems((prev) => new Set(prev).add(productId));

    try {
      const res = await fetch(`${API_BASE}/cart/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (res.ok) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId === productId
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      } else {
        setError("Failed to update quantity");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      setError("Failed to update cart");
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  // Handle item removal
  const handleRemoveItem = async (productId: string) => {
    if (!idToken || processingItems.has(productId)) return;

    setProcessingItems((prev) => new Set(prev).add(productId));

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
        setCartItems((prev) =>
          prev.filter((item) => item.productId !== productId)
        );
      } else {
        setError("Failed to remove item");
        setTimeout(() => setError(null), 3000);
      }
    } catch (err) {
      console.error("Error removing item:", err);
      setError("Failed to remove item");
      setTimeout(() => setError(null), 3000);
    } finally {
      setProcessingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <CategoryNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!backendUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <CategoryNav />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Sign in to view your cart
              </h2>
              <p className="text-gray-600 mb-8">
                Please sign in to access your shopping cart and saved items.
              </p>
              <Link
                href="/login?redirect=/cart"
                className="inline-block w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Sign In
              </Link>
              <Link
                href="/"
                className="block mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = subtotal > 500 ? 0 : 40;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      <CategoryNav />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Error Banner */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Your cart is empty
              </h2>
              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                href="/"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Start Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onRemove={handleRemoveItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  isProcessing={processingItems.has(item.productId)}
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span className="font-semibold">
                      ₹
                      {subtotal.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-semibold">FREE</span>
                    ) : (
                      <span className="font-semibold">
                        ₹{shipping.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (GST 18%)</span>
                    <span className="font-semibold">
                      ₹
                      {tax.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  {subtotal < 500 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-xs text-blue-800">
                        Add ₹{(500 - subtotal).toFixed(2)} more for FREE
                        shipping!
                      </p>
                    </div>
                  )}

                  <div className="border-t pt-4 flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      ₹
                      {total.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg mb-4"
                >
                  Proceed to Checkout
                </button>

                <Link
                  href="/"
                  className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ← Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Easy returns within 7 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

interface CartItemProps {
  item: CartWithProducts;
  onRemove: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  isProcessing: boolean;
}

function CartItem({
  item,
  onRemove,
  onUpdateQuantity,
  isProcessing,
}: CartItemProps) {
  const quantity = item.quantity;

  const handleQuantityChange = (newQty: number) => {
    if (newQty < 1 || newQty > item.product.stock || isProcessing) return;
    onUpdateQuantity(item.productId, newQty);
  };

  const handleRemove = () => {
    if (isProcessing) return;
    onRemove(item.productId);
  };

  const itemTotal = item.product.price * quantity;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-4 lg:p-6">
      <div className="flex gap-4 lg:gap-6">
        {/* Product Image */}
        <Link
          href={`/product/${item.product._id}`}
          className="relative w-24 h-24 lg:w-32 lg:h-32 flex-shrink-0 rounded-lg overflow-hidden group"
        >
          <Image
            src={item.product.image}
            alt={item.product.title}
            fill
            sizes="(max-width: 768px) 96px, 128px"
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <Link
                href={`/product/${item.product._id}`}
                className="text-gray-900 font-semibold text-lg hover:text-blue-600 line-clamp-2 transition-colors"
              >
                {item.product.title}
              </Link>
              {item.product.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {item.product.description}
                </p>
              )}

              {/* Stock Warning */}
              {item.product.stock < 10 && (
                <p className="text-xs text-orange-600 mt-2 font-medium">
                  Only {item.product.stock} left in stock
                </p>
              )}
            </div>

            {/* Remove Button - Desktop */}
            <button
              onClick={handleRemove}
              disabled={isProcessing}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Remove from cart"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            {/* Quantity Controls */}
            <div className="flex items-center">
              <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={isProcessing || quantity <= 1}
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <div className="px-4 py-2 text-sm font-semibold border-l-2 border-r-2 border-gray-200 min-w-[3rem] text-center bg-gray-50">
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    quantity
                  )}
                </div>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={isProcessing || quantity >= item.product.stock}
                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">
                  ₹{item.product.price.toLocaleString("en-IN")} each
                </div>
                <div className="text-xl font-bold text-gray-900">
                  ₹{itemTotal.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Remove Button - Mobile */}
              <button
                onClick={handleRemove}
                disabled={isProcessing}
                className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
