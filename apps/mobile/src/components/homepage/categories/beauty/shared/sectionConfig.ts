// Central configuration for all beauty section pages
import { SectionConfig } from './types';

export const SECTIONS: Record<string, SectionConfig> = {
    // ============================================================
    // PAGE: TRENDING BRANDS
    // Layout: Grid
    // ============================================================
    TRENDING_BRANDS: {
        id: 'trending-brands',
        title: 'Trending Brands',
        subtitle: 'Top beauty picks everyone is loving',
        variant: 'standard',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1612817288484-9691c9567225?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FFF0F5', // Lavender Blush
            headerTextColor: '#880E4F',
            subtitleColor: '#AD1457',
        },
    },

    // ============================================================
    // PAGE: LAUNCH PARTY
    // Layout: Grid (could be showcase later)
    // ============================================================
    LAUNCH_PARTY: {
        id: 'launch-party',
        title: 'The Launch Party',
        subtitle: 'Fresh drops just for you',
        variant: 'standard',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FFF3E0', // Light Orange
            headerTextColor: '#E65100',
            subtitleColor: '#F57C00',
        },
    },

    // ============================================================
    // PAGE: K-BEAUTY
    // Layout: Grid
    // ============================================================
    K_BEAUTY: {
        id: 'k-beauty',
        title: 'K-Beauty Obsessed',
        subtitle: 'Glass skin goals & more',
        variant: 'standard',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FAFAFA', // White/Light
            headerTextColor: '#000000',
            subtitleColor: '#757575',
        },
    },
};

// Helper to get section by ID
export const getSectionById = (id: string): SectionConfig | undefined => {
    return Object.values(SECTIONS).find(section => section.id === id);
};
