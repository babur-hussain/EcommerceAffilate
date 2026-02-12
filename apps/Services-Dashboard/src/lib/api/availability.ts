import api from '@/lib/axios';

export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'BLOCKED' | 'HOLD';

export interface Slot {
    _id?: string;
    startTime: string; // HH:mm
    endTime: string;   // HH:mm
    status: SlotStatus;
    orderId?: string;
}

export interface Availability {
    _id: string;
    providerId: string;
    date: string; // ISO date string
    slots: Slot[];
}

export interface RecurrenceOptions {
    endDate: string; // ISO date string
    daysOfWeek: number[]; // 0-6
}

export interface UpdateAvailabilityPayload {
    providerId: string;
    date: string; // ISO date string
    slots: Slot[];
    recurrence?: RecurrenceOptions;
}

export const availabilityApi = {
    getAvailability: async (providerId: string, startDate: string, endDate: string) => {
        const response = await api.get<Availability[]>('/availability', {
            params: { providerId, startDate, endDate }
        });
        return response.data;
    },

    updateAvailability: async (payload: UpdateAvailabilityPayload) => {
        const response = await api.post<{ message: string }>('/availability', payload);
        return response.data;
    }
};
