import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useProductMeta } from "@/hooks/useProductMeta";

export default function FilterSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { meta, loading } = useProductMeta();

    // Local state for UI responsiveness (debounce price slider)
    const [priceRange, setPriceRange] = useState([0, 1000]);

    // Sync local state with URL params on load
    useEffect(() => {
        const min = Number(searchParams.get("minPrice")) || 0;
        const max = Number(searchParams.get("maxPrice")) || 1000;
        setPriceRange([min, max]);
    }, [searchParams]);

    // Helper to update URL params
    const updateFilter = (key: string, value: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value === null) {
            params.delete(key);
        } else {
            params.set(key, value);
        }
        router.push(`?${params.toString()}`);
    };

    const toggleBrand = (brand: string) => {
        const currentBrand = searchParams.get("brand");
        if (currentBrand === brand) {
            updateFilter("brand", null); // Deselect
        } else {
            updateFilter("brand", brand); // Select (single select for now, could be multi)
        }
    };

    const applyPriceFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("minPrice", priceRange[0].toString());
        params.set("maxPrice", priceRange[1].toString());
        router.push(`?${params.toString()}`);
    };

    const clearAll = () => {
        router.push(window.location.pathname); // Clear all query params
    };

    if (loading && !meta) {
        return (
            <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24 h-fit animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/3"></div>
                <div className="space-y-3">
                    <div className="h-4 bg-slate-100 rounded w-1/4"></div>
                    <div className="h-20 bg-slate-50 rounded-xl"></div>
                </div>
            </aside>
        );
    }

    return (
        <aside className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-24 h-fit">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                    <span className="material-symbols-outlined text-primary">tune</span>
                    Filters
                </h2>
                <button
                    onClick={clearAll}
                    className="text-sm text-primary font-semibold hover:underline"
                >
                    Clear All
                </button>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                    Price Range
                </h3>
                <div className="px-2">
                    <input
                        type="range"
                        min={meta?.price.min || 0}
                        max={meta?.price.max || 1000}
                        step="10"
                        className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        onMouseUp={applyPriceFilter} // Apply on release
                        onTouchEnd={applyPriceFilter}
                    />
                    <div className="flex justify-between mt-3">
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-xs text-slate-400">
                                ₹
                            </span>
                            <input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                onBlur={applyPriceFilter} // Apply on blur
                                className="w-20 pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-xs text-slate-400">
                                ₹
                            </span>
                            <input
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                onBlur={applyPriceFilter}
                                className="w-20 pl-6 pr-2 py-1.5 border border-slate-200 rounded-lg text-sm bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Brands */}
            <div className="space-y-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                    Brand
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    {meta?.brands.length === 0 && (
                        <p className="text-sm text-slate-400 italic">No brands found</p>
                    )}
                    {meta?.brands.map((brand) => (
                        <label key={brand.name} className="flex items-center justify-between cursor-pointer group">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="w-5 h-5 rounded border-slate-200 text-primary focus:ring-primary"
                                    checked={searchParams.get("brand") === brand.name}
                                    onChange={() => toggleBrand(brand.name)}
                                />
                                <span className="text-sm font-medium text-slate-600 group-hover:text-primary transition-colors line-clamp-1">
                                    {brand.name}
                                </span>
                            </div>
                            <span className="text-xs bg-slate-50 text-slate-400 px-2 py-0.5 rounded-full font-bold">
                                {brand.count}
                            </span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Delivery Speed (Static for now as it needs backend logic) */}
            <div className="space-y-3">
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-400">
                    Delivery Speed
                </h3>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-green-50 border border-green-100/50 hover:border-green-200 transition-all">
                    <input
                        type="checkbox"
                        disabled
                        className="w-5 h-5 rounded border-green-500 text-green-600 focus:ring-green-500 focus:ring-offset-0 opacity-50"
                    />
                    <div className="flex flex-col opacity-50">
                        <span className="text-sm font-bold flex items-center gap-1 text-green-700">
                            <span className="material-symbols-outlined text-lg">bolt</span>
                            Express Delivery
                        </span>
                        <span className="text-[10px] text-green-600/80 font-medium leading-none">
                            Coming Soon
                        </span>
                    </div>
                </label>
            </div>
        </aside>
    );
}
