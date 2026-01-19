import { SectionConfig } from '../shared/types';

export const SECTIONS: Record<string, SectionConfig> = {
    ELECTRONICS_BANNERS: {
        id: 'electronics-banners',
        title: 'Electronics Banners',
        variant: 'banner-slider',
        layout: 'banner',
        theme: {
            backgroundColor: '#FFFFFF',
            headerTextColor: '#000000',
        },
    },
    ELECTRONICS_SUBCATEGORIES: {
        id: 'electronics-subcategories',
        title: 'Shop by Category',
        variant: 'standard',
        layout: 'grid',
        theme: {
            backgroundColor: '#FFFFFF',
            headerTextColor: '#000000',
        },
    },
    ELECTRONICS_PRODUCT_GRID: {
        id: 'electronics-product-grid',
        title: 'Latest in Electronics',
        variant: 'standard',
        layout: 'grid',
        theme: {
            backgroundColor: '#FFFFFF',
            headerTextColor: '#000000',
        },
    }
};

export const getSectionById = (id: string): SectionConfig | undefined => {
    return Object.values(SECTIONS).find(section => section.id === id);
};
