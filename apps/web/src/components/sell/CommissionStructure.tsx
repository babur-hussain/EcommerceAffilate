"use client";
import { FadeIn, SectionHeading, ScaleIn } from "./AnimatedSection";
import { ArrowDown, ArrowRight } from "lucide-react";

const examples = [
    { price: "₹1,000", comm: "5%", fee: "₹50", seller: "₹950", influencer: "₹100-150", category: "Fashion" },
    { price: "₹2,500", comm: "3%", fee: "₹75", seller: "₹2,425", influencer: "₹250-375", category: "Electronics" },
    { price: "₹500", comm: "5%", fee: "₹25", seller: "₹475", influencer: "₹50-75", category: "Beauty" },
    { price: "₹15,000", comm: "2%", fee: "₹300", seller: "₹14,700", influencer: "₹1,500-2,250", category: "Premium" },
];

export default function CommissionStructure() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-gradient-to-b from-blue-50 to-white" id="commission">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="Commission Model"
                    title="Transparent Pricing. Maximum Profit."
                    subtitle="Our commission ranges from just 2% to 5% depending on category — compared to 15-42% on other platforms. You keep more of every sale."
                />

                {/* Commission Flow */}
                <FadeIn>
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 md:p-10 shadow-sm mb-10 sm:mb-14">
                        <h3 className="text-center text-base sm:text-lg font-bold text-slate-800 mb-5 sm:mb-8">How Revenue Splits on Every Sale</h3>
                        <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4 md:gap-6">
                            {[
                                { label: "Sale Price", value: "₹1,000", color: "bg-slate-100 border-slate-200 text-slate-800" },
                                { label: "Platform Fee (5%)", value: "₹50", color: "bg-blue-50 border-blue-200 text-blue-700" },
                                { label: "Seller Gets", value: "₹950", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
                                { label: "Influencer Earns", value: "₹100-150", color: "bg-amber-50 border-amber-200 text-amber-700" },
                            ].map((step, i) => (
                                <div key={i} className="flex flex-col md:flex-row items-center gap-2 sm:gap-4 w-full md:w-auto">
                                    <div className={`rounded-xl sm:rounded-2xl border-2 ${step.color} p-3 sm:p-5 text-center w-full md:w-auto md:min-w-[140px]`}>
                                        <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-70 mb-0.5 sm:mb-1">{step.label}</div>
                                        <div className="text-xl sm:text-2xl font-extrabold">{step.value}</div>
                                    </div>
                                    {i < 3 && <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block" />}
                                    {i < 3 && <ArrowDown className="w-4 h-4 text-slate-300 md:hidden" />}
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* Example Cards - 2-col on mobile */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
                    {examples.map((ex, i) => (
                        <ScaleIn key={i} delay={i * 0.08}>
                            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-3 sm:px-5 py-2.5 sm:py-3">
                                    <span className="text-blue-100 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{ex.category}</span>
                                    <div className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">{ex.price}</div>
                                </div>
                                <div className="p-3 sm:p-5 space-y-2 sm:space-y-3">
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-slate-500">Fee ({ex.comm})</span>
                                        <span className="font-semibold text-slate-700">-{ex.fee}</span>
                                    </div>
                                    <div className="h-px bg-slate-100" />
                                    <div className="flex justify-between text-xs sm:text-sm">
                                        <span className="text-emerald-600 font-semibold">You Get</span>
                                        <span className="font-extrabold text-emerald-600 text-sm sm:text-lg">{ex.seller}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] sm:text-sm">
                                        <span className="text-amber-600 font-medium">Influencer</span>
                                        <span className="font-semibold text-amber-600 text-[11px] sm:text-sm">{ex.influencer}</span>
                                    </div>
                                </div>
                            </div>
                        </ScaleIn>
                    ))}
                </div>

                <FadeIn>
                    <p className="text-center text-xs sm:text-sm text-slate-400 mt-6 sm:mt-8 px-2">
                        * Influencer commissions are paid from the seller&apos;s marketing budget. Commission varies by category (2-40%).
                    </p>
                </FadeIn>
            </div>
        </section>
    );
}
