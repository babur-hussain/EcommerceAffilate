"use client";
import { FadeIn, SectionHeading } from "./AnimatedSection";
import { Check, X, Minus, Crown } from "lucide-react";

const features = [
    { feature: "Platform Commission", lfv: "2–5%", amazon: "15–42%", flipkart: "15–30%", highlight: true },
    { feature: "Seller Profit (₹1,000 sale)", lfv: "₹950–980", amazon: "₹580–850", flipkart: "₹700–850", highlight: true },
    { feature: "Listing Fees", lfv: "Free", amazon: "₹499+/mo", flipkart: "Free/Paid", highlight: false },
    { feature: "Influencer Marketing", lfv: true, amazon: false, flipkart: false, highlight: false },
    { feature: "Daily Settlement", lfv: true, amazon: false, flipkart: false, highlight: false },
    { feature: "Settlement Cycle", lfv: "Daily/Weekly", amazon: "7-14 Days", flipkart: "7-14 Days", highlight: false },
    { feature: "Influencer Commission", lfv: "10-15%+", amazon: "1-5%", flipkart: "N/A", highlight: false },
    { feature: "Own Brand Storefront", lfv: true, amazon: false, flipkart: false, highlight: false },
    { feature: "Influencer Storefronts", lfv: true, amazon: false, flipkart: false, highlight: false },
    { feature: "Direct Customer Access", lfv: true, amazon: false, flipkart: false, highlight: false },
    { feature: "Instagram-like Stories", lfv: true, amazon: false, flipkart: false, highlight: false },
    { feature: "Seller Dashboard", lfv: true, amazon: true, flipkart: true, highlight: false },
    { feature: "Nationwide Logistics", lfv: true, amazon: true, flipkart: true, highlight: false },
    { feature: "Multiple Payments", lfv: true, amazon: true, flipkart: true, highlight: false },
    { feature: "Product Variants", lfv: true, amazon: true, flipkart: true, highlight: false },
];

function CellValue({ val, winning = false }: { val: string | boolean; winning?: boolean }) {
    if (val === true) return <Check className={`w-4 h-4 sm:w-5 sm:h-5 mx-auto ${winning ? "text-emerald-500" : "text-emerald-400"}`} />;
    if (val === false) return <X className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 mx-auto" />;
    if (val === "N/A") return <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 mx-auto" />;
    return <span className={`text-xs sm:text-sm font-semibold ${winning ? "text-blue-700" : ""}`}>{val}</span>;
}

/* Mobile card version for a single comparison row */
function MobileComparisonCard({ f }: { f: typeof features[0] }) {
    return (
        <div className={`rounded-xl border p-4 ${f.highlight ? "bg-blue-50/50 border-blue-100" : "bg-white border-slate-100"}`}>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">{f.feature}</div>
            <div className="grid grid-cols-3 gap-2">
                {[
                    { label: "LFV", val: f.lfv, winning: true, color: "bg-blue-50 border-blue-200" },
                    { label: "Amazon", val: f.amazon, winning: false, color: "bg-slate-50 border-slate-200" },
                    { label: "Flipkart", val: f.flipkart, winning: false, color: "bg-slate-50 border-slate-200" },
                ].map((col, j) => (
                    <div key={j} className={`rounded-lg border text-center py-2.5 px-1 ${col.winning ? col.color : col.color}`}>
                        <div className={`text-[10px] font-bold uppercase mb-1 ${col.winning ? "text-blue-600" : "text-slate-400"}`}>{col.label}</div>
                        <CellValue val={col.val} winning={col.winning} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MarketplaceComparison() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-white" id="comparison">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="Comparison"
                    title="How We Stack Up Against the Giants"
                    subtitle="Side-by-side comparison shows why Local For Vocal is the smarter choice for serious sellers."
                />

                {/* Mobile: Stacked card layout */}
                <FadeIn>
                    <div className="md:hidden space-y-3">
                        {features.map((f, i) => (
                            <MobileComparisonCard key={i} f={f} />
                        ))}
                    </div>
                </FadeIn>

                {/* Desktop: Table layout */}
                <FadeIn>
                    <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 shadow-sm">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50">
                                    <th className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-wider">Feature</th>
                                    <th className="px-6 py-4 text-center">
                                        <div className="inline-flex flex-col items-center">
                                            <span className="text-sm font-extrabold text-blue-600 flex items-center gap-1"><Crown className="w-3.5 h-3.5 text-amber-500" /> Local For Vocal</span>
                                            <span className="text-xs text-emerald-500 font-medium mt-0.5">★ Best</span>
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-500">Amazon</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold text-slate-500">Flipkart</th>
                                </tr>
                            </thead>
                            <tbody>
                                {features.map((f, i) => (
                                    <tr key={i} className={`border-t border-slate-100 ${f.highlight ? "bg-blue-50/30" : i % 2 === 0 ? "bg-white" : "bg-slate-50/50"}`}>
                                        <td className="px-6 py-3.5 text-sm font-medium text-slate-700">{f.feature}</td>
                                        <td className="px-6 py-3.5 text-center text-blue-700 font-semibold"><CellValue val={f.lfv} winning /></td>
                                        <td className="px-6 py-3.5 text-center text-slate-500"><CellValue val={f.amazon} /></td>
                                        <td className="px-6 py-3.5 text-center text-slate-500"><CellValue val={f.flipkart} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
