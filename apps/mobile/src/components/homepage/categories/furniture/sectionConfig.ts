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
    // ============================================================
    // PAGE: SHOP BY ROOM
    // Layout: Grid
    // ============================================================
    SHOP_BY_ROOM: {
        id: 'shop-by-room',
        title: 'Shop by Room',
        subtitle: 'Curated sets for every room',
        variant: 'standard',
        layout: 'grid',
        theme: {
            backgroundColor: '#FFF8E1',
            headerTextColor: '#000',
            subtitleColor: '#5D4037',
        },
        filters: { category: 'Furniture' },
    },
    // ============================================================
    // PAGE: SAMARTH STORE
    // Layout: Grid (Artisan Focus)
    // ============================================================
    SAMARTH_STORE: {
        id: 'samarth-store',
        title: 'Samarth Store',
        subtitle: 'Handcrafted with love',
        variant: 'standard',
        layout: 'grid',
        theme: {
            backgroundColor: '#EFEBE9',
            headerTextColor: '#4E342E',
            subtitleColor: '#6D4C41',
        },
        filters: { tags: 'handcrafted' },
    },
    // ============================================================
    // PAGE: EMI OFFERS
    // Layout: List
    // ============================================================
    EMI_OFFERS: {
        id: 'emi-offers',
        title: 'No Cost EMI Offers',
        subtitle: 'Furniture that fits your budget',
        variant: 'deal-badge',
        layout: 'list',
        theme: {
            backgroundColor: '#E3F2FD',
            headerTextColor: '#0D47A1',
            subtitleColor: '#1976D2',
        },
        filters: { minPrice: 5000 },
    },
    // ============================================================
    // PAGE: SHOP BY MATERIAL
    // Layout: Grid
    // ============================================================
    SHOP_BY_MATERIAL: {
        id: 'shop-by-material',
        title: 'Shop by Material',
        subtitle: 'Wood, Metal, Glass & More',
        variant: 'standard',
        layout: 'grid',
        theme: {
            backgroundColor: '#FAFAFA',
            headerTextColor: '#212121',
            subtitleColor: '#616161',
        },
        filters: { category: 'Furniture' },
    },
    // ============================================================
    // PAGE: WISHLIST / EVERYBODY'S LIST
    // Layout: Grid
    // ============================================================
    WISHLIST: {
        id: 'wishlist',
        title: 'Most Wishlisted',
        subtitle: 'What everyone is loving right now',
        variant: 'standard',
        layout: 'grid',
        theme: {
            backgroundColor: '#FFEBEE',
            headerTextColor: '#C62828',
            subtitleColor: '#EF5350',
        },
        filters: { sort: 'popularity' },
    },
    EVERYBODY_LIST: {
        id: 'everybody-list',
        title: "On Everybody's List",
        subtitle: 'Trending furniture items',
        variant: 'deal-badge',
        layout: 'grid',
        theme: {
            backgroundColor: '#F3E5F5',
            headerTextColor: '#6A1B9A',
            subtitleColor: '#8E24AA',
        },
        filters: { minRating: 4.5 },
    },
    // ============================================================
    // PAGE: RARE FINDS & STATEMENT PIECES
    // Layout: Showcase
    // ============================================================
    RARE_FINDS: {
        id: 'rare-finds',
        title: 'Rare Finds',
        subtitle: 'Unique pieces you won\'t find elsewhere',
        variant: 'standard',
        layout: 'showcase',
        theme: {
            backgroundColor: '#263238',
            headerTextColor: '#ECEFF1',
            subtitleColor: '#B0BEC5',
        },
        filters: { tags: 'unique' },
    },
    STATEMENT_PIECES: {
        id: 'statement-pieces',
        title: 'Statement Pieces',
        subtitle: 'Make a bold impression',
        variant: 'standard',
        layout: 'masonry',
        theme: {
            backgroundColor: '#212121',
            headerTextColor: '#FAFAFA',
            subtitleColor: '#E0E0E0',
        },
        filters: { price: 'high-low' },
    },

};

// Helper to get section by ID
export const getSectionById = (id: string): SectionConfig | undefined => {
    return Object.values(SECTIONS).find(section => section.id === id);
};
