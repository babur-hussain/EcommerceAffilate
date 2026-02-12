'use client';

import React from 'react';
import { useFormContext, Controller } from 'react-hook-form';
import { ServiceField } from '@/lib/api/serviceType';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DynamicServiceFormProps {
    fields: ServiceField[];
}

export function DynamicServiceForm({ fields }: DynamicServiceFormProps) {
    const { control, register, formState: { errors } } = useFormContext();

    const sortedFields = [...fields].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-6">
            {sortedFields.map((field) => {
                const fieldName = `data.${field.key}`;
                const error = (errors.data as any)?.[field.key];

                return (
                    <div key={field.key} className="space-y-2">
                        <Label htmlFor={fieldName} className="flex gap-1">
                            {field.label}
                            {field.required && <span className="text-red-500">*</span>}
                        </Label>

                        {renderFieldInput(field, fieldName, control, register)}

                        {field.placeholder && (
                            <p className="text-xs text-gray-500">{field.placeholder}</p>
                        )}
                        {error && (
                            <p className="text-xs text-red-500">{error.message?.toString() || 'Invalid value'}</p>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function renderFieldInput(field: ServiceField, name: string, control: any, register: any) {
    switch (field.type) {
        case 'textarea':
            return (
                <Textarea
                    {...register(name, { required: field.required })}
                    placeholder={field.placeholder}
                />
            );

        case 'number':
            return (
                <Input
                    type="number"
                    {...register(name, {
                        required: field.required,
                        valueAsNumber: true,
                        min: field.validation?.min,
                        max: field.validation?.max
                    })}
                    placeholder={field.placeholder}
                />
            );

        case 'dropdown':
            return (
                <Controller
                    name={name}
                    control={control}
                    rules={{ required: field.required }}
                    render={({ field: { onChange, value } }) => (
                        <Select onValueChange={onChange} defaultValue={value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options?.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
            );

        case 'boolean':
            return (
                <Controller
                    name={name}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id={name}
                                checked={value}
                                onCheckedChange={onChange}
                            />
                            <label
                                htmlFor={name}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {field.label}
                            </label>
                        </div>
                    )}
                />
            );

        // TODO: Implement File/Image uploaders properly with separate components
        // For now, simple text input for URL
        case 'file':
        case 'image':
            return (
                <Input
                    {...register(name, { required: field.required })}
                    placeholder="File URL (Upload implementation pending)"
                />
            );

        case 'text':
        default:
            return (
                <Input
                    {...register(name, {
                        required: field.required,
                        pattern: field.validation?.regex ? {
                            value: new RegExp(field.validation.regex),
                            message: 'Format is invalid'
                        } : undefined
                    })}
                    placeholder={field.placeholder}
                />
            );
    }
}
