"use client";
import { FadeIn, SectionHeading, ScaleIn } from "./AnimatedSection";
import { Smartphone, Server, Database, Shield, CreditCard, Truck, Radio, Cloud, Bell, Layers, Zap, Code } from "lucide-react";

const stack = [
    { icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />, name: "SwiftUI iOS App", desc: "Native iOS app with SwiftUI", category: "Frontend" },
    { icon: <Code className="w-5 h-5 sm:w-6 sm:h-6" />, name: "React Web App", desc: "Next.js + Tailwind CSS", category: "Frontend" },
    { icon: <Server className="w-5 h-5 sm:w-6 sm:h-6" />, name: "Node.js + Express", desc: "TypeScript backend with 56 routes", category: "Backend" },
    { icon: <Database className="w-5 h-5 sm:w-6 sm:h-6" />, name: "MongoDB", desc: "32 models with fast indexes", category: "Database" },
    { icon: <Shield className="w-5 h-5 sm:w-6 sm:h-6" />, name: "Firebase Auth", desc: "Google, Apple, Phone OTP", category: "Auth" },
    { icon: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />, name: "Razorpay", desc: "UPI, Cards, Net Banking, COD", category: "Payments" },
    { icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6" />, name: "Shiprocket", desc: "Multi-courier with AWB tracking", category: "Logistics" },
    { icon: <Radio className="w-5 h-5 sm:w-6 sm:h-6" />, name: "Kafka Events", desc: "Real-time event processing", category: "Events" },
    { icon: <Cloud className="w-5 h-5 sm:w-6 sm:h-6" />, name: "AWS S3", desc: "Secure cloud media storage", category: "Storage" },
    { icon: <Bell className="w-5 h-5 sm:w-6 sm:h-6" />, name: "FCM Push", desc: "Firebase push notifications", category: "Notifications" },
    { icon: <Layers className="w-5 h-5 sm:w-6 sm:h-6" />, name: "Server-Driven UI", desc: "Dynamic JSON layouts", category: "Platform" },
    { icon: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />, name: "CDN + Edge", desc: "Fast content delivery", category: "Performance" },
];

export default function TechnologyArchitecture() {
    return (
        <section className="py-14 sm:py-20 md:py-28 bg-gradient-to-b from-slate-900 to-slate-950 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FadeIn className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
                    <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/10 text-blue-300 text-[11px] sm:text-sm font-semibold mb-3 sm:mb-4 tracking-wide uppercase border border-white/10">Technology</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">Enterprise-Grade Tech Stack</h2>
                    <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-400">Built with modern, scalable infrastructure trusted by the world&apos;s best platforms.</p>
                </FadeIn>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                    {stack.map((s, i) => (
                        <ScaleIn key={i} delay={i * 0.04}>
                            <div className="bg-white/5 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-white/10 hover:border-white/20 hover:bg-white/10 transition-all h-full">
                                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">{s.icon}</div>
                                    <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">{s.category}</span>
                                </div>
                                <h3 className="text-xs sm:text-sm font-bold text-white mb-0.5 sm:mb-1">{s.name}</h3>
                                <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                            </div>
                        </ScaleIn>
                    ))}
                </div>

                {/* Architecture Overview */}
                <FadeIn>
                    <div className="mt-10 sm:mt-14 bg-white/5 rounded-2xl sm:rounded-3xl border border-white/10 p-5 sm:p-8 md:p-10">
                        <h3 className="text-base sm:text-xl font-bold text-white mb-4 sm:mb-6 text-center">System Architecture</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4 text-center text-[10px] sm:text-xs">
                            {[
                                { label: "iOS & Web", sub: "SwiftUI + Next.js" },
                                { label: "API Gateway", sub: "Express + 56 Routes" },
                                { label: "Database", sub: "MongoDB Atlas" },
                                { label: "Services", sub: "Razorpay · Shiprocket" },
                                { label: "Infra", sub: "AWS · Firebase · Kafka" },
                            ].map((block, i) => (
                                <div key={i} className="bg-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5">
                                    <div className="font-bold text-white text-xs sm:text-sm">{block.label}</div>
                                    <div className="text-slate-400 mt-0.5 sm:mt-1">{block.sub}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
