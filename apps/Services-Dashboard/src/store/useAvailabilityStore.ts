import { create } from 'zustand';
import { availabilityApi, Availability, Slot, UpdateAvailabilityPayload } from '@/lib/api/availability';
import { toast } from 'react-hot-toast';

interface AvailabilityState {
    availabilities: Availability[];
    isLoading: boolean;
    error: string | null;

    fetchAvailability: (providerId: string, start: Date, end: Date) => Promise<void>;
    updateAvailability: (payload: UpdateAvailabilityPayload) => Promise<void>;
}

export const useAvailabilityStore = create<AvailabilityState>((set) => ({
    availabilities: [],
    isLoading: false,
    error: null,

    fetchAvailability: async (providerId, start, end) => {
        set({ isLoading: true, error: null });
        try {
            const data = await availabilityApi.getAvailability(
                providerId,
                start.toISOString(),
                end.toISOString()
            );
            set({ availabilities: data, isLoading: false });
        } catch (error: any) {
            set({ isLoading: false, error: 'Failed to fetch availability' });
            toast.error('Failed to fetch availability');
        }
    },

    updateAvailability: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            await availabilityApi.updateAvailability(payload);
            toast.success(payload.recurrence ? 'Recurring availability updated' : 'Availability updated');
            set({ isLoading: false });
            // Note: Caller should trigger refetch or we could optimistic update if complex logic allowed
        } catch (error: any) {
            set({ isLoading: false, error: 'Failed to update availability' });
            toast.error('Failed to update availability');
        }
    }
}));
