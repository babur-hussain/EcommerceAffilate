"use client";

import Link from "next/link";
import { useProducts } from "@/hooks/useProducts";
import React from "react";

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
        limit: 10,
    });

    if (loading) return null; // Default to null cleanly
    if (!products || products.length === 0) return null;

    return (
        <section className={`py-8 md:py-16 px-4 md:px-6 bg-white ${className}`}>
            <div className="max-w-[1440px] mx-auto">
                {/* Section Header */}
                <div className="flex items-end justify-between mb-10 px-2">
                    <div className="flex flex-col gap-1">
                        {subtitle && (
                            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                                <span className="material-symbols-outlined text-lg">bolt</span>
                                <span>{subtitle}</span>
                            </div>
                        )}
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
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
                    <div className="flex gap-6 overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory px-2">
                        {products.map((product) => (
                            <div
                                key={product._id}
                                className="min-w-[220px] md:min-w-[280px] snap-center"
                            >
                                <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-soft transition-all duration-300 group h-full flex flex-col">
                                    <div className="relative aspect-[4/5] bg-surface-light rounded-xl mb-4 overflow-hidden">
                                        {/* Image */}
                                        <div className="w-full h-full relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={product.image || product.images?.[0] || 'https://placehold.co/400x500?text=No+Image'}
                                                alt={product.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        <button className="absolute bottom-3 right-3 size-10 bg-white rounded-full flex items-center justify-center shadow-md text-slate-400 hover:text-red-500 transition-colors">
                                            <span className="material-symbols-outlined text-[20px] fill-0 hover:fill-1">
                                                favorite
                                            </span>
                                        </button>
                                    </div>

                                    <div className="flex flex-col flex-1">
                                        <h3 className="text-base font-bold text-slate-900 leading-tight mb-1 line-clamp-2">
                                            {product.title}
                                        </h3>
                                        <div className="mt-auto flex items-center justify-between pt-4">
                                            <span className="text-lg font-bold text-slate-900">
                                                ₹{product.price}
                                            </span>
                                            <button className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-sky-500 active:scale-95 transition-all flex items-center gap-1">
                                                Add
                                                <span className="material-symbols-outlined text-[14px]">
                                                    add
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
