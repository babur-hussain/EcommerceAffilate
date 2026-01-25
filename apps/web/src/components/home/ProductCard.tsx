"use client";

import { useState } from "react";
import Link from "next/link";

interface ProductCardProps {
    product: any; // Using any for simplicity as per existing code structure, or define interface
}

export default function ProductCard({ product }: ProductCardProps) {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    // Resolve image source
    const imageSrc = product.image || product.images?.[0];

    // Double check: if no image source at all, don't render
    if (!imageSrc) return null;

    return (
        <div className="w-[200px] shrink-0 snap-center">
            <Link href={`/product/${product._id}`} className="block h-full">
                <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-slate-100 shadow-sm hover:shadow-soft transition-all duration-300 group h-full flex flex-col">
                    <div className="relative w-full aspect-square bg-surface-light rounded-lg sm:rounded-xl mb-2 sm:mb-3 overflow-hidden">
                        {/* Image */}
                        <div className="w-full h-full relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={imageSrc}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                style={{ aspectRatio: '500/500' }}
                                onError={() => setIsVisible(false)} // Hide the entire card on error
                            />
                        </div>

                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                // Add logic for favorite functionality here later if needed
                            }}
                            className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 size-8 sm:size-10 bg-white rounded-full flex items-center justify-center shadow-md text-slate-400 hover:text-red-500 transition-colors z-10"
                        >
                            <span className="material-symbols-outlined text-[16px] sm:text-[20px] fill-0 hover:fill-1">
                                favorite
                            </span>
                        </button>
                    </div>

                    <div className="flex flex-col flex-1">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight mb-1 line-clamp-2">
                            {product.title}
                        </h3>
                        <div className="mt-auto flex items-center justify-between pt-2">
                            <span className="text-base sm:text-lg font-bold text-slate-900">
                                ₹{product.price}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // Add logic for add to cart here later if needed
                                }}
                                className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-sky-500 active:scale-95 transition-all flex items-center gap-1 z-10"
                            >
                                Add
                                <span className="material-symbols-outlined text-[14px]">
                                    add
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
