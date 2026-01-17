import ProductGrid from "@/components/product/ProductGrid";
import { BackendProduct } from "@/types/product";

interface SearchResultsProps {
  query: string;
  products: BackendProduct[];
}

export default function SearchResults({ query, products }: SearchResultsProps) {
  return (
    <div>
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Search results for &quot;{query}&quot;
        </h1>
        <p className="text-sm text-gray-600">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      </div>
      
      <div className="border-t border-gray-200 mb-8"></div>

      {/* Results Grid */}
      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="text-center py-16">
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No products found</h2>
            <p className="text-gray-600 mb-1">We couldn&apos;t find any products matching &quot;{query}&quot;</p>
            <p className="text-sm text-gray-500">Try searching with different keywords</p>
          </div>
        </div>
      )}
    </div>
  );
}
