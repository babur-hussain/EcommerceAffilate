export interface IFilterConfig {
    key: string;
    label: string;
    type: 'select' | 'multiselect' | 'variant' | 'range' | 'text';
    required: boolean;
    options?: string[];
    min?: number;
    max?: number;
    unit?: string;
    isVariant?: boolean; // Sometimes used to explicitly mark variants
}

export interface IVariant {
    sku: string;
    attributes: Record<string, string>; // e.g., { "color": "Red", "size": "M" }
    price: number;
    mrp?: number;
    stock: number;
    images: string[];
    isActive: boolean;
    type?: string;
    value?: string;
    image?: string; // Singular image for backward compatibility / display
    priceOverride?: string; // String for input fields
}

export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    filterConfig?: IFilterConfig[];
}
