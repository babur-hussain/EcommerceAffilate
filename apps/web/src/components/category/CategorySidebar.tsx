"use client";

import { useEffect, useState, useMemo } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

interface SubCategory {
    _id: string;
    name: string;
    slug: string;
    group?: string;
}

interface CategorySidebarProps {
    parentCategoryId: string;
    onFilterChange?: (filters: {
        subcategories: string[];
        priceRange: [number, number];
        delivery: string;
    }) => void;
}

export default function CategorySidebar({ parentCategoryId, onFilterChange }: CategorySidebarProps) {
    const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
    const [selectedDelivery, setSelectedDelivery] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function fetchSubcategories() {
            try {
                const res = await fetch(`${API_BASE}/categories?parentCategory=${parentCategoryId}`);
                if (res.ok) {
                    const data = await res.json();
                    setSubcategories(data);
                    // Expand first group by default
                    const groupNames = data.map((s: SubCategory) => s.group || "Other");
                    const uniqueGroups = Array.from(new Set<string>(groupNames)) as string[];
                    if (uniqueGroups.length > 0) {
                        setExpandedGroups(new Set<string>([uniqueGroups[0]]));
                    }
                }
            } catch (error) {
                console.error("Error fetching subcategories:", error);
            } finally {
                setLoading(false);
            }
        }
        if (parentCategoryId) {
            fetchSubcategories();
        }
    }, [parentCategoryId]);

    // Group subcategories by their group field
    const groupedSubcategories = useMemo(() => {
        const groups: Record<string, SubCategory[]> = {};
        subcategories.forEach((sub) => {
            const groupName = sub.group || "Other";
            if (!groups[groupName]) {
                groups[groupName] = [];
            }
            groups[groupName].push(sub);
        });
        return groups;
    }, [subcategories]);

    const handleSubcategoryToggle = (id: string) => {
        const newSelected = selectedSubcategories.includes(id)
            ? selectedSubcategories.filter(s => s !== id)
            : [...selectedSubcategories, id];
        setSelectedSubcategories(newSelected);
        onFilterChange?.({ subcategories: newSelected, priceRange, delivery: selectedDelivery });
    };

    const handleDeliveryChange = (value: string) => {
        setSelectedDelivery(value);
        onFilterChange?.({ subcategories: selectedSubcategories, priceRange, delivery: value });
    };

    const toggleGroup = (groupName: string) => {
        const newExpanded = new Set(expandedGroups);
        if (newExpanded.has(groupName)) {
            newExpanded.delete(groupName);
        } else {
            newExpanded.add(groupName);
        }
        setExpandedGroups(newExpanded);
    };

    return (
        <aside className="w-64 hidden lg:flex flex-col gap-8 shrink-0">
            {/* Header */}
            <div className="flex flex-col gap-2 border-b border-slate-100 pb-6">
                <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Refine Collection</p>
            </div>

            <div className="flex flex-col gap-6 max-h-[60vh] overflow-y-auto scrollbar-hide">
                {/* Subcategories by Group */}
                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i}>
                                <div className="h-5 w-24 bg-slate-100 rounded animate-pulse mb-3" />
                                <div className="flex flex-col gap-2 pl-2">
                                    {[...Array(3)].map((_, j) => (
                                        <div key={j} className="flex items-center gap-3">
                                            <div className="size-5 rounded bg-slate-100 animate-pulse" />
                                            <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : Object.keys(groupedSubcategories).length > 0 ? (
                    Object.entries(groupedSubcategories).map(([groupName, subs]) => (
                        <div key={groupName} className="border-b border-slate-100 pb-4 last:border-0">
                            <button
                                onClick={() => toggleGroup(groupName)}
                                className="flex items-center justify-between w-full text-sm font-bold text-slate-900 mb-3 hover:text-primary transition-colors"
                            >
                                <span>{groupName}</span>
                                <span className="material-symbols-outlined text-sm text-slate-400">
                                    {expandedGroups.has(groupName) ? "expand_less" : "expand_more"}
                                </span>
                            </button>
                            {expandedGroups.has(groupName) && (
                                <div className="flex flex-col gap-2 pl-1">
                                    {subs.map((sub) => (
                                        <label key={sub._id} className="flex items-center gap-3 text-sm cursor-pointer group">
                                            <div
                                                onClick={() => handleSubcategoryToggle(sub._id)}
                                                className={`size-4 rounded border flex items-center justify-center transition-colors ${selectedSubcategories.includes(sub._id)
                                                    ? "bg-primary border-primary"
                                                    : "border-slate-300 group-hover:border-primary"
                                                    }`}
                                            >
                                                {selectedSubcategories.includes(sub._id) && (
                                                    <span className="material-symbols-outlined text-white text-[12px]">check</span>
                                                )}
                                            </div>
                                            <span className={`text-xs ${selectedSubcategories.includes(sub._id) ? "font-medium text-primary" : "text-slate-600"}`}>
                                                {sub.name}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-400">No subcategories</p>
                )}

                {/* Price Range */}
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Price Range</h4>
                    <div className="h-1 bg-slate-200 rounded-full relative mb-4">
                        <div
                            className="absolute inset-y-0 bg-primary rounded-full"
                            style={{ left: `${(priceRange[0] / 10000) * 100}%`, right: `${100 - (priceRange[1] / 10000) * 100}%` }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 font-medium">
                        <span>₹{priceRange[0]}</span>
                        <span>₹{priceRange[1]}+</span>
                    </div>
                </div>

                {/* Delivery Speed */}
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Delivery Speed</h4>
                    <div className="flex flex-wrap gap-2">
                        {["all", "same-day", "tomorrow", "2-3 days"].map((delivery) => (
                            <button
                                key={delivery}
                                onClick={() => handleDeliveryChange(delivery)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${selectedDelivery === delivery
                                    ? "bg-primary text-white"
                                    : "border border-slate-200 hover:border-primary text-slate-600"
                                    }`}
                            >
                                {delivery === "all" ? "All" : delivery === "same-day" ? "Same Day" : delivery === "tomorrow" ? "Tomorrow" : "2-3 Days"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Rating */}
                <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-4">Customer Rating</h4>
                    <div className="flex flex-col gap-2">
                        {[4, 3, 2].map((rating) => (
                            <div key={rating} className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                <div className="flex text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <span
                                            key={i}
                                            className="material-symbols-outlined text-[18px]"
                                            style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
                                        >
                                            star
                                        </span>
                                    ))}
                                </div>
                                <span className="text-xs text-slate-500">& Up</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Promo Card */}
            <div className="mt-auto pt-10">
                <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
                    <span className="material-symbols-outlined text-primary mb-2">local_shipping</span>
                    <p className="text-sm font-bold text-slate-900 mb-1">Free Delivery</p>
                    <p className="text-xs text-slate-600 leading-relaxed">Free delivery on orders above ₹499</p>
                </div>
            </div>
        </aside>
    );
}
