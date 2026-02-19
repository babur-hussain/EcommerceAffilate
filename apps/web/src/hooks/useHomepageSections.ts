import { useState, useEffect } from "react";

export interface HomepageProduct {
    _id: string;
    title: string;
    slug: string;
    price: number;
    mrp?: number;
    image: string;
    images?: string[];
    primaryImage?: string;
    rating?: number;
    ratingCount?: number;
    brand?: string;
    category?: string;
}

export interface HomepageSubcategory {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string;
    products: HomepageProduct[];
}

export interface HomepageGroup {
    groupName: string;
    subcategories: HomepageSubcategory[];
}

export interface HomepageSection {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    icon?: string;
    groups: HomepageGroup[];
}

export function useHomepageSections() {
    const [sections, setSections] = useState<HomepageSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSections() {
            try {
                setLoading(true);
                const res = await fetch("/api/homepage/sections");
                if (!res.ok) throw new Error("Failed to fetch homepage sections");
                const data = await res.json();
                setSections(Array.isArray(data) ? data : []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchSections();
    }, []);

    return { sections, loading, error };
}
