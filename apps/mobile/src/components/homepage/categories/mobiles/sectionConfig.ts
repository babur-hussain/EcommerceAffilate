// Mobiles section configuration
import { SectionConfig } from '../shared/types';

export const SECTIONS: Record<string, SectionConfig> = {
    // ============================================================
    // PAGE: BUY BEFORE THE SALE
    // Layout: Grid with Deal Badges (mocking the custom cards with standard deal cards)
    // ============================================================
    BUY_BEFORE_SALE: {
        id: 'buy-before-sale',
        title: 'Buy before the sale',
        subtitle: 'Festive prices are back!',
        variant: 'deal-badge',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#C8E6C9', // Green tint matching the card
            headerTextColor: '#1B5E20',
            subtitleColor: '#2E7D32',
        },
        filters: { category: 'Mobiles', discount: 'min20' },
    },
    // ============================================================
    // PAGE: JUST LAUNCHED
    // Layout: Showcase
    // ============================================================
    JUST_LAUNCHED: {
        id: 'just-launched',
        title: 'Just Launched',
        subtitle: 'The latest tech in town',
        variant: 'standard',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1592286927505-c0d0eb5e8a8c?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FFF',
            headerTextColor: '#111827',
            subtitleColor: '#6B7280',
        },
        filters: { category: 'Mobiles', isNew: true },
    },
    // ============================================================
    // PAGE: FLAGSHIP PHONES
    // Layout: List
    // ============================================================
    FLAGSHIP_PHONES: {
        id: 'flagship-phones',
        title: 'Flagship Powerhouses',
        subtitle: 'Experience premium performance',
        variant: 'standard',
        layout: 'list',
        bannerImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#000',
            headerTextColor: '#FFF',
            subtitleColor: '#9CA3AF',
        },
        filters: { category: 'Mobiles', minPrice: 50000 },
    },
    // ============================================================
    // PAGE: BUDGET BUYS
    // Layout: Budget Overlay
    // ============================================================
    BUDGET_BUYS: {
        id: 'budget-buys',
        title: 'Budget Buys',
        subtitle: 'Smartphones under ₹15,000',
        variant: 'budget-overlay',
        layout: 'grid',
        bannerImage: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=80',
        theme: {
            backgroundColor: '#FFF3E0', // Orange tint
            headerTextColor: '#E65100',
            subtitleColor: '#EF6C00',
        },
        filters: { category: 'Mobiles', maxPrice: 15000 },
    },
};

// Helper to get section by ID
export const getSectionById = (id: string): SectionConfig | undefined => {
    return Object.values(SECTIONS).find(section => section.id === id);
};
