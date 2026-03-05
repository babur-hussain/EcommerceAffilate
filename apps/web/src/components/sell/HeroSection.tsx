"use client";
import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Users, Store, Zap } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
            {/* Gradient orbs - smaller on mobile */}
            <div className="absolute top-10 left-0 w-48 md:w-96 h-48 md:h-96 bg-blue-500/20 rounded-full blur-[80px] md:blur-[120px]" />
            <div className="absolute bottom-10 right-0 w-40 md:w-80 h-40 md:h-80 bg-indigo-500/20 rounded-full blur-[60px] md:blur-[100px]" />

            <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-16 pb-14 sm:pt-20 sm:pb-18 md:pt-32 md:pb-28 safe-area-top">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left Content */}
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/10 border border-white/10 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6 backdrop-blur-sm">
                            <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                            <span className="text-xs sm:text-sm font-medium text-blue-200">India&apos;s First Influencer-Powered Marketplace</span>
                        </div>

                        <h1 className="text-[2.25rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight md:leading-[1.05]">
                            Sell More.{" "}
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                                Pay Less.
                            </span>
                            <br />
                            <span className="text-white/90">Grow Faster.</span>
                        </h1>

                        <p className="mt-4 sm:mt-6 text-[15px] sm:text-lg md:text-xl text-blue-100/80 leading-relaxed max-w-xl">
                            Join Local For Vocal — the marketplace where sellers keep <strong className="text-white">up to 95%</strong> of every sale, get free influencer-powered marketing, and reach millions of customers nationwide.
                        </p>

                        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <motion.a
                                href="#register"
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 active:from-blue-600 active:to-indigo-600 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg shadow-lg shadow-blue-500/25 transition-all"
                            >
                                Start Selling Today <ArrowRight className="w-5 h-5" />
                            </motion.a>
                            <a
                                href="#how-it-works"
                                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 active:bg-white/20 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg transition-all backdrop-blur-sm"
                            >
                                How It Works
                            </a>
                        </div>

                        <div className="mt-6 sm:mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-6 text-xs sm:text-sm text-blue-200/70">
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full" /> Free Registration</span>
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full" /> No Monthly Fees</span>
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full" /> Daily Payouts</span>
                        </div>
                    </motion.div>

                    {/* Right Stats Cards - Desktop */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="hidden lg:block"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: <TrendingUp className="w-6 h-6" />, value: "2-5%", label: "Platform Commission", color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20" },
                                { icon: <Users className="w-6 h-6" />, value: "10,000+", label: "Active Influencers", color: "from-blue-500/20 to-blue-500/5 border-blue-500/20" },
                                { icon: <Store className="w-6 h-6" />, value: "₹0", label: "Listing Fees", color: "from-amber-500/20 to-amber-500/5 border-amber-500/20" },
                                { icon: <Zap className="w-6 h-6" />, value: "24hrs", label: "Fast Settlement", color: "from-purple-500/20 to-purple-500/5 border-purple-500/20" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + i * 0.1 }}
                                    className={`bg-gradient-to-br ${stat.color} backdrop-blur-xl border rounded-2xl p-6`}
                                >
                                    <div className="text-white/70 mb-3">{stat.icon}</div>
                                    <div className="text-3xl font-extrabold text-white">{stat.value}</div>
                                    <div className="text-sm text-blue-200/60 mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Mobile Stats Row — larger touch targets, swipeable horizontal scroll */}
                <div className="lg:hidden mt-6 sm:mt-10 grid grid-cols-4 gap-2 sm:gap-3">
                    {[
                        { value: "2-5%", label: "Commission", color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20" },
                        { value: "₹0", label: "Listing Fees", color: "from-amber-500/20 to-amber-500/5 border-amber-500/20" },
                        { value: "10K+", label: "Influencers", color: "from-blue-500/20 to-blue-500/5 border-blue-500/20" },
                        { value: "24hrs", label: "Payouts", color: "from-purple-500/20 to-purple-500/5 border-purple-500/20" },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.08 }} className={`bg-gradient-to-br ${s.color} backdrop-blur border rounded-xl p-3 sm:p-4 text-center`}>
                            <div className="text-lg sm:text-2xl font-extrabold text-white">{s.value}</div>
                            <div className="text-[10px] sm:text-xs text-blue-200/60 mt-0.5">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
