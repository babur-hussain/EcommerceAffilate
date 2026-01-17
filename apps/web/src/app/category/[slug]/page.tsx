"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import Header from "@/components/header/Header";
import CategoryNav from "@/components/header/CategoryNav";
import Footer from "@/components/footer/Footer";
import ProductGrid from "@/components/product/ProductGrid";
import { BackendProduct } from "@/types/product";

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
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoryNav />
        <main className="max-w-300 mx-auto px-6 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoryNav />
        <main className="max-w-300 mx-auto px-6 py-16 text-center">
          <div className="mb-8">
            <svg
              className="w-24 h-24 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Category not found
            </h1>
            <p className="text-gray-600 mb-6">
              The category you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors"
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
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryNav />

      <main className="max-w-300 mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{category.name}</span>
        </nav>

        {/* Category Header with Icon */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
          <div className="flex items-center gap-4 mb-3">
            {category.icon && (
              <div className="w-16 h-16 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center shadow-sm">
                <span className="text-3xl">{category.icon}</span>
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">
                {category.name}
              </h1>
              <p className="text-sm text-gray-600">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} available
              </p>
            </div>
          </div>
          {category.description && (
            <p className="text-gray-700 text-sm">{category.description}</p>
          )}
        </div>

        {/* Products Section */}
        {products.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                All Products
              </h2>
              <div className="text-sm text-gray-500">
                Showing {products.length} results
              </div>
            </div>
            <ProductGrid products={products} />
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
            <div className="mb-8">
              <svg
                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                No products available
              </h2>
              <p className="text-gray-600 mb-1">
                This category doesn&apos;t have any products yet
              </p>
              <p className="text-sm text-gray-500">
                Check back soon for new arrivals
              </p>
            </div>

            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
