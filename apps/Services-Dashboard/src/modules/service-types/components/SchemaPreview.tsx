'use client';

import React from 'react';
import { ServiceField } from '@/lib/api/serviceType';
import { Button } from '@/components/ui/button';

interface SchemaPreviewProps {
    fields: ServiceField[];
}

export function SchemaPreview({ fields }: SchemaPreviewProps) {
    return (
        <div className="bg-white p-6 rounded-md border shadow-sm h-full">
            <h3 className="text-lg font-medium mb-4 pb-2 border-b">Form Preview</h3>

            {fields.length === 0 ? (
                <div className="text-center text-gray-400 py-10">
                    Add fields to see preview
                </div>
            ) : (
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                    {fields.sort((a, b) => a.order - b.order).map((field) => (
                        <div key={field.key} className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">
                                {field.label} {field.required && <span className="text-red-500">*</span>}
                            </label>

                            {/* Render input based on type */}
                            {renderInput(field)}

                            {field.placeholder && <p className="text-xs text-gray-400">{field.placeholder}</p>}
                        </div>
                    ))}

                    <div className="pt-4">
                        <Button disabled className="w-full">Submit Application</Button>
                    </div>
                </form>
            )}
        </div>
    );
}

function renderInput(field: ServiceField) {
    const commonClasses = "block w-full rounded-md border-gray-300 border p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm";

    switch (field.type) {
        case 'textarea':
            return <textarea rows={3} className={commonClasses} placeholder={field.placeholder} disabled />;

        case 'dropdown':
            return (
                <select className={commonClasses} disabled>
                    <option value="">Select...</option>
                    {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            );

        case 'multiselect':
            return (
                <select multiple className={commonClasses} disabled>
                    {field.options?.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            );

        case 'boolean':
            return (
                <div className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300" disabled />
                    <span className="text-sm text-gray-600">Yes</span>
                </div>
            );

        case 'file':
        case 'image':
            return <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" disabled />;

        default:
            return <input type={field.type} className={commonClasses} placeholder={field.placeholder} disabled />;
    }
}
