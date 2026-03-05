"use client";
import { FadeIn, SectionHeading, ScaleIn } from "./AnimatedSection";
import { ShoppingCart, CreditCard, PackageCheck, Truck, CheckCircle, RotateCcw, Banknote, ArrowDown } from "lucide-react";

const stages = [
    { icon: <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Order Placed", desc: "Customer places order via app or website", color: "bg-blue-500" },
    { icon: <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Payment Confirmed", desc: "Razorpay/UPI/COD payment verified", color: "bg-indigo-500" },
    { icon: <PackageCheck className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Processing", desc: "You receive notification and pack the order", color: "bg-purple-500" },
    { icon: <Truck className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Shipped", desc: "Shipped via Shiprocket with AWB tracking", color: "bg-amber-500" },
    { icon: <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Delivered", desc: "Customer receives the order", color: "bg-emerald-500" },
    { icon: <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Return (Optional)", desc: "Customer may request return/replacement", color: "bg-rose-400" },
    { icon: <Banknote className="w-4 h-4 sm:w-5 sm:h-5" />, label: "Settlement", desc: "You receive payment per your cycle", color: "bg-green-600" },
];

export default function OrderLifecycle() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-slate-50" id="orders">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading badge="Order Flow" title="Complete Order Lifecycle" subtitle="From customer click to your bank account — every step is transparent, tracked, and automated." />

                <FadeIn>
                    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 md:p-10 shadow-sm">
                        <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                            {stages.map((s, i) => (
                                <div key={i} className="w-full max-w-md">
                                    <div className="flex items-center gap-3 sm:gap-4 py-2.5 sm:py-3">
                                        <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full ${s.color} flex items-center justify-center text-white shrink-0 shadow-lg`}>{s.icon}</div>
                                        <div>
                                            <div className="font-bold text-slate-800 text-xs sm:text-sm">{s.label}</div>
                                            <div className="text-[10px] sm:text-xs text-slate-500">{s.desc}</div>
                                        </div>
                                    </div>
                                    {i < stages.length - 1 && (
                                        <div className="flex justify-center"><ArrowDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300" /></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* Order Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5 mt-8 sm:mt-12">
                    {[
                        { title: "Payment Methods", items: ["Razorpay (UPI)", "Credit/Debit Cards", "Net Banking", "Wallets", "Cash on Delivery"], color: "blue" },
                        { title: "Shipping Features", items: ["Shiprocket Integration", "Auto AWB Tracking", "Multi-courier Support", "Label Generation", "Pickup Scheduling"], color: "amber" },
                        { title: "Return Handling", items: ["Image-based Returns", "Admin Approval", "Return/Replacement", "Auto Refund Process", "Seller Protection"], color: "rose" },
                    ].map((card, i) => (
                        <ScaleIn key={i} delay={i * 0.1}>
                            <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-4 sm:p-6 h-full">
                                <h4 className="font-bold text-slate-900 mb-3 sm:mb-4 text-sm sm:text-base">{card.title}</h4>
                                <ul className="space-y-2 sm:space-y-2.5">
                                    {card.items.map((item, j) => (
                                        <li key={j} className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                                            <CheckCircle className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${card.color === "blue" ? "text-blue-500" : card.color === "amber" ? "text-amber-500" : "text-rose-500"}`} />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </ScaleIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
