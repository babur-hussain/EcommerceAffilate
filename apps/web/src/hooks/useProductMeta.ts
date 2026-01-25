import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api';

interface ProductMeta {
    price: {
        min: number;
        max: number;
    };
    brands: {
        name: string;
        count: number;
    }[];
    totalProducts: number;
}

export function useProductMeta() {
    const searchParams = useSearchParams();
    const [meta, setMeta] = useState<ProductMeta | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMeta() {
            setLoading(true);
            try {
                const params = new URLSearchParams(searchParams.toString());
                const res = await fetch(`${API_BASE}/products/meta?${params.toString()}`);
                if (res.ok) {
                    const data = await res.json();
                    setMeta(data);
                }
            } catch (error) {
                console.error("Failed to fetch product meta:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchMeta();
    }, [searchParams.toString()]); // Depend on stringified params to avoid stable object issues

    return { meta, loading };
}
