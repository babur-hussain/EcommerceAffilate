'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Category {
    _id: string;
    name: string;
    slug: string;
    posters: string[];
    image?: string;
    description?: string;
    isActive: boolean;
}

interface CategoryManagerProps {
    initialCategories: Category[];
    token: string;
}

export default function CategoryManager({ initialCategories, token }: CategoryManagerProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';

    const handleEdit = (category: Category) => {
        setEditingCategory({ ...category });
        setMessage(null);
    };

    const handleClose = () => {
        setEditingCategory(null);
        setMessage(null);
    };

    const cleanImageUrl = (url: string) => {
        // Sometimes image URLs might have quotes or issues if manually entered, but usually from Cloudinary they are clean.
        return url.replace(/['"]/g, '');
    };

    const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !editingCategory) return;

        setUploading(true);
        const formData = new FormData();
        for (let i = 0; i < e.target.files.length; i++) {
            formData.append('images', e.target.files[i]);
        }

        try {
            const res = await fetch(`${API_BASE}/upload/images`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setEditingCategory(prev => prev ? ({
                    ...prev,
                    posters: [...(prev.posters || []), ...data.images]
                }) : null);
                setMessage({ type: 'success', text: 'Images uploaded successfully' });
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to upload images' });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setMessage({ type: 'error', text: 'Failed to upload images' });
        } finally {
            setUploading(false);
        }
    };

    const removePoster = (index: number) => {
        if (!editingCategory) return;
        const newPosters = [...(editingCategory.posters || [])];
        newPosters.splice(index, 1);
        setEditingCategory({ ...editingCategory, posters: newPosters });
    };

    const handleSave = async () => {
        if (!editingCategory) return;

        try {
            const res = await fetch(`${API_BASE}/admin/categories/${editingCategory._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    posters: editingCategory.posters,
                    // We can add other fields here if we want to edit name etc.
                })
            });

            if (res.ok) {
                const updated = await res.json();
                setCategories(prev => prev.map(c => c._id === updated._id ? updated : c));
                setMessage({ type: 'success', text: 'Category updated successfully' });
                setTimeout(handleClose, 1000);
            } else {
                const data = await res.json();
                setMessage({ type: 'error', text: data.error || 'Failed to save category' });
            }

        } catch (error) {
            console.error('Save error:', error);
            setMessage({ type: 'error', text: 'Failed to save category' });
        }
    };

    return (
        <div>
            {/* Category List */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posters</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.map((category) => (
                            <tr key={category._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {category.posters?.length || 0} posters
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Manage Posters
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingCategory && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={handleClose}></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                                            Manage Posters for {editingCategory.name}
                                        </h3>
                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700">Add Posters</label>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={handlePosterUpload}
                                                disabled={uploading}
                                                className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-full file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100"
                                            />
                                            {uploading && <p className="text-sm text-blue-500 mt-2">Uploading...</p>}
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">Current Posters</h4>
                                            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                                                {(editingCategory.posters || []).map((poster, idx) => (
                                                    <div key={idx} className="relative group">
                                                        <img
                                                            src={cleanImageUrl(poster)}
                                                            alt={`Poster ${idx}`}
                                                            className="w-full h-24 object-cover rounded"
                                                        />
                                                        <button
                                                            onClick={() => removePoster(idx)}
                                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                                {(!editingCategory.posters || editingCategory.posters.length === 0) && (
                                                    <p className="text-xs text-gray-400 col-span-2">No posters uploaded yet.</p>
                                                )}
                                            </div>
                                        </div>

                                        {message && (
                                            <div className={`mt-4 text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                                {message.text}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Save Changes
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
