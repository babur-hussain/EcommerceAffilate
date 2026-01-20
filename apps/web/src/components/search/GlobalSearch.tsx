"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDebounce } from "@/hooks/useDebounce";

const API_BASE = "/api";

type Suggestion = {
    _id: string;
    title: string;
    slug: string;
    price: number;
    image: string;
    brand: string;
    type: "product";
};

export default function GlobalSearch() {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        async function fetchSuggestions() {
            if (!debouncedQuery || debouncedQuery.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            try {
                console.log("Fetching suggestions for:", debouncedQuery);
                const res = await fetch(
                    `${API_BASE}/products/suggestions?query=${encodeURIComponent(debouncedQuery)}`
                );
                if (res.ok) {
                    const data = await res.json();
                    console.log("Received suggestions:", data);
                    setSuggestions(data);
                    setShowDropdown(true);
                } else {
                    console.error("Failed to fetch suggestions:", res.status);
                }
            } catch (error) {
                console.error("Error fetching suggestions:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchSuggestions();
    }, [debouncedQuery]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target as Node)
            ) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = () => {
        if (query.trim()) {
            setShowDropdown(false);
            router.push(`/search?q=${encodeURIComponent(query)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission if input is part of a form
            handleSearch();
        }
    };

    return (
        <div ref={searchRef} className="relative w-full group">
            <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative w-full">
                <div className="relative w-full flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <span className="material-symbols-outlined text-slate-400">
                            search
                        </span>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            if (e.target.value.length >= 2) setShowDropdown(true);
                        }}
                        onKeyDown={handleKeyDown}
                        className="block w-full pl-11 pr-32 py-3 bg-surface-light border-0 rounded-xl text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all shadow-sm"
                        placeholder="Search items..."
                    />

                    <div className="absolute inset-y-1 right-1 flex items-center gap-2">
                        {/* Manual Search Button */}
                        <button
                            type="submit" // Changed to type="submit" to trigger form onSubmit
                            onClick={(e) => { e.preventDefault(); handleSearch(); }} // Keep onClick for direct trigger, prevent default to avoid double submission
                            className="bg-primary hover:bg-primary/90 text-white p-2 rounded-lg flex items-center justify-center transition-colors shadow-sm"
                            title="Search"
                        >
                            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </form>

            {/* Dropdown Results */}
            {showDropdown && debouncedQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                    {loading ? (
                        <div className="p-4 text-center text-slate-400 text-sm">
                            Loading...
                        </div>
                    ) : suggestions.length > 0 ? (
                        <div className="py-2">
                            <h3 className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Products
                            </h3>
                            {suggestions.map((item) => (
                                <Link
                                    key={item._id}
                                    href={`/product/${item._id}`}
                                    onClick={() => setShowDropdown(false)}
                                    className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50 transition-colors"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-sm font-medium text-slate-900 truncate">
                                            {item.title}
                                        </span>
                                        <span className="text-xs text-slate-500 truncate">
                                            {item.brand}
                                        </span>
                                    </div>
                                    <span className="text-sm font-bold text-primary whitespace-nowrap">
                                        ₹{item.price}
                                    </span>
                                </Link>
                            ))}
                            <div className="border-t border-slate-100 mt-2 pt-2">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleSearch();
                                    }}
                                    className="w-full px-4 py-2 text-sm text-primary font-bold hover:bg-slate-50 text-left flex items-center gap-2"
                                >
                                    See all results for "{query}"
                                    <span className="material-symbols-outlined text-[16px]">
                                        arrow_forward
                                    </span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-slate-400 text-sm">
                            No results found for "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
