import api from '@/lib/axios';

export type ServiceStatus = 'DRAFT' | 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';

export interface Service {
    _id: string;
    name: string;
    slug: string;
    providerId: any; // Populated user object or ID
    serviceTypeId: string;
    serviceTypeCode: string;
    serviceTypeVersion: number;
    data: Record<string, any>;
    price: number;
    currency: string;
    images: string[];
    description?: string;
    status: ServiceStatus;
    location?: {
        type: string;
        coordinates: number[];
        address?: string;
    };
    rating: number;
    reviewCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface ServiceFilters {
    status?: ServiceStatus;
    serviceTypeCode?: string;
    providerId?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface ServiceListResponse {
    data: Service[];
    meta: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export const serviceApi = {
    getAll: async (filters: ServiceFilters = {}) => {
        const response = await api.get<ServiceListResponse>('/services', { params: filters });
        return response.data;
    },

    getById: async (id: string) => {
        const response = await api.get<Service>(`/services/${id}`);
        return response.data;
    },

    create: async (data: Partial<Service>) => {
        const response = await api.post<Service>('/services', data);
        return response.data;
    },

    update: async (id: string, data: Partial<Service>) => {
        const response = await api.put<Service>(`/services/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<{ message: string }>(`/services/${id}`);
        return response.data;
    }
};
