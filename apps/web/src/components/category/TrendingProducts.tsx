"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BackendProduct } from "@/types/product";
import { useAuth } from "@/context/AuthContext";
import AffiliateButton from "@/components/affiliate/AffiliateButton";

const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

interface TrendingProductsProps {
    products: BackendProduct[];
    categorySlug: string;
}

export default function TrendingProducts({ products, categorySlug }: TrendingProductsProps) {
    const { backendUser, idToken } = useAuth();
    const [referralCode, setReferralCode] = useState<string | null>(null);

    // Check if user is an influencer
    const isInfluencer = backendUser?.role === "INFLUENCER";

    // Fetch influencer's referral code
    useEffect(() => {
        async function fetchReferralCode() {
            if (!isInfluencer) return;

            try {
                const res = await fetch(`${API_BASE}/influencers/profile`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${idToken}`,
                    },
                    credentials: "include",
                });
                if (res.ok) {
                    const profile = await res.json();
                    setReferralCode(profile.referralCode);
                }
            } catch (err) {
                console.error("Error fetching referral code:", err);
            }
        }
        fetchReferralCode();
    }, [isInfluencer, idToken]);

    if (products.length === 0) return null;

    // Take top 8 products for trending
    const trendingProducts = products.slice(0, 8);

    return (
        <section>
            <div className="flex items-center justify-between mb-6 px-2">
                <div>
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900">Trending Now</h2>
                    <p className="text-xs text-slate-500 font-medium">Community favorites this week</p>
                </div>
                <div className="flex gap-2">
                    <button className="size-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                        <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button className="size-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all">
                        <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                </div>
            </div>

            <div className="flex gap-5 overflow-x-auto pb-6 px-2 scrollbar-hide snap-x">
                {trendingProducts.map((product, index) => {
                    const imageUrl = product.images?.[0] || "/placeholder-product.jpg";
                    const price = product.originalPrice ? product.price : product.price;
                    const originalPrice = product.originalPrice || null;

                    return (
                        <Link
                            key={product._id}
                            href={`/product/${product._id}`}
                            className="shrink-0 w-44 snap-start group cursor-pointer"
                        >
                            <div className="relative aspect-4/5 bg-slate-100 rounded-xl overflow-hidden mb-3">
                                <div className="absolute inset-0 group-hover:scale-110 transition-transform duration-500">
                                    <Image
                                        src={imageUrl}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                {index === 0 && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-400 text-[10px] font-bold text-slate-900 rounded-sm">
                                        BESTSELLER
                                    </span>
                                )}
                                {index === 1 && (
                                    <span className="absolute top-2 left-2 px-2 py-0.5 bg-primary text-[10px] font-bold text-white rounded-sm">
                                        NEW
                                    </span>
                                )}

                                {/* Affiliate Link Button - Top Right */}
                                {isInfluencer && referralCode && (
                                    <div className="absolute top-2 right-2 z-10">
                                        <AffiliateButton
                                            productId={product._id}
                                            referralCode={referralCode}
                                            variant="icon"
                                            className="bg-white/90 text-primary shadow-sm hover:bg-white"
                                        />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                                {product.title}
                            </h3>
                            <p className="text-xs text-slate-500 mb-1 truncate">
                                {product.brand || "Brand"}
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-extrabold text-primary">
                                    ₹{price.toLocaleString()}
                                </p>
                                {originalPrice && (
                                    <p className="text-xs text-slate-400 line-through">
                                        ₹{originalPrice.toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}
