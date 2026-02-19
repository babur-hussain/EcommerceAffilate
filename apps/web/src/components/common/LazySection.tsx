'use client';

import { useRef, useState, useEffect, ReactNode } from 'react';

interface LazySectionProps {
    children: ReactNode;
    /** If true, renders children immediately (for above-fold content) */
    priority?: boolean;
    /** Skeleton height while loading. Default: 320px */
    height?: number;
    /** How far before viewport to trigger loading. Default: 300px */
    rootMargin?: string;
}

export default function LazySection({
    children,
    priority = false,
    height = 320,
    rootMargin = '300px 0px',
}: LazySectionProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(priority);

    useEffect(() => {
        if (priority || isVisible) return;

        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [priority, isVisible, rootMargin]);

    if (isVisible) {
        return <>{children}</>;
    }

    return (
        <div ref={ref} style={{ minHeight: height }}>
            <div className="animate-pulse bg-slate-100">
                <div className="max-w-[1440px] mx-auto">
                    <div className="bg-white shadow-sm overflow-hidden">
                        {/* Title skeleton */}
                        <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-3">
                            <div className="h-6 w-48 bg-slate-200 rounded" />
                            <div className="h-4 w-16 bg-slate-200 rounded" />
                        </div>
                        {/* Products skeleton */}
                        <div className="flex gap-3 sm:gap-4 px-4 sm:px-5 pb-4 overflow-hidden">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="w-[160px] sm:w-[180px] shrink-0">
                                    <div className="aspect-square bg-slate-200 rounded-xl mb-2" />
                                    <div className="h-3 w-3/4 bg-slate-200 rounded mb-1" />
                                    <div className="h-4 w-1/2 bg-slate-200 rounded" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
