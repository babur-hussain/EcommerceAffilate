"use client";
import { SectionHeading, ScaleIn } from "./AnimatedSection";
import { TrendingUp, Users, Wallet, Globe, Rocket, ShieldCheck, LayoutDashboard, Truck } from "lucide-react";

const benefits = [
    { icon: <TrendingUp className="w-7 h-7" />, title: "Lowest Commission", desc: "Keep up to 95-98% of every sale. Pay only 2-5% platform fee — the lowest in India.", gradient: "from-emerald-500 to-teal-500" },
    { icon: <Users className="w-7 h-7" />, title: "Free Influencer Marketing", desc: "10,000+ influencers actively promote your products on Instagram, YouTube, and WhatsApp — at zero cost to you.", gradient: "from-blue-500 to-indigo-500" },
    { icon: <Wallet className="w-7 h-7" />, title: "Fast Payouts", desc: "Choose daily, weekly, or bi-weekly settlements. No more waiting weeks to receive your money.", gradient: "from-amber-500 to-orange-500" },
    { icon: <Globe className="w-7 h-7" />, title: "Nationwide Reach", desc: "Sell across India with integrated Shiprocket logistics. One platform, 28,000+ pin codes covered.", gradient: "from-purple-500 to-pink-500" },
    { icon: <Rocket className="w-7 h-7" />, title: "Zero Listing Fees", desc: "List unlimited products for free. No monthly subscription, no hidden charges, no gotchas.", gradient: "from-rose-500 to-red-500" },
    { icon: <LayoutDashboard className="w-7 h-7" />, title: "Powerful Dashboard", desc: "Real-time analytics, inventory tracking, order management, coupon tools, and influencer performance — all in one place.", gradient: "from-cyan-500 to-blue-500" },
    { icon: <Truck className="w-7 h-7" />, title: "Integrated Logistics", desc: "Shiprocket-powered shipping with automated AWB, label printing, real-time tracking, and multi-courier support.", gradient: "from-indigo-500 to-violet-500" },
    { icon: <ShieldCheck className="w-7 h-7" />, title: "Seller Protection", desc: "Regulated return policy, KYC-verified buyers, and fraud detection protect you from return abuse.", gradient: "from-teal-500 to-green-500" },
];

export default function SellerBenefits() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-white" id="benefits">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="Why Choose Us"
                    title="Everything You Need to Sell Successfully"
                    subtitle="Local For Vocal provides the tools, reach, and economics that help you grow faster than ever."
                />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {benefits.map((b, i) => (
                        <ScaleIn key={i} delay={i * 0.06}>
                            <div className="group bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-1 h-full">
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center text-white mb-3 sm:mb-4 group-hover:scale-110 transition-transform`}>
                                    {b.icon}
                                </div>
                                <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{b.title}</h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{b.desc}</p>
                            </div>
                        </ScaleIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
