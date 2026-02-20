"use client";

import { useState } from "react";
import Link from "next/link";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "not_found" | "found">("idle");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;
        setStatus("loading");
        // Simulate lookup — in production, call your order API
        setTimeout(() => {
            setStatus("not_found");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-display">
            <main className="w-full max-w-[1440px] mx-auto px-4 md:px-10 py-6">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm">
                    <Link href="/" className="text-slate-500 hover:text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">home</span> Home
                    </Link>
                    <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                    <span className="text-slate-900 font-semibold">Track Order</span>
                </div>

                <div className="max-w-xl mx-auto py-12">
                    <div className="text-center mb-10">
                        <span className="material-symbols-outlined text-5xl text-primary mb-4 block">local_shipping</span>
                        <h1 className="text-4xl font-extrabold tracking-tight mb-3">Track Your Order</h1>
                        <p className="text-slate-500 text-lg">Enter your order ID to get real-time updates on your delivery.</p>
                    </div>

                    <form onSubmit={handleTrack} className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Order ID</label>
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder="e.g., ORD-20260220-XXXXX"
                                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-slate-900"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {status === "loading" ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Tracking...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">search</span>
                                    Track Order
                                </>
                            )}
                        </button>
                    </form>

                    {status === "not_found" && (
                        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-xl text-center">
                            <span className="material-symbols-outlined text-3xl text-amber-500 mb-2 block">info</span>
                            <h3 className="font-bold text-amber-800 mb-1">Order Not Found</h3>
                            <p className="text-amber-700 text-sm">We couldn&apos;t find an order with that ID. Please check the ID and try again, or <Link href="/contact" className="underline font-semibold">contact support</Link>.</p>
                        </div>
                    )}

                    <div className="mt-12 p-6 bg-slate-50 rounded-xl border border-slate-200">
                        <h3 className="font-bold mb-3">Where to find your Order ID?</h3>
                        <ul className="text-sm text-slate-600 space-y-2">
                            <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span> Check your order confirmation email</li>
                            <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span> Visit &quot;My Orders&quot; in your account</li>
                            <li className="flex items-start gap-2"><span className="material-symbols-outlined text-primary text-sm mt-0.5">check_circle</span> Check your SMS notifications</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}
