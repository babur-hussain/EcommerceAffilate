'use client';

import React, { useEffect, useState } from 'react';
import { useServiceMarketplaceStore } from '@/store/useServiceMarketplaceStore';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, X, Check, Layers, Hash } from 'lucide-react';
import IconUploader from '@/components/shared/IconUploader';

export default function ServiceSubCategoriesPage() {
    const {
        categories, fetchCategories,
        subCategories, subCategoriesLoading, fetchSubCategories,
        createSubCategory, updateSubCategory, deleteSubCategory,
    } = useServiceMarketplaceStore();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterCategoryId, setFilterCategoryId] = useState('');
    const [form, setForm] = useState({
        categoryId: '', name: '', icon: '', description: '', isActive: true, priority: 0
    });

    useEffect(() => { fetchCategories(); }, [fetchCategories]);
    useEffect(() => {
        fetchSubCategories(filterCategoryId || undefined);
    }, [fetchSubCategories, filterCategoryId]);

    const resetForm = () => {
        setForm({ categoryId: '', name: '', icon: '', description: '', isActive: true, priority: 0 });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateSubCategory(editingId, form);
            } else {
                await createSubCategory(form);
            }
            resetForm();
        } catch (error) {
            console.error('Failed to save sub-category', error);
        }
    };

    const handleEdit = (sub: any) => {
        setForm({
            categoryId: sub.categoryId?._id || sub.categoryId,
            name: sub.name,
            icon: sub.icon,
            description: sub.description,
            isActive: sub.isActive,
            priority: sub.priority || 0,
        });
        setEditingId(sub._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this sub-category?')) {
            try {
                await deleteSubCategory(id);
            } catch (error: any) {
                alert(error?.response?.data?.error || 'Failed to delete sub-category');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50">
                        <Layers className="h-5 w-5 text-violet-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sub-Categories</h2>
                        <p className="text-sm text-gray-500">Manage sub-categories like Plumbing, Electrician, Haircut, etc.</p>
                    </div>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm shadow-violet-200 transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Sub-Category
                </Button>
            </div>

            {/* Filter */}
            <Card className="p-4 border-0 shadow-sm bg-white flex items-center gap-4">
                <label className="text-sm font-medium text-gray-600">Filter by category:</label>
                <select
                    value={filterCategoryId}
                    onChange={(e) => setFilterCategoryId(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400 transition-all"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                    ))}
                </select>
                <div className="ml-auto text-sm text-gray-400">{subCategories.length} results</div>
            </Card>

            {/* Create/Edit Form */}
            {showForm && (
                <Card className="p-6 border-0 shadow-md bg-white ring-1 ring-violet-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingId ? '✏️ Edit Sub-Category' : '➕ Create New Sub-Category'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Parent Category *</label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                    required
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-400"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g., Plumbing"
                                    required
                                    className="border-gray-200 focus:border-violet-400 focus:ring-violet-400"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <IconUploader
                                    value={form.icon}
                                    onChange={(url) => setForm({ ...form, icon: url })}
                                    label="Sub-Category Icon"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                                <Input
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Brief description"
                                    className="border-gray-200 focus:border-violet-400 focus:ring-violet-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Priority (Order)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                                    className="border-gray-200 focus:border-violet-400 focus:ring-violet-400"
                                />
                                <p className="text-[10px] text-gray-500 mt-1 pl-1">Lower numbers appear first (e.g., 0, 1, 2)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                className="rounded border-gray-300 text-violet-600 focus:ring-violet-500"
                            />
                            <label className="text-sm text-gray-700">Active</label>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">
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

            {/* Sub-Categories Table */}
            <Card className="border-0 shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent Category</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-[80px]">Order</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {subCategories.map((sub) => (
                            <TableRow key={sub._id} className="hover:bg-violet-50/30 transition-colors">
                                <TableCell>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 border border-violet-100/50 overflow-hidden">
                                        {(sub.icon && (sub.icon.startsWith('http') || sub.icon.startsWith('/'))) ? (
                                            <img src={sub.icon} alt={sub.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-xl">{sub.icon || '📋'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold text-gray-900">{sub.name}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                                        {sub.categoryId?.name || 'Unknown'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                        <Hash className="h-3 w-3" />
                                        {sub.priority || 0}
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm max-w-[200px] truncate">
                                    {sub.description || '—'}
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        sub.isActive
                                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                            : 'bg-red-50 text-red-600 ring-1 ring-red-200'
                                    }`}>
                                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${sub.isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
                                        {sub.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(sub)} className="h-8 w-8 hover:bg-violet-50 hover:text-violet-600">
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(sub._id)} className="h-8 w-8 hover:bg-red-50 hover:text-red-600">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!subCategoriesLoading && subCategories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                                            <Layers className="h-7 w-7 text-violet-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">No sub-categories yet</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Create your first sub-category to organize services.</p>
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
