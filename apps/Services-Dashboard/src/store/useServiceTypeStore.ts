import { create } from 'zustand';
import { serviceTypeApi, ServiceType } from '@/lib/api/serviceType';
import { toast } from 'react-hot-toast';

interface ServiceTypeState {
    serviceTypes: ServiceType[];
    currentServiceType: ServiceType | null;
    isLoading: boolean;
    error: string | null;

    fetchServiceTypes: () => Promise<void>;
    fetchServiceTypeByCode: (code: string, countryCode?: string, version?: number) => Promise<void>;
    createServiceType: (data: Partial<ServiceType>) => Promise<ServiceType | undefined>;
    updateServiceType: (id: string, data: Partial<ServiceType>) => Promise<void>;
    publishServiceType: (id: string) => Promise<void>;
    setCurrentServiceType: (serviceType: ServiceType | null) => void;
}

export const useServiceTypeStore = create<ServiceTypeState>((set, get) => ({
    serviceTypes: [],
    currentServiceType: null,
    isLoading: false,
    error: null,

    fetchServiceTypes: async () => {
        set({ isLoading: true, error: null });
        try {
            const serviceTypes = await serviceTypeApi.getAll();
            set({ serviceTypes, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, error: 'Failed to fetch service types' });
            toast.error('Failed to fetch service types');
        }
    },

    fetchServiceTypeByCode: async (code, countryCode, version) => {
        set({ isLoading: true, error: null });
        try {
            const serviceType = await serviceTypeApi.getByCode(code, countryCode, version);
            set({ currentServiceType: serviceType, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, error: 'Failed to fetch service type details' });
            toast.error('Failed to fetch service type details');
        }
    },

    createServiceType: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const newType = await serviceTypeApi.create(data);
            set((state) => ({
                serviceTypes: [...state.serviceTypes, newType],
                isLoading: false
            }));
            toast.success('Service Type created successfully');
            return newType;
        } catch (error: any) {
            set({ isLoading: false, error: error.response?.data?.error || 'Failed to create service type' });
            toast.error(error.response?.data?.error || 'Failed to create service type');
        }
    },

    updateServiceType: async (id, data) => {
        set({ isLoading: true, error: null });
        try {
            const updatedType = await serviceTypeApi.update(id, data);
            set((state) => ({
                serviceTypes: state.serviceTypes.map((t) => (t._id === id ? updatedType : t)),
                currentServiceType: state.currentServiceType?._id === id ? updatedType : state.currentServiceType,
                isLoading: false
            }));
            toast.success('Service Type saved successfully');
        } catch (error: any) {
            set({ isLoading: false, error: error.response?.data?.error || 'Failed to update service type' });
            toast.error(error.response?.data?.error || 'Failed to update service type');
        }
    },

    publishServiceType: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const publishedType = await serviceTypeApi.publish(id);
            set((state) => ({
                serviceTypes: state.serviceTypes.map((t) => (t._id === id ? publishedType : t)),
                currentServiceType: state.currentServiceType?._id === id ? publishedType : state.currentServiceType,
                isLoading: false
            }));
            toast.success('Service Type published successfully');
        } catch (error: any) {
            set({ isLoading: false, error: error.message || 'Failed to publish' });
            toast.error('Failed to publish');
        }
    },

    setCurrentServiceType: (serviceType) => set({ currentServiceType: serviceType })

}));
