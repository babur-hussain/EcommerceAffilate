"use client";
import { FadeIn, SectionHeading, ScaleIn } from "./AnimatedSection";
import { BarChart3, Package, ShoppingCart, RotateCcw, Tag, Megaphone, Users, TrendingUp, Settings } from "lucide-react";

const features = [
    { icon: <Package className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Product Management", desc: "Add, edit, and manage unlimited products with variants, images, pricing, and SEO fields.", color: "bg-blue-50 text-blue-600" },
    { icon: <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Inventory Tracking", desc: "Real-time stock tracking with low-stock alerts, barcode support, and restock lead times.", color: "bg-emerald-50 text-emerald-600" },
    { icon: <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Order Management", desc: "View all orders with status filters, process orders, generate labels, and track deliveries.", color: "bg-purple-50 text-purple-600" },
    { icon: <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Returns & Refunds", desc: "Handle return requests with photo evidence, approve or reject, and process refunds.", color: "bg-rose-50 text-rose-600" },
    { icon: <Tag className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Coupons & Offers", desc: "Create flat or percentage discounts with min order values and usage limits.", color: "bg-amber-50 text-amber-600" },
    { icon: <Megaphone className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Sponsored Products", desc: "Boost visibility with sponsored placements. Set daily budgets and track ROI.", color: "bg-indigo-50 text-indigo-600" },
    { icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Influencer Analytics", desc: "See which influencers promote your products and track their clicks and commissions.", color: "bg-pink-50 text-pink-600" },
    { icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Revenue Reports", desc: "Daily/weekly/monthly dashboards with sales trends and performance.", color: "bg-teal-50 text-teal-600" },
    { icon: <Settings className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Business Settings", desc: "Manage GST, bank info, settlement preferences, and compliance documents.", color: "bg-slate-50 text-slate-600" },
];

export default function SellerDashboard() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-white" id="dashboard">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading badge="Dashboard" title="Your Complete Seller Control Center" subtitle="Manage products, orders, returns, promotions, analytics, and influencer performance — all in one place." />

                {/* Dashboard Preview */}
                <FadeIn>
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-10 mb-10 sm:mb-14 shadow-2xl overflow-hidden">
                        {/* Stats Row */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                            {[
                                { label: "Today's Revenue", value: "₹12,450", change: "+18%", up: true },
                                { label: "Orders", value: "23", change: "+5", up: true },
                                { label: "Products", value: "142", change: "2 low stock", up: false },
                                { label: "Influencer Sales", value: "₹4,200", change: "34% of total", up: true },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5">
                                    <div className="text-[10px] sm:text-xs text-slate-400 mb-0.5 sm:mb-1 truncate">{stat.label}</div>
                                    <div className="text-base sm:text-xl font-extrabold text-white">{stat.value}</div>
                                    <div className={`text-[10px] sm:text-xs mt-0.5 sm:mt-1 ${stat.up ? "text-emerald-400" : "text-amber-400"}`}>{stat.change}</div>
                                </div>
                            ))}
                        </div>

                        {/* Charts Row */}
                        <div className="grid sm:grid-cols-3 gap-2 sm:gap-4">
                            <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 sm:col-span-2">
                                <div className="text-[10px] sm:text-xs text-slate-400 mb-2 sm:mb-3">Revenue (Last 7 Days)</div>
                                <div className="flex items-end gap-1 sm:gap-1.5 h-16 sm:h-24">
                                    {[40, 60, 35, 80, 55, 90, 70].map((h, i) => (
                                        <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t transition-all" style={{ height: `${h}%` }} />
                                    ))}
                                </div>
                                <div className="flex justify-between mt-1.5 sm:mt-2 text-[8px] sm:text-[10px] text-slate-500">
                                    {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <span key={i}>{d}</span>)}
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5">
                                <div className="text-[10px] sm:text-xs text-slate-400 mb-2 sm:mb-3">Top Product</div>
                                <div className="text-white font-bold text-xs sm:text-sm mb-0.5 sm:mb-1">Printed Silk Saree</div>
                                <div className="text-slate-400 text-[10px] sm:text-xs">42 orders · ₹6,300</div>
                                <div className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-slate-400">Top Influencer</div>
                                <div className="text-white font-bold text-xs sm:text-sm mt-0.5 sm:mt-1">@priya_fashion</div>
                                <div className="text-slate-400 text-[10px] sm:text-xs">18 conversions</div>
                            </div>
                        </div>
                    </div>
                </FadeIn>

                {/* Feature Grid — 2 cols on mobile, 3 on tablet, 3 on desktop */}
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {features.map((f, i) => (
                        <ScaleIn key={i} delay={i * 0.05}>
                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${f.color} flex items-center justify-center mb-3 sm:mb-4`}>{f.icon}</div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-1 sm:mb-2">{f.title}</h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{f.desc}</p>
                            </div>
                        </ScaleIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
