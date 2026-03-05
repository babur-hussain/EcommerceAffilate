"use client";
import { FadeIn, SectionHeading, ScaleIn } from "./AnimatedSection";
import { Layers, Eye, MapPin, ShoppingBag, Bell, Coins, Camera, Tag, Shield, Star, Palette, Smartphone } from "lucide-react";

const features = [
    { icon: <Layers className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Server-Driven UI", desc: "Dynamic layouts without app updates" },
    { icon: <Eye className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Influencer Storefronts", desc: "Personal curated shop pages" },
    { icon: <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Location Shopping", desc: "GPS-powered product discovery" },
    { icon: <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Multi-Category", desc: "Fashion, Beauty, Electronics & more" },
    { icon: <Bell className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Push Notifications", desc: "Order updates & promos via FCM" },
    { icon: <Coins className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Wallet & Coins", desc: "Reward coins for referrals" },
    { icon: <Camera className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Stories", desc: "Instagram-like product stories" },
    { icon: <Tag className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Product Variants", desc: "Color, size & custom variants" },
    { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Trust Badges", desc: "Quality & seller verification" },
    { icon: <Star className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Ratings & Reviews", desc: "Customer star ratings" },
    { icon: <Palette className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Themed Pages", desc: "Unique category designs" },
    { icon: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Native iOS App", desc: "Premium SwiftUI experience" },
];

export default function PlatformFeatures() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading badge="Platform" title="A Modern Marketplace Built for Growth" subtitle="Every feature designed to give your products maximum visibility and your customers the best experience." />
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                    {features.map((f, i) => (
                        <ScaleIn key={i} delay={i * 0.04}>
                            <div className="bg-slate-50 rounded-lg sm:rounded-xl p-3 sm:p-5 hover:bg-blue-50 hover:shadow-sm transition-all h-full border border-transparent hover:border-blue-100">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-white flex items-center justify-center text-blue-600 mb-2 sm:mb-3 shadow-sm">{f.icon}</div>
                                <h3 className="text-[11px] sm:text-sm font-bold text-slate-800 mb-0.5 sm:mb-1">{f.title}</h3>
                                <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                            </div>
                        </ScaleIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
