import ProductCard from "./ProductCard";
import { BackendProduct } from "@/types/product";

interface ProductRowProps {
  title: string;
  products: BackendProduct[];
}

export default function ProductRow({ title, products }: ProductRowProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All →
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}
