"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

// ⚡ EASY CONFIG: Change product IDs here to display different trending products
const TRENDING_PRODUCT_IDS = [
  "695ffd2d5f2baf92257f146e", // Replace with your actual product IDs
  "695ffd2d5f2baf92257f146e",
  "695ffd2d5f2baf92257f146e",
  "695ffd2d5f2baf92257f146e",
  "695ffd2d5f2baf92257f146e",
  "695ffd2d5f2baf92257f146e",
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
  stock?: number;
  description?: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

export default function TrendingProductSlider() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
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

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) =>
      prev + itemsPerView >= products.length ? 0 : prev + itemsPerView
    );
  }, [products.length, itemsPerView]);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0
        ? Math.max(0, products.length - itemsPerView)
        : prev - itemsPerView
    );
    setIsAutoPlaying(false);
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, products.length, nextSlide]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-3xl">🔥</span>
            <span>Top Trending Products</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-white rounded-xl p-4 shadow"
            >
              <div className="bg-gray-200 h-48 rounded-lg mb-3"></div>
              <div className="bg-gray-200 h-4 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 rounded w-3/4 mb-3"></div>
              <div className="bg-gray-200 h-6 rounded w-1/2"></div>
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
    <div
      className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 md:p-6 shadow-lg relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-orange-200/30 rounded-full blur-3xl -z-0"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-200/30 rounded-full blur-3xl -z-0"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div>
          <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent flex items-center gap-2">
            <span className="text-3xl">🔥</span>
            <span>Top Trending Products</span>
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Don't miss out on these hot deals!
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="w-9 h-9 rounded-full bg-white hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md disabled:hover:bg-white disabled:hover:text-gray-400"
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
            onClick={() => {
              nextSlide();
              setIsAutoPlaying(false);
            }}
            disabled={currentIndex + itemsPerView >= products.length}
            className="w-9 h-9 rounded-full bg-white hover:bg-orange-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all shadow-md disabled:hover:bg-white disabled:hover:text-gray-400"
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 relative z-10">
        {visibleProducts.map((product, idx) => {
          const discountPercent = product.salePrice
            ? Math.round(
                ((product.price - product.salePrice) / product.price) * 100
              )
            : 0;
          const savings = product.salePrice
            ? product.price - product.salePrice
            : 0;

          return (
            <Link
              key={`${product._id}-${currentIndex + idx}`}
              href={`/product/${product._id}`}
              className="group bg-white border-2 border-transparent hover:border-orange-400 rounded-xl p-3 md:p-4 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Image Container */}
              <div className="relative aspect-square mb-3 overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                  {discountPercent > 0 && (
                    <span className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {discountPercent}% OFF
                    </span>
                  )}
                  {product.brand && (
                    <span className="bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-medium px-2 py-1 rounded-full shadow">
                      {product.brand}
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    // Add wishlist logic here
                  }}
                  className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-50"
                >
                  <svg
                    className="w-4 h-4 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="space-y-2">
                {/* Category Badge */}
                {product.category && (
                  <span className="inline-block text-xs text-orange-600 font-medium bg-orange-50 px-2 py-0.5 rounded">
                    {product.category}
                  </span>
                )}

                {/* Title */}
                <h3 className="text-sm md:text-base font-semibold text-gray-800 line-clamp-2 min-h-[2.5rem] group-hover:text-orange-600 transition-colors">
                  {product.title}
                </h3>

                {/* Rating & Reviews */}
                {product.rating > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">
                      {product.rating.toFixed(1)}
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({product.ratingCount.toLocaleString()})
                    </span>
                  </div>
                )}

                {/* Price Section */}
                <div className="pt-2 border-t border-gray-100">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xl md:text-2xl font-bold text-gray-900">
                      ₹{(product.salePrice || product.price).toLocaleString()}
                    </span>
                    {product.salePrice && (
                      <span className="text-sm text-gray-400 line-through font-medium">
                        ₹{product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {savings > 0 && (
                    <p className="text-xs text-green-600 font-semibold">
                      You save ₹{savings.toLocaleString()}!
                    </p>
                  )}

                  {/* Free Delivery Badge */}
                  <div className="mt-2 flex items-center gap-1 text-xs text-blue-600">
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
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                    <span className="font-medium">Free Delivery</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center gap-2 mt-6 relative z-10">
        {Array.from({ length: Math.ceil(products.length / itemsPerView) }).map(
          (_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx * itemsPerView);
                setIsAutoPlaying(false);
              }}
              className={`h-2 rounded-full transition-all ${
                Math.floor(currentIndex / itemsPerView) === idx
                  ? "w-8 bg-gradient-to-r from-orange-500 to-red-500 shadow-md"
                  : "w-2 bg-gray-300 hover:bg-orange-300"
              }`}
              aria-label={`Go to page ${idx + 1}`}
            />
          )
        )}
      </div>
    </div>
  );
}
