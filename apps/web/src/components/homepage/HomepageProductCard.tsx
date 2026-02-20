"use client";

import { useState } from "react";
import Link from "next/link";
import type { HomepageProduct } from "@/hooks/useHomepageSections";

interface HomepageProductCardProps {
    product: HomepageProduct;
}

export default function HomepageProductCard({ product }: HomepageProductCardProps) {
    const [imgError, setImgError] = useState(false);

    const imageSrc = product.primaryImage || product.image || product.images?.[0];
    if (!imageSrc || imgError) return null;

    const discount =
        product.mrp && product.mrp > product.price
            ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
            : 0;

    return (
        <Link
            href={`/product/${product._id}`}
            className="homepage-product-card group block w-[140px] xs:w-[160px] sm:w-[180px] md:w-[200px] shrink-0 snap-start"
        >
            <div className="h-full flex flex-col">
                {/* Image Container */}
                <div className="relative w-full aspect-square bg-white overflow-hidden flex items-center justify-center p-3 rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={imageSrc}
                        alt={product.title}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />

                    {/* Rating Badge - bottom left of image */}
                    {product.rating !== undefined && product.rating > 0 && (
                        <div className="absolute bottom-2 left-2 flex items-center gap-0.5 bg-white border border-slate-200 text-xs font-bold px-1.5 py-0.5 rounded-sm shadow-sm">
                            <span className="text-slate-800">{product.rating.toFixed(1)}</span>
                            <span className="material-symbols-outlined text-[12px] text-emerald-600" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="pt-2 px-1 flex flex-col flex-1">
                    {/* Title */}
                    <h3 className="text-[13px] sm:text-sm text-slate-700 leading-tight line-clamp-2 mb-1.5">
                        {product.title}
                    </h3>

                    {/* Price Row */}
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                        {product.mrp && product.mrp > product.price && (
                            <span className="text-xs text-slate-400 line-through">
                                ₹{product.mrp.toLocaleString("en-IN")}
                            </span>
                        )}
                        <span className="text-sm sm:text-base font-bold text-slate-900">
                            ₹{product.price.toLocaleString("en-IN")}
                        </span>
                    </div>

                    {/* Buy At Price */}
                    {discount > 0 && (
                        <p className="text-xs text-emerald-700 font-medium mt-0.5">
                            {discount}% off
                        </p>
                    )}
                </div>
            </div>
        </Link>
    );
}
