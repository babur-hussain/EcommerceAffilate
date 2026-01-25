"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import FilterSidebar from "@/components/search/FilterSidebar";
import SearchResultCard from "@/components/search/SearchResultCard";

const API_BASE = "/api";

type Product = {
  _id: string;
  title: string;
  slug: string;
  price: number;
  mrp?: number;
  primaryImage: string;
  brand: string;
  rating?: number;
};

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        // Construct query string from all search params
        const params = new URLSearchParams(searchParams.toString());

        // Ensure 'search' param used by backend maps to 'q' from frontend if needed, 
        // or just pass 'q' as 'search' if backend expects 'search'
        if (query) {
          params.set('search', query);
        }

        const res = await fetch(
          `${API_BASE}/products?${params.toString()}`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [searchParams.toString()]);

  return (
    <div className="bg-white text-slate-900 font-display min-h-screen">
      <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-base">home</span>
            Home
          </Link>
          <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
          <span className="text-slate-900 font-semibold">Search Results</span>
        </div>

        {/* Page Title and Sort */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {loading ? "Searching..." : `${results.length} items found`}
            </h1>
            {query && (
              <p className="text-slate-500 mt-1 italic">
                Showing results for "{query}"
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="text-slate-900 text-sm font-semibold whitespace-nowrap">Sort By</p>
            <select className="rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-10 text-sm focus:ring-primary focus:border-primary outline-none text-slate-700">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Side Filter Bar */}
          <FilterSidebar />

          {/* Results Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl h-[400px] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 pb-12">
                {results.map(product => (
                  <SearchResultCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination Mockup if results > 0 */}
            {!loading && results.length > 0 && (
              <div className="mt-12 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all text-slate-600">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-bold">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-all font-bold text-slate-600">2</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-primary/10 transition-all font-bold text-slate-600">3</button>
                  <span className="px-2 font-bold text-slate-400">...</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all text-slate-600">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
                <p className="text-sm text-slate-500">Showing 1-{results.length > 12 ? 12 : results.length} of {results.length} items</p>
              </div>
            )}

            {!loading && results.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                  <span className="material-symbols-outlined text-5xl">search_off</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-500 max-w-md mx-auto">
                  We couldn't find any products matching "{query}". Try checking for typos or using different keywords.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
