// Furniture section configuration
import { SectionConfig } from '../shared/types';

export const SECTIONS: Record<string, SectionConfig> = {
    // ============================================================
    // PAGE: DEAL OF THE DAY
    // Layout: List View
    // Theme: Red / Urgent (Reusing structure from Fashion but for Furniture)
    // ============================================================
    DEAL_OF_THE_DAY: {
        id: 'deal-of-the-day',
        title: 'Deal of the Day',
        subtitle: 'Unbeatable prices on furniture',
        variant: 'standard',
        layout: 'list',
        bannerImage: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FEF2F2',
            headerTextColor: '#991B1B',
            subtitleColor: '#EF4444',
        },
        filters: { category: 'Furniture' }, // Ensure this matches backend category name
    },
    // ============================================================
    // PAGE: TOP BRANDS
    // Layout: Grid with Banner
    // Theme: Yellow / Premium
    // ============================================================
    TOP_BRANDS: {
        id: 'top-brands',
        title: 'Top Furniture Brands',
        subtitle: 'Premium selections from top makers',
        variant: 'deal-badge',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FFFDE7', // Light Yellow
            headerTextColor: '#F57F17',
            subtitleColor: '#FBC02D',
            badgeColor: '#F57F17',
            badgeTextColor: '#FFF',
        },
        filters: { category: 'Furniture', minRating: 4 },
    },
};

// Helper to get section by ID
export const getSectionById = (id: string): SectionConfig | undefined => {
    return Object.values(SECTIONS).find(section => section.id === id);
};
