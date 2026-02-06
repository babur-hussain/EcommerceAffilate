export type UserRole = 'ADMIN' | 'SELLER_OWNER' | 'SELLER_MANAGER' | 'SELLER_STAFF' | 'INFLUENCER' | 'CUSTOMER' | 'BUSINESS_OWNER' | 'BUSINESS_MANAGER' | 'BUSINESS_STAFF';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    businessId?: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
}

export interface Service {
    id: string;
    name: string;
    description: string;
    price: number;
    categoryId: string;
    images: string[];
    active: boolean;
}
