"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "/api";

interface Category {
    _id: string;
    name: string;
    slug: string;
    icon?: string;
    isActive: boolean;
    order: number;
    parentCategory?: string | null;
}

export default function HomeCategoryList() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch(`${API_BASE}/categories?parentCategory=null`);
                if (res.ok) {
                    const data = await res.json();
                    // Sort by order field
                    const sortedData = data.sort(
                        (a: Category, b: Category) => a.order - b.order
                    );
                    setCategories(sortedData);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    if (loading) {
        return (
            <section className="w-full bg-white border-b border-slate-100">
                <div className="max-w-[1440px] mx-auto px-4 py-4">
                    <div className="flex items-center gap-8 overflow-x-auto hide-scrollbar pb-2">
                        {[...Array(10)].map((_, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-center gap-3 shrink-0"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 animate-pulse" />
                                <div className="w-20 h-3 bg-slate-100 rounded animate-pulse" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) return null;

    return (
        <section className="w-full bg-white border-b border-slate-100">
            <div className="max-w-[1440px] mx-auto px-4 py-4">
                <div className="flex items-center gap-4 md:gap-8 overflow-x-auto hide-scrollbar pb-2">
                    {categories.map((category) => {
                        const isImageUrl = category.icon && (
                            category.icon.startsWith('http://') ||
                            category.icon.startsWith('https://') ||
                            category.icon.startsWith('/')
                        );

                        return (
                            <Link
                                key={category._id}
                                href={`/category/${category.slug}`}
                                className="flex flex-col items-center gap-2 shrink-0 group min-w-[72px] snap-start"
                            >
                                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-slate-50 border border-slate-200 group-hover:border-primary group-hover:shadow-md flex items-center justify-center transition-all duration-300 overflow-hidden text-slate-400 group-hover:text-primary">
                                    {isImageUrl ? (
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : category.icon ? (
                                        <span className="text-3xl select-none">
                                            {category.icon}
                                        </span>
                                    ) : (
                                        <span className="material-symbols-outlined text-3xl select-none">
                                            image
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs md:text-sm font-medium text-slate-600 group-hover:text-primary text-center leading-tight max-w-[80px] line-clamp-2 transition-colors">
                                    {category.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
