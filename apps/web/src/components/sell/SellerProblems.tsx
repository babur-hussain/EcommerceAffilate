"use client";
import { FadeIn, SectionHeading, ScaleIn } from "./AnimatedSection";
import { TrendingDown, AlertTriangle, Ban, Clock, DollarSign, Frown } from "lucide-react";

const problems = [
    { icon: <DollarSign className="w-7 h-7" />, title: "Crushing Commissions", desc: "Amazon & Flipkart charge 15-42% commissions, devouring your profit margins on every single sale.", color: "text-red-500 bg-red-50" },
    { icon: <TrendingDown className="w-7 h-7" />, title: "Marketing Black Hole", desc: "You spend thousands on PPC ads just to appear in search results. No organic visibility without paying.", color: "text-orange-500 bg-orange-50" },
    { icon: <Clock className="w-7 h-7" />, title: "Delayed Settlements", desc: "Wait 7-14 days or more to receive your own money. Cash flow crunches become a norm.", color: "text-amber-500 bg-amber-50" },
    { icon: <Ban className="w-7 h-7" />, title: "No Brand Identity", desc: "Your brand gets lost in a sea of competitors. Customers remember the marketplace, not you.", color: "text-purple-500 bg-purple-50" },
    { icon: <AlertTriangle className="w-7 h-7" />, title: "Return Abuse", desc: "Unregulated return policies hurt honest sellers. You eat the shipping costs on fraudulent returns.", color: "text-rose-500 bg-rose-50" },
    { icon: <Frown className="w-7 h-7" />, title: "Zero Customer Access", desc: "You never get to talk to your own customers. The marketplace owns the relationship.", color: "text-slate-500 bg-slate-50" },
];

export default function SellerProblems() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="The Problem"
                    title="Why Sellers Are Struggling on Traditional Marketplaces"
                    subtitle="High commissions, delayed payments, and zero brand visibility — the current marketplace model is broken for sellers."
                />
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                    {problems.map((p, i) => (
                        <ScaleIn key={i} delay={i * 0.08}>
                            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 h-full">
                                <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 ${p.color}`}>{p.icon}</div>
                                <h3 className="text-sm sm:text-lg font-bold text-slate-900 mb-1 sm:mb-2">{p.title}</h3>
                                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{p.desc}</p>
                            </div>
                        </ScaleIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
