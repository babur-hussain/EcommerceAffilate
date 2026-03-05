"use client";
import { FadeIn, SectionHeading, ScaleIn } from "./AnimatedSection";
import { ShoppingBag, Link2, Share2, CreditCard, Package, HandCoins, ArrowRight, Check } from "lucide-react";

const steps = [
    { icon: <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />, num: "01", title: "Seller Lists Product", desc: "You list your products with images, descriptions, variants, pricing, and set the influencer commission percentage." },
    { icon: <Link2 className="w-5 h-5 sm:w-6 sm:h-6" />, num: "02", title: "Influencer Generates Link", desc: "Influencers browse your catalog and create unique affiliate links with their referral code embedded." },
    { icon: <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />, num: "03", title: "Shared on Social Media", desc: "Influencers promote your products across Instagram, YouTube, WhatsApp, and their personal storefronts." },
    { icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />, num: "04", title: "Customer Makes Purchase", desc: "Customers click the link or use the referral code at checkout. The sale is attributed to the influencer." },
    { icon: <Package className="w-5 h-5 sm:w-6 sm:h-6" />, num: "05", title: "You Fulfill the Order", desc: "You process the order, pack the product, and ship via Shiprocket. The customer receives their order." },
    { icon: <HandCoins className="w-5 h-5 sm:w-6 sm:h-6" />, num: "06", title: "Everyone Gets Paid", desc: "You receive 95%+ of the sale price. The influencer earns their commission. Everyone wins." },
];

export default function InfluencerAffiliateSystem() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-gradient-to-b from-purple-50 to-white" id="how-it-works">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="Influencer Commerce"
                    title="How Influencer-Powered Selling Works"
                    subtitle="Your products get promoted by real content creators to their engaged audiences — organically, authentically, and at no upfront cost to you."
                />

                {/* Mobile: compact numbered list. Desktop: grid cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-10 sm:mb-14">
                    {steps.map((s, i) => (
                        <ScaleIn key={i} delay={i * 0.08}>
                            <div className="relative bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 hover:shadow-lg transition-all h-full">
                                <div className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-4">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shrink-0">{s.icon}</div>
                                    <span className="text-2xl sm:text-3xl font-extrabold text-purple-100">{s.num}</span>
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">{s.title}</h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </ScaleIn>
                    ))}
                </div>

                {/* Stats Banner */}
                <FadeIn>
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 text-white">
                        <div className="grid grid-cols-3 gap-4 sm:gap-8">
                            {[
                                { value: "₹0", label: "Upfront Marketing Cost", desc: "Influencers promote your products for free — they earn only when they generate a sale." },
                                { value: "10,000+", label: "Active Influencers", desc: "A growing network of verified content creators across fashion, beauty, tech, and more." },
                                { value: "3x", label: "Higher Conversion Rate", desc: "Influencer-recommended products convert 3x better than traditional marketplace ads." },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="text-2xl sm:text-4xl font-extrabold mb-1 sm:mb-2">{stat.value}</div>
                                    <div className="text-purple-100 font-medium text-xs sm:text-base">{stat.label}</div>
                                    <p className="text-purple-200/70 text-[10px] sm:text-sm mt-1 sm:mt-2 hidden sm:block">{stat.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* Influencer Storefront Info */}
                <FadeIn>
                    <div className="mt-10 sm:mt-14 bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-5 sm:p-8 md:p-10">
                        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[10px] sm:text-xs font-bold tracking-wider uppercase mb-3">Influencer Storefronts</span>
                                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 sm:mb-4">Every Influencer Gets a Personal Shop</h3>
                                <p className="text-slate-500 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">Each influencer gets their own curated storefront page — like a personal boutique — where they showcase their favorite picks from your catalog.</p>
                                <ul className="space-y-2 sm:space-y-3">
                                    {["Personal profile page with story ring", "Curated product grid with badges", "Shareable shop link for social media", "Product collections by category", "Real-time click & conversion analytics"].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600"><Check className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />{item}</li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl sm:rounded-2xl p-6 sm:p-8 flex items-center justify-center min-h-[220px] sm:min-h-[300px]">
                                <div className="text-center">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mb-2 sm:mb-3 flex items-center justify-center text-white text-xl sm:text-2xl font-bold ring-4 ring-purple-300/30">P</div>
                                    <div className="font-bold text-slate-800 text-base sm:text-lg">Priya&apos;s Boutique</div>
                                    <div className="text-slate-500 text-xs sm:text-sm mt-1">12 Products · 2.3K Followers</div>
                                    <div className="mt-3 sm:mt-4 bg-white rounded-lg px-3 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs text-purple-600 font-mono shadow-sm">lfvs.in/shop/PRIYA8K2M</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
