import { create } from 'zustand';
import { apiClient } from '@/lib/api';

interface ServiceCategory {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    description: string;
    isActive: boolean;
    priority: number;
    createdAt: string;
    updatedAt: string;
}

interface ServiceSubCategory {
    _id: string;
    categoryId: any;
    name: string;
    slug: string;
    description: string;
    icon: string;
    isActive: boolean;
    priority: number;
    createdAt: string;
    updatedAt: string;
}

interface ServiceTypeItem {
    _id: string;
    categoryId: any;
    subCategoryId: any;
    name: string;
    slug: string;
    description: string;
    icon: string;
    isActive: boolean;
    priority: number;
    createdAt: string;
    updatedAt: string;
}

interface ServiceProviderUser {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    profileImage?: string;
}

interface ServiceProvider {
    _id: string;
    userId: ServiceProviderUser;
    serviceCategoryId: any;
    serviceSubCategoryId: any;
    businessName: string;
    description: string;
    experienceYears: number;
    rating: number;
    reviewCount: number;
    location: {
        type: string;
        coordinates: number[];
        address?: string;
    };
    serviceArea: string[];
    pricingModel: string;
    startingPrice: number;
    currency: string;
    images: string[];
    isVerified: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface ServiceAnalytics {
    totalCategories: number;
    totalSubCategories: number;
    totalProviders: number;
    approvedProviders: number;
    pendingProviders: number;
    totalBookings: number;
    completedBookings: number;
    totalRevenue: number;
}

interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

interface ServiceMarketplaceStore {
    // Categories
    categories: ServiceCategory[];
    categoriesLoading: boolean;
    fetchCategories: () => Promise<void>;
    createCategory: (data: Partial<ServiceCategory>) => Promise<void>;
    updateCategory: (id: string, data: Partial<ServiceCategory>) => Promise<void>;
    deleteCategory: (id: string) => Promise<void>;

    // Sub-Categories
    subCategories: ServiceSubCategory[];
    subCategoriesLoading: boolean;
    fetchSubCategories: (categoryId?: string) => Promise<void>;
    createSubCategory: (data: Partial<ServiceSubCategory>) => Promise<void>;
    updateSubCategory: (id: string, data: Partial<ServiceSubCategory>) => Promise<void>;
    deleteSubCategory: (id: string) => Promise<void>;

    // Service Types
    serviceTypes: ServiceTypeItem[];
    serviceTypesLoading: boolean;
    fetchServiceTypes: (subCategoryId?: string, categoryId?: string) => Promise<void>;
    createServiceType: (data: Partial<ServiceTypeItem>) => Promise<void>;
    updateServiceType: (id: string, data: Partial<ServiceTypeItem>) => Promise<void>;
    deleteServiceType: (id: string) => Promise<void>;

    // Providers
    providers: ServiceProvider[];
    providersLoading: boolean;
    providersMeta: PaginationMeta;
    fetchProviders: (params?: any) => Promise<void>;
    updateProviderStatus: (id: string, status: string) => Promise<void>;

    // Analytics
    analytics: ServiceAnalytics | null;
    analyticsLoading: boolean;
    fetchAnalytics: () => Promise<void>;
}

export const useServiceMarketplaceStore = create<ServiceMarketplaceStore>((set, get) => ({
    // Categories
    categories: [],
    categoriesLoading: false,
    fetchCategories: async () => {
        set({ categoriesLoading: true });
        try {
            const { data } = await apiClient.get<ServiceCategory[]>('/api/service-categories');
            set({ categories: data, categoriesLoading: false });
        } catch (error) {
            console.error('Failed to fetch categories', error);
            set({ categoriesLoading: false });
        }
    },
    createCategory: async (categoryData) => {
        await apiClient.post('/api/service-categories', categoryData);
        await get().fetchCategories();
    },
    updateCategory: async (id, categoryData) => {
        await apiClient.put(`/api/service-categories/${id}`, categoryData);
        await get().fetchCategories();
    },
    deleteCategory: async (id) => {
        await apiClient.delete(`/api/service-categories/${id}`);
        await get().fetchCategories();
    },

    // Sub-Categories
    subCategories: [],
    subCategoriesLoading: false,
    fetchSubCategories: async (categoryId) => {
        set({ subCategoriesLoading: true });
        try {
            const params = categoryId ? `?categoryId=${categoryId}` : '';
            const { data } = await apiClient.get<ServiceSubCategory[]>(`/api/service-subcategories${params}`);
            set({ subCategories: data, subCategoriesLoading: false });
        } catch (error) {
            console.error('Failed to fetch sub-categories', error);
            set({ subCategoriesLoading: false });
        }
    },
    createSubCategory: async (data) => {
        await apiClient.post('/api/service-subcategories', data);
        await get().fetchSubCategories();
    },
    updateSubCategory: async (id, data) => {
        await apiClient.put(`/api/service-subcategories/${id}`, data);
        await get().fetchSubCategories();
    },
    deleteSubCategory: async (id) => {
        await apiClient.delete(`/api/service-subcategories/${id}`);
        await get().fetchSubCategories();
    },

    // Service Types
    serviceTypes: [],
    serviceTypesLoading: false,
    fetchServiceTypes: async (subCategoryId, categoryId) => {
        set({ serviceTypesLoading: true });
        try {
            const queryParts: string[] = [];
            if (subCategoryId) queryParts.push(`subCategoryId=${subCategoryId}`);
            if (categoryId) queryParts.push(`categoryId=${categoryId}`);
            const params = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
            const { data } = await apiClient.get<ServiceTypeItem[]>(`/api/service-types${params}`);
            set({ serviceTypes: data, serviceTypesLoading: false });
        } catch (error) {
            console.error('Failed to fetch service types', error);
            set({ serviceTypesLoading: false });
        }
    },
    createServiceType: async (data) => {
        await apiClient.post('/api/service-types', data);
        await get().fetchServiceTypes();
    },
    updateServiceType: async (id, data) => {
        await apiClient.put(`/api/service-types/${id}`, data);
        await get().fetchServiceTypes();
    },
    deleteServiceType: async (id) => {
        await apiClient.delete(`/api/service-types/${id}`);
        await get().fetchServiceTypes();
    },

    // Providers
    providers: [],
    providersLoading: false,
    providersMeta: { total: 0, page: 1, limit: 20, pages: 0 },
    fetchProviders: async (params = {}) => {
        set({ providersLoading: true });
        try {
            const query = new URLSearchParams(params).toString();
            const { data } = await apiClient.get<{ data: ServiceProvider[]; meta: PaginationMeta }>(
                `/api/service-providers?${query}`
            );
            set({ providers: data.data, providersMeta: data.meta, providersLoading: false });
        } catch (error) {
            console.error('Failed to fetch providers', error);
            set({ providersLoading: false });
        }
    },
    updateProviderStatus: async (id, status) => {
        await apiClient.patch(`/api/service-providers/${id}/status`, { status });
        await get().fetchProviders();
    },

    // Analytics
    analytics: null,
    analyticsLoading: false,
    fetchAnalytics: async () => {
        set({ analyticsLoading: true });
        try {
            const { data } = await apiClient.get<ServiceAnalytics>('/api/service-analytics/overview');
            set({ analytics: data, analyticsLoading: false });
        } catch (error) {
            console.error('Failed to fetch analytics', error);
            set({ analyticsLoading: false });
        }
    },
}));
