import Image from "next/image";
import Link from "next/link";
import { BackendProduct } from "@/types/product";

interface ProductCardProps {
  product: BackendProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  return (
    <Link href={`/product/${product._id}`}>
      <div className="bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden h-full flex flex-col">
        <div className="relative w-full aspect-square bg-gray-50">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {product.isSponsored && (
            <div className="absolute top-2 left-2 bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded shadow-sm">
              Sponsored
            </div>
          )}
          {hasDiscount && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
              {discountPercent}% OFF
            </div>
          )}
        </div>

        <div className="p-4 flex flex-col flex-1">
          {/* Category & Brand */}
          {(product.category || product.brand) && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              {product.category && (
                <span className="bg-gray-100 px-2 py-0.5 rounded">
                  {product.category}
                </span>
              )}
              {product.brand && (
                <span className="text-gray-600 font-medium">
                  {product.brand}
                </span>
              )}
            </div>
          )}

          {/* Title */}
          <h3 className="text-sm text-gray-800 mb-3 line-clamp-2 min-h-[2.5rem] font-medium">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating && product.ratingCount && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2 py-0.5 rounded">
                <span>{product.rating.toFixed(1)}</span>
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="text-xs text-gray-500">
                ({product.ratingCount.toLocaleString()})
              </span>
            </div>
          )}

          {/* Price Section */}
          <div className="mt-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl font-bold text-gray-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice!.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-green-600 font-semibold">
                    Save ₹
                    {(product.originalPrice! - product.price).toLocaleString(
                      "en-IN"
                    )}
                  </span>
                </>
              )}
            </div>

            {/* Free Delivery Badge */}
            {product.price >= 500 && (
              <div className="mt-2">
                <span className="text-xs text-green-600 font-medium">
                  ✓ Free Delivery
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
