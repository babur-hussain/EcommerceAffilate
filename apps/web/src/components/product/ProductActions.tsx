"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

interface ProductActionsProps {
  productId?: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
  const router = useRouter();
  const { backendUser } = useAuth();
  const { addToCart: addToCartContext } = useCart();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleAddToCart = async () => {
    if (!backendUser) {
      router.push("/login");
      return;
    }

    if (!productId) {
      setMessage({ type: "error", text: "Product ID not available" });
      return;
    }

    setLoading(true);
    try {
      const success = await addToCartContext(productId, 1);
      if (success) {
        setMessage({ type: "success", text: "✓ Added to cart!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: "error", text: "Failed to add to cart" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      setMessage({ type: "error", text: "Failed to add to cart" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!backendUser) {
      router.push("/login");
      return;
    }

    if (!productId) {
      return;
    }

    setLoading(true);
    try {
      const success = await addToCartContext(productId, 1);
      if (success) {
        router.push("/cart");
      } else {
        setMessage({ type: "error", text: "Failed to add to cart" });
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage({ type: "error", text: "Failed to add to cart" });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {message && (
        <div
          className={`text-sm px-3 py-2 rounded ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={loading || !productId}
          className="flex-1 bg-yellow-500 text-gray-900 px-6 py-3 rounded-md font-semibold hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
        <button
          onClick={handleBuyNow}
          disabled={loading || !productId}
          className="flex-1 bg-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : "Buy Now"}
        </button>
      </div>
    </div>
  );
}
