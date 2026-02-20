"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Category {
    _id: string;
    name: string;
    slug: string;
    icon?: string;
    isActive: boolean;
}

export default function CollectionsPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch("/api/categories?parentCategory=null");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data.filter((c: Category) => c.isActive));
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span>
                        Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Collections</span>
                </div>

                {/* Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-3xl text-primary">collections_bookmark</span>
                        <h1 className="text-3xl font-extrabold tracking-tight">Collections</h1>
                    </div>
                    <p className="text-slate-500">Browse our curated collections across all categories.</p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="aspect-square bg-slate-50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-12">
                        {categories.map((cat) => {
                            const isImageUrl = cat.icon && (cat.icon.startsWith("http") || cat.icon.startsWith("/"));
                            return (
                                <Link
                                    key={cat._id}
                                    href={`/category/${cat.slug}`}
                                    className="group relative aspect-square bg-linear-to-br from-slate-50 to-slate-100 rounded-2xl border border-slate-200 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 flex flex-col items-center justify-center gap-4 transition-all duration-300 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-linear-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:shadow-md transition-all">
                                        {isImageUrl ? (
                                            <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover rounded-2xl" />
                                        ) : cat.icon ? (
                                            <span className="text-4xl">{cat.icon}</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-4xl">category</span>
                                        )}
                                    </div>
                                    <span className="relative text-sm md:text-base font-bold text-slate-700 group-hover:text-primary text-center px-3 transition-colors">
                                        {cat.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
