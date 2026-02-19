"use client";

import { useRef } from "react";
import Link from "next/link";
import HomepageProductCard from "./HomepageProductCard";
import type { HomepageProduct } from "@/hooks/useHomepageSections";

interface DealStripProps {
    title: string;
    slug?: string;
    products: HomepageProduct[];
}

export default function DealStrip({ title, slug, products }: DealStripProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    if (!products || products.length === 0) return null;

    const scroll = (direction: "left" | "right") => {
        if (!scrollRef.current) return;
        const amount = direction === "left" ? -600 : 600;
        scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    };

    const viewAllLink = slug ? `/search?category=${slug}` : "#";

    return (
        <div className="deal-strip py-3 sm:py-4">
            {/* Subcategory Header */}
            <div className="flex items-center justify-between mb-3 px-4 sm:px-5">
                <h4 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                    {title}
                </h4>
                <Link
                    href={viewAllLink}
                    className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                    View All
                    <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                </Link>
            </div>

            {/* Scrollable Products */}
            <div className="relative group/scroll">
                {/* Left Arrow */}
                <button
                    onClick={() => scroll("left")}
                    className="deal-strip-arrow absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-primary opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-200 -translate-x-1/2"
                >
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>

                {/* Right Arrow */}
                <button
                    onClick={() => scroll("right")}
                    className="deal-strip-arrow absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-primary opacity-0 group-hover/scroll:opacity-100 transition-opacity duration-200 translate-x-1/2"
                >
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>

                {/* Product Scroll Track */}
                <div
                    ref={scrollRef}
                    className="flex gap-3 sm:gap-4 overflow-x-auto hide-scrollbar scroll-smooth-touch px-4 sm:px-5 pb-2"
                >
                    {products.map((product) => (
                        <HomepageProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
}
