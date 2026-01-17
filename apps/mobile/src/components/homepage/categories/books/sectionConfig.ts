// Books section configuration
import { SectionConfig } from '../shared/types';

export const SECTIONS: Record<string, SectionConfig> = {
    // ============================================================
    // PAGE: MUSIC GENRES
    // Layout: Grid
    // ============================================================
    MUSIC_GENRES: {
        id: 'music-genres',
        title: 'Music Genres',
        subtitle: 'Explore the world of music',
        variant: 'standard', // Basic grid
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FFF',
            headerTextColor: '#111827',
            subtitleColor: '#6B7280',
        },
        filters: { category: 'Music' },
    },
    // ============================================================
    // PAGE: BOOKS GENRES
    // Layout: Grid
    // ============================================================
    BOOKS_GENRES: {
        id: 'books-genres',
        title: 'Books Genres',
        subtitle: 'Find your next favorite read',
        variant: 'standard',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1507842217121-ca4bb6b69d90?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FFF',
            headerTextColor: '#111827',
            subtitleColor: '#6B7280',
        },
        filters: { category: 'Books' },
    },
    // ============================================================
    // PAGE: SUPERSTAR BRANDS
    // Layout: Grid
    // ============================================================
    SUPERSTAR_BRANDS: {
        id: 'superstar-brands',
        title: 'Superstar Brands',
        subtitle: 'Top brands in instruments and audio',
        variant: 'standard',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#F3F4F6',
            headerTextColor: '#111827',
            subtitleColor: '#4B5563',
        },
        filters: { isBrand: true }, // Placeholder filter
    },
    // ============================================================
    // PAGE: AUTHORS BEST WORK
    // Layout: List
    // ============================================================
    AUTHORS_BEST_WORK: {
        id: 'authors-best-work',
        title: "Author's Best Work",
        subtitle: 'Masterpieces from legendary authors',
        variant: 'standard',
        layout: 'list',
        bannerImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FFF7ED', // Light Orange
            headerTextColor: '#9A3412',
            subtitleColor: '#C2410C',
        },
        filters: { category: 'Books', sort: 'rating' },
    },
    // ============================================================
    // PAGE: BUDGET CARNIVAL
    // Layout: Grid with Budget Overlay
    // ============================================================
    BUDGET_CARNIVAL: {
        id: 'budget-carnival',
        title: 'Budget Carnival',
        subtitle: 'Great finds at pocket-friendly prices',
        variant: 'budget-overlay',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1554260570-e9689a3418b8?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FEFCE8', // Light Yellow
            headerTextColor: '#854D0E',
            subtitleColor: '#A16207',
        },
        filters: { maxPrice: 999 },
    },
};

// Helper to get section by ID
export const getSectionById = (id: string): SectionConfig | undefined => {
    return Object.values(SECTIONS).find(section => section.id === id);
};
