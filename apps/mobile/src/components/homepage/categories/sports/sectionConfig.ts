// Sports section configuration
import { SectionConfig } from '../shared/types';

export const SECTIONS: Record<string, SectionConfig> = {
    // ============================================================
    // PAGE: CRICKET SEASON KICK OFF
    // Layout: Showcase / Special
    // ============================================================
    CRICKET_SEASON: {
        id: 'cricket-season',
        title: 'Cricket Season Kick Off',
        subtitle: 'Gear up for the match day',
        variant: 'standard', // Using standard for now, could be specific
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1531415074984-61e663ba38cb?auto=format&fit=crop&q=80&w=1000',
        theme: {
            backgroundColor: '#1E293B', // Dark Slate
            headerTextColor: '#FFFFFF',
            subtitleColor: '#CBD5E1',
            cardBackground: '#334155',
        },
        filters: { category: 'Cricket' },
    },
    // ============================================================
    // PAGE: WINNER BRANDS
    // Layout: Grid with Brand Focus
    // ============================================================
    WINNER_BRANDS: {
        id: 'winner-brands',
        title: 'Winner Brands',
        subtitle: 'Champions choice',
        variant: 'deal-badge',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=1000',
        theme: {
            backgroundColor: '#F0F9FF', // Light Blue
            headerTextColor: '#0369A1',
            subtitleColor: '#0EA5E9',
        },
        filters: { isBrand: true, minRating: 4.5 },
    },
    // ============================================================
    // PAGE: SUPPORT YOUR GOALS
    // Layout: Showcase / Big Cards
    // ============================================================
    SUPPORT_GOALS: {
        id: 'support-goals',
        title: 'Support Your Goals',
        subtitle: 'Training gear for every level',
        variant: 'standard', // Detailed cards
        layout: 'list', // List for big detailed cards
        bannerImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000',
        theme: {
            backgroundColor: '#111827', // Dark
            headerTextColor: '#FFFFFF',
            subtitleColor: '#9CA3AF',
        },
        filters: { category: 'Fitness' },
    },
    // ============================================================
    // PAGE: GYM APPROVED ACCESSORIES
    // Layout: Grid (Gradient Cards)
    // ============================================================
    GYM_ACCESSORIES: {
        id: 'gym-accessories',
        title: 'Gym-Approved Accessories',
        subtitle: 'Essential gear for your workout',
        variant: 'standard',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=1000',
        theme: {
            backgroundColor: '#EFF6FF', // Blue tint
            headerTextColor: '#1D4ED8',
            subtitleColor: '#3B82F6',
        },
        filters: { category: 'Accessories' },
    },
    // ============================================================
    // PAGE: SPORTS COMBOS
    // Layout: List / Grid
    // ============================================================
    SPORTS_COMBOS: {
        id: 'sports-combos',
        title: 'Sports Combos',
        subtitle: 'Complete kits for your sport',
        variant: 'deal-badge',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=1000',
        theme: {
            backgroundColor: '#FFF',
            headerTextColor: '#111827',
            subtitleColor: '#6B7280',
        },
        filters: { isCombo: true },
    },
    // ============================================================
    // PAGE: SCORE BIG SAVINGS
    // Layout: Grid (Blue theme)
    // ============================================================
    BIG_SAVINGS: {
        id: 'big-savings',
        title: 'Score Big Savings',
        subtitle: 'Unbeatable deals on sports gear',
        variant: 'deal-badge', // Highlight deals
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&q=80&w=1000',
        theme: {
            backgroundColor: '#F8FAFC',
            headerTextColor: '#0F172A',
            subtitleColor: '#334155',
        },
        filters: { minDiscount: 50 },
    },
};

// Helper to get section by ID
export const getSectionById = (id: string): SectionConfig | undefined => {
    return Object.values(SECTIONS).find(section => section.id === id);
};
