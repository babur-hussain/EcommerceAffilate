"use client";

import { useState } from "react";
import Link from "next/link";

const faqs = [
    {
        category: "Orders & Shipping",
        icon: "local_shipping",
        questions: [
            { q: "How do I track my order?", a: "You can track your order by visiting the Track Order page and entering your order ID. You'll receive real-time updates on your order status." },
            { q: "What are the shipping charges?", a: "We offer free shipping on orders above ₹499. For orders below ₹499, a flat shipping fee of ₹49 is applicable." },
            { q: "How long does delivery take?", a: "Standard delivery takes 5-7 business days. Express delivery is available in select cities and takes 2-3 business days." },
            { q: "Can I change my delivery address?", a: "You can change your delivery address before the order is shipped. Go to My Orders, select the order and click on 'Change Address'." },
        ],
    },
    {
        category: "Returns & Refunds",
        icon: "autorenew",
        questions: [
            { q: "What is your return policy?", a: "We offer a 7-day easy return policy for most products. Products must be unused and in original packaging." },
            { q: "How do I initiate a return?", a: "Go to My Orders, select the item you want to return, and click 'Return Item'. Schedule a pickup or drop it off at a nearby center." },
            { q: "When will I receive my refund?", a: "Refunds are processed within 5-7 business days after we receive and verify the returned product. The amount will be credited to your original payment method." },
            { q: "Can I exchange a product?", a: "Yes, exchanges are available for select products. You can initiate an exchange from My Orders section." },
        ],
    },
    {
        category: "Account & Payments",
        icon: "account_circle",
        questions: [
            { q: "How do I create an account?", a: "Click the 'Account' button in the header and follow the registration process. You can sign up using your email or phone number." },
            { q: "What payment methods do you accept?", a: "We accept UPI, credit/debit cards, net banking, and cash on delivery (COD) where available." },
            { q: "Is my payment information secure?", a: "Absolutely. All transactions are encrypted with 256-bit SSL encryption and we never store your card details." },
            { q: "How do I reset my password?", a: "Click on 'Forgot Password' on the login page, enter your email, and follow the instructions sent to reset your password." },
        ],
    },
    {
        category: "Products & Quality",
        icon: "verified",
        questions: [
            { q: "Are all products genuine?", a: "Yes, we source all products directly from authorized sellers and brands. Every product on our platform is 100% genuine." },
            { q: "How do I check product authenticity?", a: "All products come with brand tags and authenticity certificates where applicable. You can also verify using the brand's official verification tools." },
            { q: "What if I receive a damaged product?", a: "Contact us immediately with photos of the damage. We'll arrange a replacement or full refund within 24 hours." },
        ],
    },
];

export default function HelpCenterPage() {
    const [openIndex, setOpenIndex] = useState<string | null>(null);

    const toggle = (key: string) => setOpenIndex(openIndex === key ? null : key);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span> Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Help Center</span>
                </div>

                {/* Header */}
                <div className="text-center mb-12">
                    <span className="material-symbols-outlined text-5xl text-primary mb-4 block">support_agent</span>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-3">How can we help you?</h1>
                    <p className="text-slate-500 text-lg max-w-xl mx-auto">Find answers to frequently asked questions about orders, shipping, returns, and more.</p>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <Link href="/track-order" className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl hover:bg-primary/5 hover:border-primary/20 border border-slate-200 transition-all group">
                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary">local_shipping</span>
                        <span className="font-bold text-sm group-hover:text-primary">Track Order</span>
                    </Link>
                    <Link href="/returns" className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl hover:bg-primary/5 hover:border-primary/20 border border-slate-200 transition-all group">
                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary">autorenew</span>
                        <span className="font-bold text-sm group-hover:text-primary">Returns</span>
                    </Link>
                    <Link href="/shipping-info" className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl hover:bg-primary/5 hover:border-primary/20 border border-slate-200 transition-all group">
                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary">package_2</span>
                        <span className="font-bold text-sm group-hover:text-primary">Shipping Info</span>
                    </Link>
                    <Link href="/contact" className="flex flex-col items-center gap-3 p-6 bg-slate-50 rounded-2xl hover:bg-primary/5 hover:border-primary/20 border border-slate-200 transition-all group">
                        <span className="material-symbols-outlined text-3xl text-slate-400 group-hover:text-primary">mail</span>
                        <span className="font-bold text-sm group-hover:text-primary">Contact Us</span>
                    </Link>
                </div>

                {/* FAQ Sections */}
                <div className="space-y-8 pb-12">
                    {faqs.map((section, si) => (
                        <div key={si}>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-primary">{section.icon}</span>
                                <h2 className="text-xl font-bold">{section.category}</h2>
                            </div>
                            <div className="space-y-3">
                                {section.questions.map((faq, fi) => {
                                    const key = `${si}-${fi}`;
                                    const isOpen = openIndex === key;
                                    return (
                                        <div key={fi} className="border border-slate-200 rounded-xl overflow-hidden">
                                            <button
                                                onClick={() => toggle(key)}
                                                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                                            >
                                                <span className="font-semibold text-slate-800">{faq.q}</span>
                                                <span className="material-symbols-outlined text-slate-400 shrink-0 ml-3">
                                                    {isOpen ? "expand_less" : "expand_more"}
                                                </span>
                                            </button>
                                            {isOpen && (
                                                <div className="px-5 pb-4 text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                                                    {faq.a}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
