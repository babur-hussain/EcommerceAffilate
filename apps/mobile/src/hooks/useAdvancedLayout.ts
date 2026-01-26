import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

export interface AdvancedLayout {
    slug: string;
    name: string;
    isActive: boolean;
    components: any[];
}

export function useAdvancedLayout(slug: string) {
    const [layout, setLayout] = useState<AdvancedLayout | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchLayout = useCallback(async () => {
        if (!slug) return;

        try {
            setLoading(true);
            setError(null);

            // Fetch from new advanced-layout endpoint
            const response = await api.get(`/api/advanced-layout/${slug}`);

            if (response.data) {
                setLayout(response.data);
            } else {
                setError('Layout data is empty');
            }
        } catch (err: any) {
            console.error(`Failed to fetch advanced layout for ${slug}:`, err);
            setError(err.message || 'Failed to load layout');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchLayout();
    }, [fetchLayout]);

    return { layout, loading, error, refresh: fetchLayout };
}
