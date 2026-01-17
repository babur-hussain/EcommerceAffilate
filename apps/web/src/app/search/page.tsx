"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Header from "@/components/header/Header";
import CategoryNav from "@/components/header/CategoryNav";
import Footer from "@/components/footer/Footer";
import ProductGrid from "@/components/product/ProductGrid";
import { BackendProduct } from "@/types/product";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [products, setProducts] = useState<BackendProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(false);

      try {
        const res = await fetch(
          `${API_BASE}/ranking/search?q=${encodeURIComponent(query.trim())}`
        );

        if (!res.ok) {
          setError(true);
          setProducts([]);
          return;
        }

        const data = (await res.json()) as BackendProduct[];
        setProducts(data);
      } catch (err) {
        console.error("Search error:", err);
        setError(true);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CategoryNav />

      <main className="max-w-300 mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-600">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900">Search</span>
        </nav>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Searching for products...</p>
          </div>
        ) : query.trim() ? (
          <>
            {/* Search Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Search results for &quot;{query}&quot;
              </h1>
              <p className="text-sm text-gray-600">
                {products.length}{" "}
                {products.length === 1 ? "product" : "products"} found
              </p>
            </div>

            <div className="border-t border-gray-200 mb-8"></div>

            {/* Error State */}
            {error ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Unable to load search results
                </h2>
                <p className="text-gray-600 mb-1">Please try again later</p>
                <p className="text-sm text-gray-500">
                  The search service is temporarily unavailable.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-6 inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Retry
                </button>
              </div>
            ) : products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="text-center py-16">
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
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    No products found
                  </h2>
                  <p className="text-gray-600 mb-1">
                    We couldn&apos;t find any products matching &quot;{query}
                    &quot;
                  </p>
                  <p className="text-sm text-gray-500">
                    Try searching with different keywords
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition"
                >
                  Back to Home
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Enter a search term
            </h2>
            <p className="text-gray-600 mb-6">
              Use the search bar above to find products
            </p>
            <Link
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-blue-700 transition"
            >
              Back to Home
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
