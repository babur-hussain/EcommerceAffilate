"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import { ReactNode } from "react";

export function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children as any}
        </motion.div>
    );
}

export function ScaleIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children as any}
        </motion.div>
    );
}

export function SlideInLeft({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children as any}
        </motion.div>
    );
}

export function SlideInRight({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            className={className}
        >
            {children as any}
        </motion.div>
    );
}

export function SectionHeading({ badge, title, subtitle }: { badge?: string; title: string; subtitle?: string }) {
    return (
        <FadeIn className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
            <>
                {badge && (
                    <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-[11px] sm:text-sm font-semibold mb-3 sm:mb-4 tracking-wide uppercase border border-blue-100">
                        {badge}
                    </span>
                )}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {title}
                </h2>
                {subtitle && (
                    <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-500 leading-relaxed">{subtitle}</p>
                )}
            </>
        </FadeIn>
    );
}

export function StatCard({ value, label, icon }: { value: string; label: string; icon?: ReactNode }) {
    return (
        <ScaleIn className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center hover:shadow-lg transition-shadow">
            <>
                {icon && <div className="mb-3 flex justify-center text-blue-600">{icon as any}</div>}
                <div className="text-3xl md:text-4xl font-extrabold text-slate-900">{value}</div>
                <div className="text-sm text-slate-500 mt-1 font-medium">{label}</div>
            </>
        </ScaleIn>
    );
}
