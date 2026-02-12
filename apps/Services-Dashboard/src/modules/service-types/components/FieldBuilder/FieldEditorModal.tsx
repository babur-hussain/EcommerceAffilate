'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ServiceField } from '@/lib/api/serviceType';
import { Plus, X } from 'lucide-react';

interface FieldEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (field: ServiceField) => void;
    initialField?: ServiceField;
}

export function FieldEditorModal({ isOpen, onClose, onSave, initialField }: FieldEditorModalProps) {
    const { register, handleSubmit, reset, watch, setValue, control } = useForm<ServiceField>({
        defaultValues: {
            key: '',
            label: '',
            type: 'text',
            required: false,
            order: 0,
            options: [],
            validation: {},
            visibility: { admin: true, customer: true }
        }
    });

    useEffect(() => {
        if (initialField) {
            reset(initialField);
        } else {
            reset({
                key: '',
                label: '',
                type: 'text',
                required: false,
                order: 0,
                options: [],
                validation: {},
                visibility: { admin: true, customer: true }
            });
        }
    }, [initialField, isOpen, reset]);

    const fieldType = watch('type');
    const options = watch('options') || [];

    const handleAddOption = () => {
        setValue('options', [...options, { label: '', value: '' }]);
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setValue('options', newOptions);
    };

    const onSubmit = (data: ServiceField) => {
        // Auto-generate key from label if empty? Maybe not, force user to define key carefully.
        onSave(data);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{initialField ? 'Edit Field' : 'Add New Field'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Label</label>
                            <input {...register('label', { required: true })} className="w-full rounded-md border p-2" placeholder="e.g. Years of Experience" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Field Key</label>
                            <input {...register('key', { required: true })} className="w-full rounded-md border p-2 font-mono" placeholder="e.g. experience_years" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select {...register('type')} className="w-full rounded-md border p-2">
                                <option value="text">Text</option>
                                <option value="number">Number</option>
                                <option value="textarea">Text Area</option>
                                <option value="dropdown">Dropdown</option>
                                <option value="multiselect">Multi-select</option>
                                <option value="boolean">Boolean (Yes/No)</option>
                                <option value="date">Date</option>
                                <option value="file">File Upload</option>
                                <option value="image">Image Upload</option>
                            </select>
                        </div>
                        <div className="flex items-end pb-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" {...register('required')} className="h-4 w-4" />
                                <span className="text-sm">Required Field</span>
                            </label>
                        </div>
                    </div>

                    {/* Options Builder for Dropdown/Multiselect */}
                    {(fieldType === 'dropdown' || fieldType === 'multiselect') && (
                        <div className="border rounded-md p-3 bg-gray-50">
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium">Options</label>
                                <Button type="button" size="sm" variant="outline" onClick={handleAddOption}>
                                    <Plus className="h-3 w-3 mr-1" /> Add Option
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {options.map((opt, idx) => (
                                    <div key={idx} className="flex gap-2">
                                        <input
                                            className="flex-1 rounded-md border p-1 text-sm"
                                            placeholder="Label"
                                            {...register(`options.${idx}.label` as const, { required: true })}
                                        />
                                        <input
                                            className="flex-1 rounded-md border p-1 text-sm font-mono"
                                            placeholder="Value"
                                            {...register(`options.${idx}.value` as const, { required: true })}
                                        />
                                        <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveOption(idx)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                                {options.length === 0 && <p className="text-xs text-gray-400">No options added yet.</p>}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Validation (Min/Max)</label>
                            <div className="flex gap-2">
                                <input type="number" {...register('validation.min', { valueAsNumber: true })} className="w-full rounded-md border p-2" placeholder="Min" />
                                <input type="number" {...register('validation.max', { valueAsNumber: true })} className="w-full rounded-md border p-2" placeholder="Max" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Regex Pattern</label>
                            <input {...register('validation.regex')} className="w-full rounded-md border p-2 font-mono" placeholder="^[a-z]+$" />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit">Save Field</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
