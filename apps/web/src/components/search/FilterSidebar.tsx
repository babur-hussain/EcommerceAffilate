"use client";

import { useState } from "react";

export default function FilterSidebar() {
    const [priceRange, setPriceRange] = useState([50, 450]);

    return (
        <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24 h-fit">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                    <span className="material-symbols-outlined text-primary">tune</span>
                    Filters
                </h2>
                <button className="text-sm text-primary font-semibold hover:underline">
                    Clear All
                </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                    Category
                </h3>
                <div className="space-y-2">
                    <label className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">
                            Parkas
                        </span>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-600">
                            120
                        </span>
                    </label>
                    <label className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm font-medium group-hover:text-primary transition-colors text-primary underline underline-offset-4">
                            Trench Coats
                        </span>
                        <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full font-bold">
                            45
                        </span>
                    </label>
                    <label className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">
                            Puffers
                        </span>
                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-full font-bold text-slate-600">
                            88
                        </span>
                    </label>
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                    Price Range
                </h3>
                <div className="px-2">
                    <input
                        type="range"
                        min="0"
                        max="1000"
                        step="10"
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    />
                    <div className="flex justify-between mt-3">
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-xs text-slate-400">
                                $
                            </span>
                            <input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="w-20 pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-xs text-slate-400">
                                $
                            </span>
                            <input
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="w-20 pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery Speed */}
            <div className="space-y-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                    Delivery Speed
                </h3>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-green-50 border border-green-100/50 hover:border-green-200 transition-all">
                    <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5 rounded border-green-500 text-green-600 focus:ring-green-500 focus:ring-offset-0"
                    />
                    <div className="flex flex-col">
                        <span className="text-sm font-bold flex items-center gap-1 text-green-700">
                            <span className="material-symbols-outlined text-lg">bolt</span>
                            Express Delivery
                        </span>
                        <span className="text-[10px] text-green-600/80 font-medium leading-none">
                            Next-day available
                        </span>
                    </div>
                </label>
            </div>

            {/* Brands */}
            <div className="space-y-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                    Brand
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {["Arc'teryx", "The North Face", "Moncler", "Canada Goose", "Patagonia", "Zara"].map((brand) => (
                        <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                            <input
                                type="checkbox"
                                className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary"
                                defaultChecked={brand === "The North Face"}
                            />
                            <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors">
                                {brand}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                    Minimum Rating
                </h3>
                <div className="space-y-1">
                    <button className="flex items-center gap-2 w-full p-2 hover:bg-slate-50 rounded-lg transition-all group">
                        <div className="flex text-[#F5CE22]">
                            {[1, 2, 3, 4].map((i) => (
                                <span key={i} className="material-symbols-outlined text-xl filled-star">star</span>
                            ))}
                            <span className="material-symbols-outlined text-xl">star</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400 group-hover:text-primary">
                            & Up
                        </span>
                    </button>
                </div>
            </div>
        </aside>
    );
}
