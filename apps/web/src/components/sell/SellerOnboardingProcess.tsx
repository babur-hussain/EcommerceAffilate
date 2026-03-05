"use client";
import { FadeIn, SectionHeading, ScaleIn } from "./AnimatedSection";
import { Building2, FileCheck, Receipt, Landmark, Store, PackagePlus, ShieldCheck, Rocket } from "lucide-react";

const steps = [
    { icon: <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Business Registration", desc: "Register with your legal business name, trade name, business type, and nature of business.", time: "5 min" },
    { icon: <FileCheck className="w-5 h-5 sm:w-6 sm:h-6" />, title: "KYC Verification", desc: "Upload government ID (Aadhaar/PAN/Passport), selfie, signature, and business address proof.", time: "5 min" },
    { icon: <Receipt className="w-5 h-5 sm:w-6 sm:h-6" />, title: "GST & Tax Details", desc: "Provide your GSTIN, GST registration type, PAN number, and optional MSME/Udyam registration.", time: "3 min" },
    { icon: <Landmark className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Bank Account Setup", desc: "Add bank account details, upload cancelled cheque, and choose your settlement cycle.", time: "3 min" },
    { icon: <Store className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Store Profile Setup", desc: "Upload your store logo, write a description, select categories, and add social media links.", time: "5 min" },
    { icon: <PackagePlus className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Upload Your Products", desc: "List products with images, pricing, variants, descriptions, inventory, and shipping details.", time: "Per product" },
    { icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Admin Approval", desc: "Our team reviews your account and product listings. Approval within 24-48 hours.", time: "24-48 hrs" },
    { icon: <Rocket className="w-5 h-5 sm:w-6 sm:h-6" />, title: "Start Selling!", desc: "Your products go live and become available to 10,000+ influencers. Orders start flowing!", time: "Instant" },
];

export default function SellerOnboardingProcess() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-white" id="onboarding">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    badge="Get Started"
                    title="Start Selling in 8 Simple Steps"
                    subtitle="From registration to your first sale — it takes less than 30 minutes to get everything set up."
                />

                {/* Mobile: connected vertical timeline. Desktop: alternating */}
                <div className="relative max-w-3xl mx-auto lg:max-w-7xl">
                    {/* Vertical line — visible on all sizes now */}
                    <div className="absolute left-5 sm:left-6 lg:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-blue-200 via-blue-400 to-emerald-400" />

                    <div className="space-y-4 sm:space-y-6 lg:space-y-0">
                        {steps.map((step, i) => (
                            <ScaleIn key={i} delay={i * 0.06}>
                                <div className={`relative lg:grid lg:grid-cols-2 lg:gap-12 ${i > 0 ? "lg:mt-8" : ""}`}>
                                    {/* Timeline dot — mobile: left-aligned, desktop: center */}
                                    <div className="absolute left-5 sm:left-6 lg:left-1/2 top-4 -translate-x-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25">
                                        {i + 1}
                                    </div>

                                    {/* Content */}
                                    <div className={`pl-14 sm:pl-16 lg:pl-0 ${i % 2 === 0 ? "lg:text-right lg:pr-16" : "lg:col-start-2 lg:pl-16"}`}>
                                        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-4 sm:p-6 hover:shadow-lg transition-all">
                                            <div className={`flex items-center gap-2.5 sm:gap-3 mb-2 sm:mb-3 ${i % 2 === 0 ? "lg:flex-row-reverse" : ""}`}>
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                                                    {step.icon}
                                                </div>
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-bold text-slate-900">{step.title}</h3>
                                                    <span className="text-[10px] sm:text-xs text-blue-500 font-semibold">{step.time}</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            </ScaleIn>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
