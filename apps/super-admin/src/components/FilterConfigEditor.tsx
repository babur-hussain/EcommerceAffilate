import React, { useState } from 'react';
import { Plus, Trash2, GripVertical, Settings } from 'lucide-react';
import { FilterConfig } from '@/types';

interface FilterConfigEditorProps {
    filters: FilterConfig[];
    onChange: (filters: FilterConfig[]) => void;
}

export default function FilterConfigEditor({ filters, onChange }: FilterConfigEditorProps) {
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<FilterConfig>({
        key: '',
        label: '',
        type: 'select',
        options: [],
        required: false
    });
    const [optionsInput, setOptionsInput] = useState('');

    const handleAdd = () => {
        setEditForm({
            key: '',
            label: '',
            type: 'select',
            options: [],
            required: false
        });
        setOptionsInput('');
        setIsEditing(-1); // -1 indicates creating new
    };

    const handleEdit = (index: number) => {
        const filter = filters[index];
        setEditForm(filter);
        setOptionsInput(filter.options?.join(', ') || '');
        setIsEditing(index);
    };

    const handleDelete = (index: number) => {
        const newFilters = [...filters];
        newFilters.splice(index, 1);
        onChange(newFilters);
    };

    const handleSave = () => {
        if (!editForm.key || !editForm.label) return;

        const newFilter: FilterConfig = {
            ...editForm,
            options: ['select', 'multiselect', 'variant'].includes(editForm.type)
                ? optionsInput.split(',').map(s => s.trim()).filter(Boolean)
                : undefined
        };

        const newFilters = [...filters];
        if (isEditing === -1) {
            newFilters.push(newFilter);
        } else if (isEditing !== null) {
            newFilters[isEditing] = newFilter;
        }

        onChange(newFilters);
        setIsEditing(null);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                {filters.map((filter, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{filter.label}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <code className="bg-gray-100 px-1 py-0.5 rounded">{filter.key}</code>
                                <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded capitalize">{filter.type}</span>
                                {filter.required && <span className="text-red-500 font-medium">Required</span>}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleEdit(index)}
                                className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded"
                            >
                                <Settings className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(index)}
                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isEditing !== null ? (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <h4 className="font-medium mb-3">{isEditing === -1 ? 'Add New Filter' : 'Edit Filter'}</h4>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Label</label>
                            <input
                                type="text"
                                value={editForm.label}
                                onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g. Storage Capacity"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Key (Internal)</label>
                            <input
                                type="text"
                                value={editForm.key}
                                onChange={e => setEditForm({ ...editForm, key: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="e.g. storage"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                            <select
                                value={editForm.type}
                                onChange={e => setEditForm({ ...editForm, type: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            >
                                <option value="select">Select (Single)</option>
                                <option value="multiselect">Multi-Select</option>
                                <option value="variant">Variant (Creates Options)</option>
                                <option value="range">Range (Min/Max)</option>
                                <option value="text">Text Input</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 text-sm cursor-pointer mb-2 text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={editForm.required}
                                    onChange={e => setEditForm({ ...editForm, required: e.target.checked })}
                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                Required Field
                            </label>
                        </div>
                    </div>

                    {['select', 'multiselect', 'variant'].includes(editForm.type) && (
                        <div className="mb-4">
                            <label className="block text-xs font-medium text-gray-700 mb-1">Options (Comma separated)</label>
                            <input
                                type="text"
                                value={optionsInput}
                                onChange={e => setOptionsInput(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Red, Blue, Green, Black"
                            />
                        </div>
                    )}

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsEditing(null)}
                            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-200 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
                        >
                            Save Filter
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={handleAdd}
                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-gray-300 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
                >
                    <Plus className="h-4 w-4" /> Add Filter Configuration
                </button>
            )}
        </div>
    );
}
