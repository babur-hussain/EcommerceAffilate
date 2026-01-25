'use client';

import Link from 'next/link';
import { Suspense } from 'react';

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic';

function NotFoundContent() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[#f6f8f8] px-4">
            <div className="w-full max-w-lg text-center space-y-8">

                {/* Illustration Area */}
                <div className="relative size-64 mx-auto mb-8">
                    <div className="absolute inset-0 bg-linear-to-tr from-[#2c7b7d]/5 to-[#22a8c3]/10 rounded-full animate-pulse"></div>
                    <div className="absolute inset-4 bg-white rounded-full shadow-lg flex items-center justify-center overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <span className="material-symbols-outlined text-9xl text-[#2c7b7d]">search_off</span>
                        </div>
                        <div className="relative z-10 text-[#2c7b7d] flex flex-col items-center">
                            <span className="material-symbols-outlined text-8xl mb-2">sentiment_dissatisfied</span>
                            <span className="text-6xl font-black opacity-20 absolute -bottom-12 scale-150">404</span>
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-black text-[#141e1e] tracking-tight">
                        Page Not Found
                    </h1>
                    <p className="text-neutral-500 text-lg md:text-xl font-medium max-w-sm mx-auto leading-relaxed">
                        Oops! The page you are looking for has vanished into thin air.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    <Link
                        href="/"
                        className="px-8 py-3.5 bg-[#22a8c3] text-white font-bold rounded-xl shadow-[0_4px_14px_0_rgba(34,168,195,0.39)] hover:shadow-[0_6px_20px_rgba(34,168,195,0.23)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">home</span>
                        Go Home
                    </Link>
                    <Link
                        href="/search"
                        className="px-8 py-3.5 bg-white text-[#538893] border border-[#e8f0f2] font-bold rounded-xl hover:bg-[#f6f8f8] hover:text-[#2c7b7d] transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">search</span>
                        Search Items
                    </Link>
                </div>

                {/* Support Link */}
                <div className="pt-8">
                    <Link href="/contact" className="text-sm font-bold text-[#538893] hover:text-[#22a8c3] transition-colors">
                        Need help? Contact Support
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function NotFound() {
    return (
        <Suspense fallback={
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#22a8c3]"></div>
            </div>
        }>
            <NotFoundContent />
        </Suspense>
    );
}
