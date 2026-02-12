'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

interface SlotManagerDialogProps {
    isOpen: boolean;
    onClose: () => void;
    date: Date | null;
    onSave: (slots: any[], recurrence?: any) => void;
    existingSlots?: any[];
}

export function SlotManagerDialog({ isOpen, onClose, date, onSave, existingSlots = [] }: SlotManagerDialogProps) {
    const [mode, setMode] = useState<'single' | 'bulk'>('bulk');
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [slotDuration, setSlotDuration] = useState(60); // minutes
    const [isRecurring, setIsRecurring] = useState(false);
    const [recurrenceEnd, setRecurrenceEnd] = useState('');
    const [selectedDays, setSelectedDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri default

    const generateSlots = () => {
        const slots = [];
        let current = new Date(`2000-01-01T${startTime}`);
        const end = new Date(`2000-01-01T${endTime}`);

        while (current < end) {
            const next = new Date(current.getTime() + slotDuration * 60000);
            if (next > end) break;

            slots.push({
                startTime: format(current, 'HH:mm'),
                endTime: format(next, 'HH:mm'),
                status: 'AVAILABLE'
            });
            current = next;
        }
        return slots;
    };

    const handleSave = () => {
        const slots = generateSlots();
        const recurrence = isRecurring && recurrenceEnd ? {
            endDate: recurrenceEnd,
            daysOfWeek: selectedDays
        } : undefined;

        onSave(slots, recurrence);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Manage Availability for {date ? format(date, 'MMM d, yyyy') : ''}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant={mode === 'bulk' ? 'default' : 'outline'}
                            onClick={() => setMode('bulk')}
                            size="sm"
                        >
                            Bulk Generate
                        </Button>
                        <Button
                            variant={mode === 'single' ? 'default' : 'outline'}
                            onClick={() => setMode('single')}
                            size="sm"
                            disabled
                        >
                            Manual (Coming Soon)
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Start Time</Label>
                            <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>End Time</Label>
                            <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Slot Duration (minutes)</Label>
                        <Select value={slotDuration.toString()} onValueChange={(v) => setSlotDuration(Number(v))}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select duration" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="15">15 Minutes</SelectItem>
                                <SelectItem value="30">30 Minutes</SelectItem>
                                <SelectItem value="45">45 Minutes</SelectItem>
                                <SelectItem value="60">1 Hour</SelectItem>
                                <SelectItem value="120">2 Hours</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center space-x-2 pt-2">
                        <Checkbox id="recurring" checked={isRecurring} onCheckedChange={(c) => setIsRecurring(!!c)} />
                        <Label htmlFor="recurring">Repeat this schedule</Label>
                    </div>

                    {isRecurring && (
                        <div className="space-y-4 p-4 border rounded bg-gray-50">
                            <div className="space-y-2">
                                <Label>Repeat Until</Label>
                                <Input type="date" value={recurrenceEnd} onChange={(e) => setRecurrenceEnd(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Days of Week</Label>
                                <div className="flex gap-2">
                                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                        <div
                                            key={i}
                                            onClick={() => {
                                                if (selectedDays.includes(i)) setSelectedDays(selectedDays.filter(d => d !== i));
                                                else setSelectedDays([...selectedDays, i]);
                                            }}
                                            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold cursor-pointer ${selectedDays.includes(i) ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                                                }`}
                                        >
                                            {day}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleSave}>Save Slots</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
