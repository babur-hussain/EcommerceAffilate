"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
    Plus,
    Pencil,
    Trash2,
    Search,
    X,
    Loader2,
    Image as ImageIcon,
    Upload,
    ArrowRight,
} from "lucide-react";

import Link from "next/link";

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    icon?: string;
    isActive: boolean;
    order: number;
    parentCategory?: {
        _id: string;
        name: string;
    };
    group?: string; // Main Title for subcategory grouping
    posters?: string[];
}


export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        image: "",
        icon: "",
        order: 0,
        isActive: true,
        parentCategory: "",
        group: "",
        posters: [] as string[],
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/super-admin/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            toast.error("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingCategory) {
                await api.put(`/api/super-admin/categories/${editingCategory._id}`, formData);
                toast.success("Category updated successfully");
            } else {
                await api.post("/api/super-admin/categories", formData);
                toast.success("Category created successfully");
            }
            closeModal();
            fetchCategories();
        } catch (error: any) {
            console.error("Error saving category:", error);
            toast.error(error.response?.data?.error || "Failed to save category");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await api.delete(`/api/super-admin/categories/${id}`);
            toast.success("Category deleted successfully");
            fetchCategories();
        } catch (error: any) {
            console.error("Error deleting category:", error);
            toast.error(error.response?.data?.error || "Failed to delete category");
        }
    };



    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'icon') => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append('image', file);

            const response = await api.post('/api/upload/image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFormData(prev => ({
                ...prev,
                [field]: response.data.imageUrl
            }));
            toast.success(`${field === 'image' ? 'Image' : 'Icon'} uploaded successfully`);
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    const handlePosterUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (formData.posters.length >= 10) {
            toast.error("Maximum 10 banners allowed");
            return;
        }

        try {
            setUploading(true);
            const uploadFormData = new FormData();
            uploadFormData.append('image', file);

            const response = await api.post('/api/upload/image', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setFormData(prev => ({
                ...prev,
                posters: [...prev.posters, response.data.imageUrl]
            }));
            toast.success("Banner uploaded successfully");
        } catch (error) {
            console.error('Error uploading banner:', error);
            toast.error('Failed to upload banner');
        } finally {
            setUploading(false);
        }
    };

    const removePoster = (index: number) => {
        setFormData(prev => ({
            ...prev,
            posters: prev.posters.filter((_, i) => i !== index)
        }));
    };

    const openAddModal = () => {
        setEditingCategory(null);
        setFormData({
            name: "",
            description: "",
            image: "",
            icon: "",
            order: 0,
            isActive: true,
            parentCategory: "",
            group: "",
            posters: [],
        });
        setIsModalOpen(true);
    };

    const openEditModal = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || "",
            image: category.image || "",
            icon: category.icon || "",
            order: category.order || 0,
            isActive: category.isActive,
            parentCategory: category.parentCategory?._id || "",
            group: category.group || "",
            posters: category.posters || [],
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const filteredCategories = categories
        .filter((cat) => !cat.parentCategory) // Only show parent categories
        .filter((cat) => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage product categories and subcategories
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Category
                </button>
            </div>

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    />
                </div>
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Image</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Name</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Slug</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Order</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-right">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredCategories.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        No categories found
                                    </td>
                                </tr>
                            ) : (
                                filteredCategories.map((category) => (
                                    <tr key={category._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {category.image || category.icon ? (
                                                    <img
                                                        src={category.image || category.icon}
                                                        alt={category.name}
                                                        className={`h-full w-full ${category.image ? 'object-cover' : 'object-contain p-1'}`}
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 text-gray-400" />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {category.name}
                                            {category.parentCategory && (
                                                <span className="ml-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                                    Sub of {category.parentCategory.name}
                                                </span>
                                            )}
                                            {category.group && (
                                                <span className="ml-2 text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                                                    {category.group}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{category.slug}</td>
                                        <td className="px-6 py-4 text-gray-500">{category.order}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {category.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/categories/${category._id}`}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Manage Subcategories"
                                                >
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => openEditModal(category)}
                                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category._id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingCategory ? "Edit Category" : "Add Category"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6 custom-scrollbar">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                        placeholder="e.g. Electronics"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) =>
                                            setFormData({ ...formData, description: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                        placeholder="Category description..."
                                        rows={2}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Parent Category
                                        </label>
                                        <select
                                            value={formData.parentCategory}
                                            onChange={(e) =>
                                                setFormData({ ...formData, parentCategory: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                                        >
                                            <option value="">None (Top Level)</option>
                                            {categories
                                                .filter((c) => c._id !== editingCategory?._id) // Prevent circular reference
                                                .map((c) => {
                                                    // Calculate nesting level for indentation
                                                    let level = 0;
                                                    let current = c;
                                                    const visited = new Set();

                                                    while (current.parentCategory && !visited.has(current._id)) {
                                                        visited.add(current._id);
                                                        level++;
                                                        current = categories.find(cat => cat._id === current.parentCategory?._id) || current;
                                                        if (!current.parentCategory) break;
                                                    }

                                                    const indent = '→ '.repeat(level);
                                                    return (
                                                        <option key={c._id} value={c._id}>
                                                            {indent}{c.name}
                                                        </option>
                                                    );
                                                })}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Group Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.group}
                                            onChange={(e) =>
                                                setFormData({ ...formData, group: e.target.value })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                            placeholder="e.g. Staples"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                        <div className="space-y-2">
                                            {formData.image && (
                                                <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                    <button type="button" onClick={() => setFormData({ ...formData, image: "" })} className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100">
                                                        <X className="h-3 w-3 text-gray-600" />
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <label className="flex-1 cursor-pointer border border-gray-300 border-dashed rounded-lg px-2 py-1.5 hover:bg-gray-50 flex items-center justify-center gap-2">
                                                    <Upload className="h-3.5 w-3.5 text-gray-500" />
                                                    <span className="text-xs text-gray-600">Upload</span>
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'image')} disabled={uploading} />
                                                </label>
                                            </div>
                                            <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 outline-none" placeholder="Or URL..." />
                                        </div>
                                    </div>

                                    {/* Icon Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                        <div className="space-y-2">
                                            {formData.icon && (
                                                <div className="relative w-full h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                                                    <img src={formData.icon} alt="Preview" className="w-12 h-12 object-contain" />
                                                    <button type="button" onClick={() => setFormData({ ...formData, icon: "" })} className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-sm hover:bg-gray-100">
                                                        <X className="h-3 w-3 text-gray-600" />
                                                    </button>
                                                </div>
                                            )}
                                            <div className="flex gap-2">
                                                <label className="flex-1 cursor-pointer border border-gray-300 border-dashed rounded-lg px-2 py-1.5 hover:bg-gray-50 flex items-center justify-center gap-2">
                                                    <Upload className="h-3.5 w-3.5 text-gray-500" />
                                                    <span className="text-xs text-gray-600">Upload</span>
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'icon')} disabled={uploading} />
                                                </label>
                                            </div>
                                            <input type="text" value={formData.icon} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:border-primary-500 outline-none" placeholder="Or URL..." />
                                        </div>
                                    </div>
                                </div>


                                {/* Banners Section */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category Banners (Max 10)
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                                        {formData.posters.map((poster, index) => (
                                            <div key={index} className="relative group aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={poster} alt={`Banner ${index + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removePoster(index)}
                                                    className="absolute top-1 right-1 p-1 bg-white/90 rounded-full shadow-sm hover:bg-red-50 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                        {formData.posters.length < 10 && (
                                            <label className="flex flex-col items-center justify-center aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 hover:border-gray-400 transition-colors">
                                                <div className="flex flex-col items-center gap-1">
                                                    <Upload className="h-5 w-5 text-gray-400" />
                                                    <span className="text-xs text-gray-500 font-medium">Add Banner</span>
                                                </div>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    className="hidden"
                                                    onChange={handlePosterUpload}
                                                    disabled={uploading}
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        These banners will be displayed in the app when this category is selected.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Order
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.order}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    order: parseInt(e.target.value) || 0,
                                                })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                        />
                                    </div>
                                    <div className="flex items-center pt-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formData.isActive}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, isActive: e.target.checked })
                                                }
                                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">
                                                Active
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 shrink-0">
                            <button
                                type="button"
                                onClick={closeModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                {editingCategory ? "Save Changes" : "Create Category"}
                            </button>
                        </div>
                    </div>
                </div >
            )
            }
        </div >
    );
}
