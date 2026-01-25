import { useState, useEffect } from "react";

interface Product {
    _id: string;
    title: string;
    price: number;
    image: string;
    images: string[];
    category: string;
    rating?: number;
    reviewCount?: number;
    offers?: any[];
}

interface UseProductsParams {
    category?: string;
    limit?: number;
}

export function useProducts({ category, limit = 10 }: UseProductsParams) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProducts() {
            try {
                setLoading(true);
                const params = new URLSearchParams();
                if (category) params.append("category", category);
                if (limit) params.append("limit", limit.toString());

                // Use the public API path
                const res = await fetch(`/api/products?${params.toString()}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch products");
                }
                const data = await res.json();
                // Handle different response structures if necessary (e.g. data.products vs data)
                setProducts(Array.isArray(data) ? data : data.products || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, [category, limit]);

    return { products, loading, error };
}
