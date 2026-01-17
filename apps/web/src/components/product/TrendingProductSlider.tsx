"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ⚡ EASY CONFIG: Change product IDs here to display different trending products
const TRENDING_PRODUCT_IDS = [
  "677e2cd52e7e05fddae41d29", // Replace with your actual product IDs
  "677e2cd52e7e05fddae41d2a",
  "677e2cd52e7e05fddae41d2b",
  "677e2cd52e7e05fddae41d2c",
  "677e2cd52e7e05fddae41d2d",
  "677e2cd52e7e05fddae41d2e",
];

interface Product {
  _id: string;
  title: string;
  slug: string;
  price: number;
  salePrice?: number;
  category: string;
  brand?: string;
  image: string;
  rating: number;
  ratingCount: number;
  discount?: number;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

export default function TrendingProductSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerView = 4; // Show 4 products at a time

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products by IDs
        const productPromises = TRENDING_PRODUCT_IDS.map((id) =>
          fetch(`${API_BASE}/products/${id}`).then((res) =>
            res.ok ? res.json() : null
          )
        );
        const results = await Promise.all(productPromises);
        const validProducts = results.filter((p) => p !== null);
        setProducts(validProducts);
      } catch (error) {
        console.error("Error fetching trending products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerView >= products.length ? 0 : prev + itemsPerView
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0
        ? Math.max(0, products.length - itemsPerView)
        : prev - itemsPerView
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">🔥 Top Trending Products</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 h-40 rounded-lg mb-2"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerView
  );

  return (
    <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🔥</span>
          <span>Top Trending Products</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
            aria-label="Previous"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            disabled={currentIndex + itemsPerView >= products.length}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition"
            aria-label="Next"
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {visibleProducts.map((product) => {
          const discountPercent = product.salePrice
            ? Math.round(
                ((product.price - product.salePrice) / product.price) * 100
              )
            : 0;

          return (
            <Link
              key={product._id}
              href={`/product/${product._id}`}
              className="group border rounded-lg p-3 hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-square mb-2 overflow-hidden rounded-lg bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Title */}
              <h3 className="text-sm font-semibold mb-1 line-clamp-2 min-h-[2.5rem]">
                {product.title}
              </h3>

              {/* Rating */}
              {product.rating > 0 && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded flex items-center gap-1">
                    {product.rating.toFixed(1)} ★
                  </span>
                  <span className="text-xs text-gray-500">
                    ({product.ratingCount})
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold">
                  ₹{(product.salePrice || product.price).toLocaleString()}
                </span>
                {product.salePrice && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-1 mt-4">
        {Array.from({ length: Math.ceil(products.length / itemsPerView) }).map(
          (_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx * itemsPerView)}
              className={`h-2 rounded-full transition-all ${
                Math.floor(currentIndex / itemsPerView) === idx
                  ? "w-6 bg-blue-600"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          )
        )}
      </div>
    </div>
  );
}
