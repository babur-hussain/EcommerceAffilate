"use client";

import Link from "next/link";
import Image from "next/image";
import { use, useEffect, useState } from "react";
import Footer from "@/components/footer/Footer";
import { BackendProduct } from "@/types/product";
import CategorySidebar from "@/components/category/CategorySidebar";
import CategoryBanner from "@/components/category/CategoryBanner";
import TrendingProducts from "@/components/category/TrendingProducts";
import { useAuth } from "@/context/AuthContext";
import AffiliateButton from "@/components/affiliate/AffiliateButton";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
}

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = use(params);
  const { backendUser, idToken } = useAuth();

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Check if user is an influencer
  const isInfluencer = backendUser?.role === "INFLUENCER";

  // Fetch influencer's referral code
  useEffect(() => {
    async function fetchReferralCode() {
      if (!isInfluencer) return;

      try {
        const res = await fetch(`${API_BASE}/influencers/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          credentials: "include",
        });
        if (res.ok) {
          const profile = await res.json();
          setReferralCode(profile.referralCode);
        }
      } catch (err) {
        console.error("Error fetching referral code:", err);
      }
    }
    fetchReferralCode();
  }, [isInfluencer, idToken]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all categories to find the current one
        const catRes = await fetch(`${API_BASE}/categories`);
        if (catRes.ok) {
          const categories = await catRes.json();
          const currentCategory = categories.find(
            (c: Category) => c.slug === resolvedParams.slug
          );

          if (currentCategory) {
            setCategory(currentCategory);

            // Fetch products for this category
            const prodRes = await fetch(
              `${API_BASE}/ranking/category/${resolvedParams.slug}`
            );
            if (prodRes.ok) {
              const productsData = await prodRes.json();
              setProducts(productsData);
            }
          } else {
            setError(true);
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching category data:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-[1440px] mx-auto px-6 lg:px-12 py-8">
          <div className="animate-pulse">
            <div className="h-64 bg-slate-200 rounded-2xl mb-8" />
            <div className="flex gap-10">
              <div className="w-64 hidden lg:block">
                <div className="h-8 bg-slate-200 rounded w-1/2 mb-6" />
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-6 bg-slate-200 rounded" />
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4">
                      <div className="aspect-square bg-slate-200 rounded-xl mb-4" />
                      <div className="h-4 bg-slate-200 rounded mb-2" />
                      <div className="h-4 bg-slate-200 rounded w-2/3" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-slate-50">
        <main className="max-w-[1440px] mx-auto px-6 py-16 text-center">
          <div className="mb-8">
            <span className="material-symbols-outlined text-8xl text-slate-300 mb-4">
              sentiment_dissatisfied
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mb-4">
              Category not found
            </h1>
            <p className="text-slate-600 mb-6">
              The category you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/"
              className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-[1440px] mx-auto w-full px-3 sm:px-4 md:px-6 lg:px-12 py-4 sm:py-6 md:py-8 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-10">
        {/* Sidebar Filters */}
        <CategorySidebar parentCategoryId={category._id} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col gap-4 sm:gap-6 md:gap-8">
          {/* Category Banner */}
          <CategoryBanner
            name={category.name}
            description={category.description}
            image={category.image}
            productCount={products.length}
          />

          {/* Trending Products */}
          <TrendingProducts products={products} categorySlug={category.slug} />

          {/* Product Grid Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 px-1 sm:px-2">
            <div className="flex items-center gap-3">
              <span className="text-xs sm:text-sm font-bold text-slate-900">{products.length} Items</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent border-none text-xs sm:text-sm font-bold pr-6 sm:pr-8 py-2 focus:ring-0 cursor-pointer text-slate-700"
                >
                  <option value="featured">Sort by: Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xl">
                  expand_more
                </span>
              </div>
              {/* View Toggle */}
              <div className="hidden sm:flex border border-slate-200 rounded overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 ${viewMode === "grid" ? "bg-slate-100" : "hover:bg-slate-50"}`}
                >
                  <span className="material-symbols-outlined text-[20px]">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 ${viewMode === "list" ? "bg-slate-100" : "hover:bg-slate-50"}`}
                >
                  <span className="material-symbols-outlined text-[20px]">view_list</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className={`grid gap-3 sm:gap-4 md:gap-6 px-1 sm:px-2 pb-8 sm:pb-12 md:pb-16 ${viewMode === "grid"
              ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
              }`}>
              {products.map((product) => {
                const imageUrl = product.images?.[0] || product.image || "/placeholder-product.jpg";
                // Use price as the selling price, mrp as original price if available
                const price = product.price;
                const originalPrice = product.mrp && product.mrp > product.price ? product.mrp : null;
                const discount = originalPrice
                  ? Math.round(((originalPrice - price) / originalPrice) * 100)
                  : 0;

                return (
                  <Link
                    key={product._id}
                    href={`/product/${product._id}`}
                    className="product-card group relative bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden mb-2 sm:mb-4 bg-slate-50">
                      <Image
                        src={imageUrl}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-[10px] font-bold text-white rounded-sm">
                          -{discount}%
                        </span>
                      )}

                      {/* Affiliate Link Button - Top Right */}
                      {isInfluencer && referralCode && (
                        <div className="absolute top-2 right-2 z-10">
                          <AffiliateButton
                            productId={product._id}
                            referralCode={referralCode}
                            variant="icon"
                            className="bg-white/90 text-primary shadow-sm hover:bg-white"
                          />
                        </div>
                      )}

                      {/* Quick Add Button */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          // Add to cart logic here
                        }}
                        className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 size-8 sm:size-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary/90"
                      >
                        <span className="material-symbols-outlined">add</span>
                      </button>
                    </div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight line-clamp-1 flex-1">
                        {product.title}
                      </h3>
                      {product.rating && (
                        <div className="flex items-center text-amber-400 gap-0.5 shrink-0 ml-2">
                          <span
                            className="material-symbols-outlined text-[14px]"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className="text-[11px] font-bold text-slate-700">
                            {product.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-slate-500 mb-2 sm:mb-3 truncate">
                      {product.brand || "Brand"}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-extrabold text-primary">
                          ₹{price.toLocaleString()}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
              <span className="material-symbols-outlined text-8xl text-slate-300 mb-4">
                inventory_2
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                No products available
              </h2>
              <p className="text-slate-600 mb-1">
                This category doesn&apos;t have any products yet
              </p>
              <p className="text-sm text-slate-500 mb-6">
                Check back soon for new arrivals
              </p>
              <Link
                href="/"
                className="inline-block bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
