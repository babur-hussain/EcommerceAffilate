'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Views, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, startOfMonth, endOfMonth, addMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAvailabilityStore } from '@/store/useAvailabilityStore';
import { useAuth } from '@/context/AuthContext';
import { SlotManagerDialog } from '../components/SlotManagerDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default function AvailabilityCalendarPage() {
    const { user } = useAuth(); // Assuming provider is logged in or admin selecting provider
    const { availabilities, fetchAvailability, updateAvailability } = useAvailabilityStore();

    // For demo/admin, we might need a Provider Selector if user is Admin.
    // Assuming current user is provider for MVP or hardcoded ID if testing.
    const providerId = (user as any)?._id || '65c2b6e0e6b6a3a123456789'; // Fallback for dev

    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState<View>(Views.MONTH);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        // Fetch current month + buffer
        const start = startOfMonth(addMonths(currentDate, -1));
        const end = endOfMonth(addMonths(currentDate, 1));
        if (providerId) {
            fetchAvailability(providerId, start, end);
        }
    }, [currentDate, providerId, fetchAvailability]);

    // Transform availability to calendar events
    const events = availabilities.flatMap(av => {
        const dateStr = format(new Date(av.date), 'yyyy-MM-dd');
        return av.slots.map(slot => ({
            title: `${slot.startTime} - ${slot.endTime} (${slot.status})`,
            start: new Date(`${dateStr}T${slot.startTime}`),
            end: new Date(`${dateStr}T${slot.endTime}`),
            resource: slot,
            allDay: false
        }));
    });

    const handleSelectSlot = (slotInfo: { start: Date; end: Date; action: string }) => {
        setSelectedDate(slotInfo.start);
        setIsDialogOpen(true);
    };

    const handleSaveSlots = async (slots: any[], recurrence: any) => {
        if (!selectedDate) return;

        await updateAvailability({
            providerId,
            date: selectedDate.toISOString(),
            slots,
            recurrence
        });

        // Refetch
        const start = startOfMonth(addMonths(currentDate, -1));
        const end = endOfMonth(addMonths(currentDate, 1));
        fetchAvailability(providerId, start, end);
    };

    return (
        <div className="h-full p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Availability Calendar</h2>
                {/* Provider Selector could go here for Admins */}
            </div>

            <Card className="h-[800px]">
                <CardContent className="h-full p-4">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        onNavigate={(date) => setCurrentDate(date)}
                        onView={(view) => setView(view)}
                        view={view}
                        views={[Views.MONTH, Views.WEEK, Views.DAY]}
                        selectable
                        onSelectSlot={handleSelectSlot}
                        eventPropGetter={(event) => {
                            const status = (event.resource as any).status;
                            let className = 'bg-blue-500';
                            if (status === 'BOOKED') className = 'bg-red-500';
                            if (status === 'BLOCKED') className = 'bg-gray-500';
                            return { className };
                        }}
                    />
                </CardContent>
            </Card>

            <SlotManagerDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                date={selectedDate}
                onSave={handleSaveSlots}
            />
        </div>
    );
}
