"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import React from "react";
import ProductCard from "./ProductCard";

interface ProductRowProps {
    title: string;
    subtitle?: string;
    categoryIds: string[]; // Comma separated IDs or specific ID
    viewAllLink?: string;
    className?: string;
    cardStyle?: 'default' | 'groceries'; // Support different card styles if needed
}

export default function ProductRow({
    title,
    subtitle,
    categoryIds,
    viewAllLink = "#",
    className = ""
}: ProductRowProps) {

    const { products, loading } = useProducts({
        category: categoryIds.join(','),
        limit: 30,
    });

    if (loading) return null; // Default to null cleanly
    if (!products || products.length === 0) return null;

    return (
        <section className={`py-4 sm:py-6 md:py-10 px-3 sm:px-4 md:px-6 bg-white ${className}`}>
            <div className="max-w-[1440px] mx-auto">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-3 sm:mb-4 md:mb-6 px-1 sm:px-2">
                    <div className="flex flex-col gap-1">
                        {subtitle && (
                            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                                <span className="material-symbols-outlined text-lg">bolt</span>
                                <span>{subtitle}</span>
                            </div>
                        )}
                        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900">
                            {title}
                        </h2>
                    </div>
                    <Link
                        href={viewAllLink}
                        className="hidden md:flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
                    >
                        View all
                        <span className="material-symbols-outlined text-[18px]">
                            arrow_forward
                        </span>
                    </Link>
                </div>

                {/* Product Scroll Container */}
                <div className="relative group/slider">
                    {/* Cards Track */}
                    <div className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-3 sm:pb-4 md:pb-6 hide-scrollbar snap-x snap-mandatory px-1 sm:px-2">
                        {products
                            .filter(product => product.image || (product.images && product.images.length > 0))
                            .map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}

                        {/* View More Card - Only show if we have 30 products (limit reached) */}
                        {products.length >= 30 && (
                            <Link
                                href={viewAllLink}
                                className="w-[200px] shrink-0 snap-center flex flex-col items-center justify-center bg-slate-50 rounded-xl sm:rounded-2xl border-2 border-dashed border-slate-200 hover:border-primary hover:bg-primary-50 transition-all duration-300 group/view-more cursor-pointer"
                            >
                                <div className="size-12 sm:size-14 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover/view-more:text-primary group-hover/view-more:scale-110 transition-all duration-300 mb-2">
                                    <span className="material-symbols-outlined text-2xl sm:text-3xl">
                                        arrow_forward
                                    </span>
                                </div>
                                <span className="text-sm sm:text-base font-bold text-slate-600 group-hover/view-more:text-primary">
                                    View All Products
                                </span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
