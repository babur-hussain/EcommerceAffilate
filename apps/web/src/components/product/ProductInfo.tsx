import { BackendProduct } from "@/types/product";

interface ProductInfoProps {
  product: BackendProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-sm">
          {product.category}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
        {product.title}
      </h1>

      {/* Price Section */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-gray-900">
          ₹{product.price.toLocaleString("en-IN")}
        </span>
        {product.originalPrice && (
          <>
            <span className="text-lg text-gray-500 line-through">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-sm font-semibold text-green-600">
              {product.discount}% off
            </span>
          </>
        )}
      </div>

      {/* Highlights */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h2>
        <ul className="space-y-2 text-gray-700">
          <li>• Brand new and sealed</li>
          <li>• 1 year manufacturer warranty</li>
          <li>• Fast and secure delivery</li>
          <li>• Easy returns within 7 days</li>
        </ul>
      </div>
    </div>
  );
}
