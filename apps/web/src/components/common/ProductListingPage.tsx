"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SearchResultCard from "@/components/search/SearchResultCard";

interface Product {
    _id: string;
    title: string;
    slug: string;
    price: number;
    mrp?: number;
    primaryImage: string;
    brand: string;
    rating?: number;
}

interface ProductListingPageProps {
    title: string;
    subtitle: string;
    icon: string;
    apiUrl: string;
    emptyIcon?: string;
    emptyTitle?: string;
    emptySubtitle?: string;
}

export default function ProductListingPage({
    title,
    subtitle,
    icon,
    apiUrl,
    emptyIcon = "inventory_2",
    emptyTitle = "No products found",
    emptySubtitle = "Check back soon for updates!",
}: ProductListingPageProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            setLoading(true);
            try {
                const res = await fetch(apiUrl);
                if (res.ok) {
                    const data = await res.json();
                    setProducts(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error("Error fetching products:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [apiUrl]);

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
                    <span className="text-slate-900 font-semibold">{title}</span>
                </div>

                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-3xl text-primary">{icon}</span>
                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
                    </div>
                    <p className="text-slate-500">{subtitle}</p>
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-slate-50 rounded-xl h-[400px] animate-pulse" />
                        ))}
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-12">
                        {products.map((product) => (
                            <SearchResultCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-slate-300">
                            <span className="material-symbols-outlined text-5xl">{emptyIcon}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{emptyTitle}</h3>
                        <p className="text-slate-500 max-w-md">{emptySubtitle}</p>
                    </div>
                )}
            </main>
        </div>
    );
}
