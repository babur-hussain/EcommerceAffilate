// Shared types for beauty section pages

export interface Product {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
    images: string[];
    category: string;
    description?: string;
    rating?: number;
    reviewCount?: number;
    brand?: string;
}

export type CardVariant =
    | 'standard'
    | 'deal-badge'
    | 'festive'
    | 'budget-overlay'
    | 'winter'
    | 'forecast'
    | 'winter-clearance'
    | 'shoe-fest'
    | 'beauty-standard' // New variant for beauty if needed
    | 'k-beauty'        // Specific variants for beauty
    | 'launch-party';

export type SectionLayout = 'grid' | 'list' | 'masonry' | 'showcase' | 'kids-hub';

export interface HubSectionItem {
    id: string;
    label: string;
    image: string;
    price?: string; // e.g. "From ₹99"
    logo?: string;
    offer?: string;
    color?: string;
}

export interface HubSection {
    type: 'circle-nav' | 'banner' | 'scroll-row' | 'brand-scroll' | 'winter-scroll' | 'curated-scroll' | 'bestseller-grid' | 'trend-list' | 'beauty-scroll'; // Added beauty-scroll
    title?: string;
    items?: HubSectionItem[];
    bannerData?: {
        image: string;
        title: string;
        subtitle: string;
        priceTag: string;
    };
}

export interface SectionTheme {
    backgroundColor: string;
    headerTextColor: string;
    subtitleColor?: string;
    cardBackground?: string;
    accentColor?: string;
    badgeColor?: string;
    badgeTextColor?: string;
    backgroundImage?: string;
}

export interface SectionConfig {
    id: string;
    title: string;
    subtitle?: string;
    variant: CardVariant;
    layout: SectionLayout;
    theme: SectionTheme;
    filters?: Record<string, any>;
    bannerImage?: string; // Optional hero banner for page header
    apiEndpoint?: string; // Optional custom endpoint

    // Structured data for Hub layouts
    hubData?: HubSection[];
}

export interface CardProps {
    product: Product;
    theme: SectionTheme;
    onPress: () => void;
    index: number;
}
