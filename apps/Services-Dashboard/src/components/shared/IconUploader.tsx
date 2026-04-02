'use client';

import React, { useRef, useState } from 'react';
import { apiClient } from '@/lib/api';
import { Upload, X, Loader2 } from 'lucide-react';

interface IconUploaderProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function IconUploader({ value, onChange, label = 'Icon' }: IconUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('icon', file);

            const { data } = await apiClient.post<any>('/api/upload/service-icon', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (data.imageUrl) {
                onChange(data.imageUrl);
            }
        } catch (error) {
            console.error('Failed to upload icon', error);
            alert('Failed to upload icon. Please try again.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const isImageUrl = value && (value.startsWith('http://') || value.startsWith('https://'));

    return (
        <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>
            <div className="flex items-center gap-3">
                {/* Preview */}
                <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 overflow-hidden transition-all hover:border-indigo-300 hover:bg-indigo-50/30">
                    {uploading ? (
                        <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
                    ) : isImageUrl ? (
                        <>
                            <img src={value} alt="icon" className="h-full w-full object-cover rounded-xl" />
                            <button
                                type="button"
                                onClick={() => onChange('')}
                                className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600 transition-colors"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </>
                    ) : value ? (
                        <span className="text-2xl">{value}</span>
                    ) : (
                        <Upload className="h-5 w-5 text-gray-400" />
                    )}
                </div>

                {/* Upload Button */}
                <div className="flex flex-col gap-1">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-all disabled:opacity-50"
                    >
                        <Upload className="h-3 w-3" />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                    </button>
                    <span className="text-[10px] text-gray-400">PNG, JPG up to 5MB</span>
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                />
            </div>
        </div>
    );
}
