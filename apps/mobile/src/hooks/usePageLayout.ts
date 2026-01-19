import { useState, useEffect } from 'react';
import api from '../lib/api';

export interface Section {
    id: string;
    type: string;
    title?: string;
    subtitle?: string;
    priority: number;
    content: any;
    style?: any;
}

export interface PageLayout {
    pageSlug: string;
    name: string;
    isActive: boolean;
    sections: Section[];
}

// Fallback for Home if API fails
const DEFAULT_HOME_LAYOUT: PageLayout = {
    pageSlug: 'home',
    name: 'Default Home',
    isActive: true,
    sections: [
        {
            id: 'hero_default',
            type: 'hero_carousel',
            priority: 10,
            content: {
                banners: [
                    { imageUrl: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/sale' },
                    { imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80', actionUrl: '/category/fashion' }
                ]
            }
        },
        {
            id: 'trending_default',
            type: 'product_list_horizontal',
            title: 'Trending near you',
            priority: 20,
            content: { dataSource: { endpoint: '/api/products', params: { sort: 'most_viewed' } } }
        }
    ]
};

export function usePageLayout(pageSlug: string = 'home') {
    const [layout, setLayout] = useState<PageLayout | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchLayout();
    }, [pageSlug]);

    const fetchLayout = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/layout/${pageSlug}`);

            if (response.data && response.data.sections && response.data.sections.length > 0) {
                setLayout(response.data);
            } else {
                if (pageSlug === 'home') setLayout(DEFAULT_HOME_LAYOUT);
            }
            setError(null);
        } catch (err) {
            console.error(`Failed to fetch layout for ${pageSlug}:`, err);
            if (pageSlug === 'home') {
                setLayout(DEFAULT_HOME_LAYOUT);
            }
            setError('Failed to load layout');
        } finally {
            setLoading(false);
        }
    };

    const getSection = (sectionId: string) => {
        return layout?.sections.find(s => s.id === sectionId);
    };

    return { layout, loading, error, refresh: fetchLayout, getSection };
}
