"use client";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";

export default function CallToAction() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-14 sm:py-20 md:py-28" id="register">
            {/* Background decoration */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
            <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-[80px] hidden sm:block" />
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-purple-400/20 rounded-full blur-[60px] hidden sm:block" />

            <div className="relative max-w-4xl mx-auto px-5 sm:px-6 lg:px-8 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
                    <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white/15 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 mb-4 sm:mb-6 backdrop-blur-sm border border-white/20">
                        <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" />
                        <span className="text-xs sm:text-sm font-semibold text-white/90">Join 10,000+ Sellers Growing</span>
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
                        Start Selling Today.
                        <br />
                        <span className="text-blue-200">Keep More of Every Sale.</span>
                    </h2>

                    <p className="mt-4 sm:mt-6 text-sm sm:text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed">
                        Zero listing fees. 2-5% commission. Free influencer marketing. Daily payouts.
                    </p>

                    <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <motion.a
                            href="/business/register"
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 bg-white active:bg-slate-50 text-blue-700 font-bold px-8 sm:px-10 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg shadow-xl shadow-black/20 transition-all w-full sm:w-auto justify-center"
                        >
                            Register as Seller <ArrowRight className="w-5 h-5" />
                        </motion.a>
                        <a href="#faq" className="inline-flex items-center gap-2 border-2 border-white/30 active:border-white/50 text-white font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg transition-all backdrop-blur-sm w-full sm:w-auto justify-center">
                            Have Questions?
                        </a>
                    </div>

                    <div className="mt-6 sm:mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:gap-6 text-xs sm:text-sm text-blue-100/60">
                        {["Free Registration", "No Monthly Fees", "24hr Approval", "Daily Payouts", "Nationwide Shipping"].map((item, i) => (
                            <span key={i} className="flex items-center gap-1">
                                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400 fill-amber-400" /> {item}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
