import api from '@/lib/axios';

export type ServiceTypeStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface ServiceField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'textarea' | 'dropdown' | 'multiselect' | 'boolean' | 'date' | 'file' | 'image';
    required: boolean;
    options?: { label: string; value: string }[];
    validation?: {
        min?: number;
        max?: number;
        regex?: string;
    };
    defaultValue?: any;
    placeholder?: string;
    order: number;
    visibility?: {
        admin: boolean;
        customer: boolean;
    };
}

export interface ServiceType {
    _id: string;
    name: string;
    code: string;
    countryCode: string;
    version: number;
    status: ServiceTypeStatus;
    fields: ServiceField[];
    description?: string;
    icon?: string;
    createdAt: string;
    updatedAt: string;
}

export const serviceTypeApi = {
    getAll: async (status?: ServiceTypeStatus) => {
        const params = status ? { status } : {};
        const response = await api.get<ServiceType[]>('/service-types', { params });
        return response.data;
    },

    getByCode: async (code: string, countryCode?: string, version?: number) => {
        const params: any = {};
        if (countryCode) params.countryCode = countryCode;
        if (version) params.version = version;

        const response = await api.get<ServiceType>(`/service-types/${code}`, { params });
        return response.data;
    },

    create: async (data: Partial<ServiceType>) => {
        const response = await api.post<ServiceType>('/service-types', data);
        return response.data;
    },

    update: async (id: string, data: Partial<ServiceType>) => {
        const response = await api.put<ServiceType>(`/service-types/${id}`, data);
        return response.data;
    },

    publish: async (id: string) => {
        const response = await api.post<ServiceType>(`/service-types/${id}/publish`);
        return response.data;
    }
};
