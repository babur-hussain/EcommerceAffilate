import { create } from 'zustand';
import { serviceApi, Service, ServiceFilters, ServiceListResponse } from '@/lib/api/service';
import { toast } from 'react-hot-toast';

interface ServiceState {
    services: Service[];
    meta: ServiceListResponse['meta'];
    currentService: Service | null;
    isLoading: boolean;
    error: string | null;

    fetchServices: (filters?: ServiceFilters) => Promise<void>;
    fetchServiceById: (id: string) => Promise<void>;
    createService: (data: Partial<Service>) => Promise<Service | undefined>;
    updateService: (id: string, data: Partial<Service>) => Promise<void>;
    deleteService: (id: string) => Promise<void>;
    setCurrentService: (service: Service | null) => void;
}

export const useServiceStore = create<ServiceState>((set, get) => ({
    services: [],
    meta: { total: 0, page: 1, limit: 10, pages: 0 },
    currentService: null,
    isLoading: false,
    error: null,

    fetchServices: async (filters) => {
        set({ isLoading: true, error: null });
        try {
            const response = await serviceApi.getAll(filters);
            set({ services: response.data, meta: response.meta, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, error: 'Failed to fetch services' });
            toast.error('Failed to fetch services');
        }
    },

    fetchServiceById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const service = await serviceApi.getById(id);
            set({ currentService: service, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, error: 'Failed to fetch service details' });
            toast.error('Failed to fetch service details');
        }
    },

    createService: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newService = await serviceApi.create(data);
            set((state) => ({
                services: [newService, ...state.services],
                isLoading: false
            }));
            toast.success('Service created successfully');
            return newService;
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Failed to create service';
            const details = error.response?.data?.details;
            set({ isLoading: false, error: msg });

            if (details && Array.isArray(details)) {
                details.forEach((d: string) => toast.error(d));
            } else {
                toast.error(msg);
            }
        }
    },

    updateService: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updatedService = await serviceApi.update(id, data);
            set((state) => ({
                services: state.services.map((s) => (s._id === id ? updatedService : s)),
                currentService: state.currentService?._id === id ? updatedService : state.currentService,
                isLoading: false
            }));
            toast.success('Service updated successfully');
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Failed to update service';
            const details = error.response?.data?.details;
            set({ isLoading: false, error: msg });

            if (details && Array.isArray(details)) {
                details.forEach((d: string) => toast.error(d));
            } else {
                toast.error(msg);
            }
        }
    },

    deleteService: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await serviceApi.delete(id);
            set((state) => ({
                services: state.services.filter((s) => s._id !== id),
                isLoading: false
            }));
            toast.success('Service archived');
        } catch (error: any) {
            set({ isLoading: false, error: 'Failed to delete service' });
            toast.error('Failed to delete service');
        }
    },

    setCurrentService: (service) => set({ currentService: service })
}));
