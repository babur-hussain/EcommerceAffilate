// Home & Kitchen section configuration
import { SectionConfig } from '../shared/types';

export const SECTIONS: Record<string, SectionConfig> = {
    // ============================================================
    // PAGE: KITCHEN BESTSELLERS
    // Layout: Grid with Deal Badges
    // ============================================================
    KITCHEN_BESTSELLERS: {
        id: 'kitchen-bestsellers',
        title: 'Kitchen Bestsellers',
        subtitle: 'Top rated essentials for your kitchen',
        variant: 'deal-badge',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=1000',
        theme: {
            backgroundColor: '#FFF7ED', // Orange tint
            headerTextColor: '#9A3412',
            subtitleColor: '#EA580C',
        },
        filters: { category: 'Kitchen' },
    },
    // ============================================================
    // PAGE: HOME DECOR TRENDS
    // Layout: Masonry or Grid
    // ============================================================
    HOME_DECOR_TRENDS: {
        id: 'home-decor-trends',
        title: 'Home Decor Trends',
        subtitle: 'Stylize your living space',
        variant: 'standard',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=1000',
        theme: {
            backgroundColor: '#F3F4F6',
            headerTextColor: '#111827',
            subtitleColor: '#6B7280',
        },
        filters: { category: 'Decor' }, // Placeholder filter
    },
    // ============================================================
    // PAGE: TOP BRANDS
    // Layout: List
    // ============================================================
    TOP_BRANDS: {
        id: 'top-brands',
        title: 'Top Home Brands',
        subtitle: 'Quality you can trust',
        variant: 'standard',
        layout: 'list',
        bannerImage: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1000',
        theme: {
            backgroundColor: '#FFFFFF',
            headerTextColor: '#000000',
            subtitleColor: '#4B5563',
        },
        filters: { isBrand: true },
    },
    // ============================================================
    // PAGE: FURNISHING DEALS
    // Layout: Grid
    // ============================================================
    FURNISHING_DEALS: {
        id: 'furnishing-deals',
        title: 'Furnishing Deals',
        subtitle: 'Soft furnishings at soft prices',
        variant: 'budget-overlay',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?auto=format&fit=crop&q=80&w=1000',
        theme: {
            backgroundColor: '#ECFDF5', // Green tint
            headerTextColor: '#065F46',
            subtitleColor: '#059669',
        },
        filters: { discount: 'min30' },
    },
};

// Helper to get section by ID
export const getSectionById = (id: string): SectionConfig | undefined => {
    return Object.values(SECTIONS).find(section => section.id === id);
};
