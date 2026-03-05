"use client";
import { FadeIn, SectionHeading } from "./AnimatedSection";
import { IndianRupee, TrendingUp } from "lucide-react";

const testimonials = [
    { name: "Radhika Textiles", location: "Jaipur, Rajasthan", category: "Fashion", revenue: "₹2.4L/mo", growth: "+320%", quote: "We switched from Amazon and our profit margins doubled. The influencer network drives consistent sales without spending on ads.", since: "Jan 2026" },
    { name: "GlowUp Beauty Co.", location: "Mumbai, Maharashtra", category: "Beauty", revenue: "₹1.8L/mo", growth: "+180%", quote: "Influencers showcase our products authentically. Our conversion rates are way higher compared to paid ads on other platforms.", since: "Feb 2026" },
    { name: "TechZone India", location: "Bangalore, Karnataka", category: "Electronics", revenue: "₹5.2L/mo", growth: "+150%", quote: "The 2% commission is unbeatable for electronics. Plus, daily settlement means we never have cash flow issues.", since: "Dec 2025" },
];

export default function CaseStudies() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-white" id="case-studies">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading badge="Success Stories" title="Sellers Who Made the Switch" subtitle="Real businesses achieving real results on Local For Vocal." />

                {/* Mobile: horizontal scroll. Desktop: grid */}
                <div className="flex md:grid md:grid-cols-3 gap-4 sm:gap-6 overflow-x-auto pb-4 md:pb-0 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    {testimonials.map((t, i) => (
                        <FadeIn key={i} delay={i * 0.1}>
                            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all h-full flex flex-col min-w-[280px] sm:min-w-[320px] md:min-w-0 snap-center">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 sm:p-5 text-white">
                                    <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-200 mb-0.5 sm:mb-1">{t.category}</div>
                                    <div className="text-lg sm:text-xl font-extrabold">{t.name}</div>
                                    <div className="text-xs sm:text-sm text-blue-200 mt-0.5">{t.location}</div>
                                </div>
                                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed italic mb-4 sm:mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-3 sm:pt-4 border-t border-slate-100">
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <IndianRupee className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500" />
                                            <div>
                                                <div className="text-xs sm:text-sm font-bold text-slate-800">{t.revenue}</div>
                                                <div className="text-[9px] sm:text-[10px] text-slate-400">Revenue</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 sm:gap-2">
                                            <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-500" />
                                            <div>
                                                <div className="text-xs sm:text-sm font-bold text-blue-600">{t.growth}</div>
                                                <div className="text-[9px] sm:text-[10px] text-slate-400">Growth</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-[9px] sm:text-[10px] text-slate-400 mt-2 sm:mt-3">Since {t.since}</div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
