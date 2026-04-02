'use client';

import React, { useEffect, useState } from 'react';
import { useServiceMarketplaceStore } from '@/store/useServiceMarketplaceStore';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, X, Check, FolderTree, Tag, Hash } from 'lucide-react';
import IconUploader from '@/components/shared/IconUploader';

export default function ServiceCategoriesPage() {
    const {
        categories, categoriesLoading, fetchCategories,
        createCategory, updateCategory, deleteCategory,
    } = useServiceMarketplaceStore();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: '', icon: '', description: '', isActive: true, priority: 0 });

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const resetForm = () => {
        setForm({ name: '', icon: '', description: '', isActive: true, priority: 0 });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateCategory(editingId, form);
            } else {
                await createCategory(form);
            }
            resetForm();
        } catch (error) {
            console.error('Failed to save category', error);
        }
    };

    const handleEdit = (cat: any) => {
        setForm({ name: cat.name, icon: cat.icon, description: cat.description, isActive: cat.isActive, priority: cat.priority || 0 });
        setEditingId(cat._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id);
            } catch (error: any) {
                alert(error?.response?.data?.error || 'Failed to delete category');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                        <FolderTree className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Service Categories</h2>
                        <p className="text-sm text-gray-500">Create and manage service categories like Home Repair, Beauty & Salon, etc.</p>
                    </div>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 border-0 shadow-sm bg-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50">
                            <Tag className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-0 shadow-sm bg-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                            <Check className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Active</p>
                            <p className="text-2xl font-bold text-gray-900">{categories.filter(c => c.isActive).length}</p>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-0 shadow-sm bg-white">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50">
                            <X className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Inactive</p>
                            <p className="text-2xl font-bold text-gray-900">{categories.filter(c => !c.isActive).length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Create/Edit Form */}
            {showForm && (
                <Card className="p-6 border-0 shadow-md bg-white ring-1 ring-indigo-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingId ? '✏️ Edit Category' : '➕ Create New Category'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g., Home Repair & Maintenance"
                                    required
                                    className="border-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <IconUploader
                                    value={form.icon}
                                    onChange={(url) => setForm({ ...form, icon: url })}
                                    label="Category Icon"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                                <Input
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Brief description of this category"
                                    className="border-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Priority (Order)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                                    className="border-gray-200 focus:border-indigo-400 focus:ring-indigo-400"
                                />
                                <p className="text-[10px] text-gray-500 mt-1 pl-1">Lower numbers appear first (e.g., 0, 1, 2)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label className="text-sm text-gray-700">Active</label>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                                <Check className="mr-2 h-4 w-4" />
                                {editingId ? 'Update' : 'Create'}
                            </Button>
                            <Button type="button" variant="outline" onClick={resetForm} className="border-gray-200 text-gray-600 hover:bg-gray-50">
                                <X className="mr-2 h-4 w-4" /> Cancel
                            </Button>
                        </div>
                    </form>
                </Card>
            )}

            {/* Categories Table */}
            <Card className="border-0 shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Slug</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-[80px]">Order</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((cat) => (
                            <TableRow key={cat._id} className="hover:bg-indigo-50/30 transition-colors">
                                <TableCell>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100/50 overflow-hidden">
                                        {(cat.icon && (cat.icon.startsWith('http') || cat.icon.startsWith('/'))) ? (
                                            <img src={cat.icon} alt={cat.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-xl">{cat.icon || '📁'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold text-gray-900">{cat.name}</TableCell>
                                <TableCell className="text-gray-400 text-xs font-mono">{cat.slug}</TableCell>
                                <TableCell className="text-center">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                        <Hash className="h-3 w-3" />
                                        {cat.priority || 0}
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm max-w-[200px] truncate">
                                    {cat.description || '—'}
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        cat.isActive
                                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                            : 'bg-red-50 text-red-600 ring-1 ring-red-200'
                                    }`}>
                                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
                                        {cat.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} className="h-8 w-8 hover:bg-indigo-50 hover:text-indigo-600">
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(cat._id)} className="h-8 w-8 hover:bg-red-50 hover:text-red-600">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!categoriesLoading && categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50">
                                            <FolderTree className="h-7 w-7 text-indigo-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">No categories yet</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Create your first service category to get started.</p>
                                        </div>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
