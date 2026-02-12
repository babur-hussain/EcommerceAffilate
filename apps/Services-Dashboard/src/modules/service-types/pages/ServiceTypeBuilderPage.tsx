'use client';

import React, { useEffect, useState } from 'react';
import { useServiceTypeStore } from '@/store/useServiceTypeStore';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ServiceType, ServiceField } from '@/lib/api/serviceType';
import { FieldEditorModal } from '../components/FieldBuilder/FieldEditorModal';
import { SchemaPreview } from '../components/SchemaPreview';
import { ArrowLeft, Save, Upload, Plus, Trash2, GripVertical, Edit2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ServiceTypeBuilderPage() {
    const router = useRouter();
    const params = useParams(); // might contain 'code' or 'new'
    const {
        currentServiceType,
        fetchServiceTypeByCode,
        createServiceType,
        updateServiceType,
        publishServiceType,
        setCurrentServiceType,
        isLoading
    } = useServiceTypeStore();

    const [formData, setFormData] = useState<Partial<ServiceType>>({
        name: '',
        code: '',
        countryCode: 'ALL',
        fields: []
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(null);

    const isNew = params.code === 'new';

    useEffect(() => {
        if (!isNew && params.code) {
            fetchServiceTypeByCode(params.code as string);
        } else {
            setCurrentServiceType(null); // Reset for new
            setFormData({
                name: '',
                code: '',
                countryCode: 'ALL',
                fields: []
            });
        }
    }, [isNew, params.code, fetchServiceTypeByCode, setCurrentServiceType]);

    useEffect(() => {
        if (currentServiceType && !isNew) {
            setFormData(currentServiceType);
        }
    }, [currentServiceType, isNew]);

    const handleSaveCommon = async () => {
        if (!formData.name || !formData.code) {
            toast.error('Name and Code are required');
            return;
        }

        if (isNew) {
            const created = await createServiceType(formData);
            if (created) router.push(`/service-types/${created.code}`);
        } else if (currentServiceType) {
            await updateServiceType(currentServiceType._id, formData);
        }
    };

    const handlePublish = async () => {
        if (confirm('Are you sure you want to PUBLISH this version? It cannot be edited after publishing.')) {
            if (currentServiceType) {
                await publishServiceType(currentServiceType._id);
            }
        }
    };

    const handleSaveField = (field: ServiceField) => {
        const newFields = [...(formData.fields || [])];

        if (editingFieldIndex !== null) {
            newFields[editingFieldIndex] = field;
        } else {
            // New field
            field.order = newFields.length;
            newFields.push(field);
        }

        setFormData(prev => ({ ...prev, fields: newFields }));
        setEditingFieldIndex(null);
    };

    const handleEditField = (index: number) => {
        setEditingFieldIndex(index);
        setIsModalOpen(true);
    };

    const handleDeleteField = (index: number) => {
        const newFields = [...(formData.fields || [])];
        newFields.splice(index, 1);
        setFormData(prev => ({ ...prev, fields: newFields }));
    };

    const handleMoveField = (index: number, direction: 'up' | 'down') => {
        const newFields = [...(formData.fields || [])];
        if (direction === 'up' && index > 0) {
            [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
        } else if (direction === 'down' && index < newFields.length - 1) {
            [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
        }
        // Update 'order' property for all
        newFields.forEach((f, i) => f.order = i);
        setFormData(prev => ({ ...prev, fields: newFields }));
    };

    const isPublished = currentServiceType?.status === 'PUBLISHED';

    if (!isNew && isLoading) return <div>Loading Builder...</div>;

    return (
        <div className="space-y-6 h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b pb-4 bg-white p-4 -mx-4 -mt-4 sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => router.back()}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back
                    </Button>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight">{isNew ? 'Create Service Type' : `Edit ${formData.name}`}</h2>
                        <div className="flex gap-2 text-sm text-gray-500 font-mono">
                            {formData.code && <span>{formData.code}</span>}
                            {currentServiceType && <span>v{currentServiceType.version}</span>}
                            {currentServiceType && (
                                <span className={isPublished ? 'text-green-600' : 'text-yellow-600'}>
                                    {currentServiceType.status}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {!isPublished && (
                        <>
                            <Button variant="outline" onClick={handleSaveCommon}>
                                <Save className="h-4 w-4 mr-2" /> Save Draft
                            </Button>
                            {!isNew && (
                                <Button onClick={handlePublish}>
                                    <Upload className="h-4 w-4 mr-2" /> Publish Version
                                </Button>
                            )}
                        </>
                    )}
                    {isPublished && (
                        <div className="text-sm text-gray-500 italic px-2">
                            Published versions are read-only.
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content: Split View */}
            <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden min-h-0">

                {/* Left: Configuration & Fields List */}
                <div className="col-span-12 md:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2 pb-20">

                    {/* Basic Info Card */}
                    <div className="bg-white p-6 rounded-md border shadow-sm space-y-4">
                        <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full rounded-md border p-2"
                                    disabled={isPublished}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Code (Unique)</label>
                                <input
                                    value={formData.code}
                                    onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="w-full rounded-md border p-2 font-mono uppercase"
                                    disabled={!isNew} // Code shouldn't change after creation? OR allow if draft.
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Country Code</label>
                                <input
                                    value={formData.countryCode}
                                    onChange={e => setFormData({ ...formData, countryCode: e.target.value.toUpperCase() })}
                                    className="w-full rounded-md border p-2 uppercase"
                                    disabled={isPublished}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fields Builder */}
                    <div className="bg-white p-6 rounded-md border shadow-sm flex-1">
                        <div className="flex justify-between items-center mb-4 pb-2 border-b">
                            <h3 className="text-lg font-medium">Form Fields</h3>
                            <Button size="sm" onClick={() => { setEditingFieldIndex(null); setIsModalOpen(true); }} disabled={isPublished}>
                                <Plus className="h-4 w-4 mr-2" /> Add Field
                            </Button>
                        </div>

                        <div className="space-y-2">
                            {formData.fields?.length === 0 && (
                                <div className="text-center text-gray-400 py-8 border-2 border-dashed rounded-md">
                                    No fields defined. Click "Add Field" to start building.
                                </div>
                            )}

                            {formData.fields?.map((field, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border rounded-md group">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col text-gray-400">
                                            {/* Simple Up/Down controls instead of full DnD for MVP */}
                                            {!isPublished && (
                                                <>
                                                    <button onClick={() => handleMoveField(index, 'up')} className="hover:text-black">▲</button>
                                                    <button onClick={() => handleMoveField(index, 'down')} className="hover:text-black">▼</button>
                                                </>
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium">{field.label}</div>
                                            <div className="text-xs text-gray-500 font-mono">
                                                {field.key} | {field.type} {field.required ? '| Required' : ''}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="icon" variant="ghost" onClick={() => handleEditField(index)} disabled={isPublished}>
                                            <Edit2 className="h-4 w-4 text-gray-600" />
                                        </Button>
                                        <Button size="icon" variant="ghost" onClick={() => handleDeleteField(index)} disabled={isPublished}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Live Preview */}
                <div className="col-span-12 md:col-span-5 hidden md:block h-full overflow-hidden pb-20">
                    <SchemaPreview fields={formData.fields || []} />
                </div>

            </div>

            <FieldEditorModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveField}
                initialField={editingFieldIndex !== null && formData.fields ? formData.fields[editingFieldIndex] : undefined}
            />
        </div>
    );
}
