"use client";
import { useState } from "react";
import { FadeIn, SectionHeading } from "./AnimatedSection";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    { q: "How much commission does Local For Vocal charge?", a: "Our commission ranges from 2% to 40% depending on the product category. Most categories fall in the 2-5% range — significantly lower than Amazon (15-42%) and Flipkart (15-30%). You keep more of every sale." },
    { q: "When do I receive payments?", a: "You choose your settlement cycle: Daily, Weekly, or Bi-Weekly. Payments are deposited directly to your registered bank account via secure NEFT/IMPS transfers." },
    { q: "Do I need GST registration to sell?", a: "GST registration is recommended and required for most product categories in India. You'll need your GSTIN during the onboarding process. Composition scheme sellers are also supported." },
    { q: "How do influencers promote my products?", a: "Influencers browse your product catalog and generate unique affiliate links with their referral code. They share these on Instagram, YouTube, WhatsApp, and their personal storefronts. You pay commission only when they generate a sale — zero upfront cost." },
    { q: "Who handles delivery and logistics?", a: "We've integrated with Shiprocket for nationwide logistics. You just pack the order — we handle courier selection, AWB generation, label printing, pickup scheduling, and real-time tracking." },
    { q: "How do returns work?", a: "Customers can request returns with photo evidence. You review and approve/reject through your dashboard. Approved returns are picked up and refunds are processed automatically." },
    { q: "How do I list products?", a: "Use the seller dashboard to add products with images, descriptions, pricing, variants (color/size), inventory levels, and shipping details. Set your influencer commission rate and submit for admin approval." },
    { q: "Is there a monthly subscription fee?", a: "No. There are zero monthly fees, zero listing fees, and zero hidden charges. You only pay the small platform commission when you make a sale." },
    { q: "What categories can I sell?", a: "We support Fashion, Beauty, Electronics, Sports, Furniture, Books, Grocery, Home Decor, Accessories, and more. Both physical and digital products are supported." },
    { q: "Can I set my own influencer commission?", a: "Yes! You can set the influencer commission percentage on a per-product basis. Higher commissions attract more influencers to promote your products." },
    { q: "What payment methods do customers use?", a: "We support all major payment methods via Razorpay: UPI, Credit/Debit Cards, Net Banking, Digital Wallets, and Cash on Delivery (COD)." },
    { q: "How do I track my orders?", a: "Your seller dashboard shows real-time order status with filters for new, processing, shipped, and delivered orders. Shiprocket integration provides AWB tracking for every shipment." },
    { q: "Can I run promotions and coupons?", a: "Yes! Create flat or percentage-based coupons with minimum order values, max usage limits, and validity periods. You can also sponsor products for higher visibility." },
    { q: "How long does account approval take?", a: "Once you submit all required documents (KYC, GST, bank details), our team reviews and approves your account within 24-48 hours." },
    { q: "Is there a mobile app for sellers?", a: "Currently, sellers manage their business through the web-based seller dashboard. The customer-facing mobile app (iOS) drives traffic and sales to your products." },
];

function FAQItem({ faq, isOpen, onClick }: { faq: typeof faqs[0]; isOpen: boolean; onClick: () => void }) {
    return (
        <div className="border border-slate-200 rounded-lg sm:rounded-xl overflow-hidden bg-white hover:shadow-sm transition-shadow">
            <button onClick={onClick} className="w-full flex items-center justify-between p-4 sm:p-5 text-left min-h-[48px]">
                <span className="font-semibold text-slate-800 text-xs sm:text-sm pr-3 sm:pr-4">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-slate-500 leading-relaxed">{faq.a}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function SellerFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-14 sm:py-20 md:py-28 bg-slate-50" id="faq">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading badge="FAQ" title="Frequently Asked Questions" subtitle="Everything you need to know about selling on Local For Vocal." />
                <FadeIn>
                    <div className="space-y-2 sm:space-y-3">
                        {faqs.map((faq, i) => (
                            <FAQItem key={i} faq={faq} isOpen={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? null : i)} />
                        ))}
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
