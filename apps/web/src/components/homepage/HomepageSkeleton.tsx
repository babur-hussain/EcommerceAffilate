"use client";

export default function HomepageSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Category Bar Skeleton */}
            <div className="bg-white border-b border-slate-100 px-4 py-4">
                <div className="max-w-[1440px] mx-auto flex gap-6 overflow-hidden">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                            <div className="w-16 h-16 rounded-2xl bg-slate-100" />
                            <div className="w-16 h-3 bg-slate-100 rounded" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Hero Banner Skeleton */}
            <div className="px-2 sm:px-3 md:px-6 py-2">
                <div className="max-w-[1440px] mx-auto h-[200px] md:h-[300px] bg-slate-100 rounded-xl" />
            </div>

            {/* Section Skeletons */}
            {[...Array(3)].map((_, sectionIndex) => (
                <div key={sectionIndex} className="mb-3 px-0 sm:px-3 md:px-6">
                    <div className="max-w-[1440px] mx-auto bg-white rounded-none sm:rounded-xl overflow-hidden">
                        {/* Header */}
                        <div className="bg-slate-200 h-14 sm:h-16" />

                        {/* Products */}
                        <div className="px-4 py-5">
                            <div className="w-32 h-4 bg-slate-100 rounded mb-4" />
                            <div className="flex gap-4 overflow-hidden">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="w-[190px] shrink-0">
                                        <div className="bg-slate-50 rounded-xl overflow-hidden">
                                            <div className="aspect-square bg-slate-100" />
                                            <div className="p-3 space-y-2">
                                                <div className="h-3 bg-slate-100 rounded w-3/4" />
                                                <div className="h-3 bg-slate-100 rounded w-1/2" />
                                                <div className="h-4 bg-slate-100 rounded w-1/3" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
