'use client';

import React, { useEffect, useState } from 'react';
import { useServiceMarketplaceStore } from '@/store/useServiceMarketplaceStore';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Pencil, Trash2, X, Check, Wrench, Hash } from 'lucide-react';
import IconUploader from '@/components/shared/IconUploader';

export default function ServiceTypesPage() {
    const {
        categories, fetchCategories,
        subCategories, fetchSubCategories,
        serviceTypes, serviceTypesLoading, fetchServiceTypes,
        createServiceType, updateServiceType, deleteServiceType,
    } = useServiceMarketplaceStore();

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterCategoryId, setFilterCategoryId] = useState('');
    const [form, setForm] = useState({
        categoryId: '', subCategoryId: '', name: '', icon: '', description: '', isActive: true, priority: 0
    });

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    // Fetch sub-categories when filter category or form category changes
    useEffect(() => {
        const catId = showForm ? form.categoryId : filterCategoryId;
        if (catId) {
            fetchSubCategories(catId);
        } else {
            fetchSubCategories();
        }
    }, [fetchSubCategories, filterCategoryId, form.categoryId, showForm]);

    // Fetch service types based on filter
    useEffect(() => {
        if (filterCategoryId) {
            fetchServiceTypes(undefined, filterCategoryId);
        } else {
            fetchServiceTypes();
        }
    }, [fetchServiceTypes, filterCategoryId]);

    const resetForm = () => {
        setForm({ categoryId: '', subCategoryId: '', name: '', icon: '', description: '', isActive: true, priority: 0 });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateServiceType(editingId, form);
            } else {
                await createServiceType(form);
            }
            resetForm();
        } catch (error) {
            console.error('Failed to save service type', error);
        }
    };

    const handleEdit = (st: any) => {
        setForm({
            categoryId: st.categoryId?._id || st.categoryId || '',
            subCategoryId: st.subCategoryId?._id || st.subCategoryId || '',
            name: st.name,
            icon: st.icon,
            description: st.description,
            isActive: st.isActive,
            priority: st.priority || 0,
        });
        setEditingId(st._id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this service type?')) {
            try {
                await deleteServiceType(id);
            } catch (error: any) {
                alert(error?.response?.data?.error || 'Failed to delete service type');
            }
        }
    };

    // Filter sub-categories for the form based on selected category
    const formSubCategories = form.categoryId
        ? subCategories.filter(sc => {
            const catId = sc.categoryId?._id || sc.categoryId;
            return catId === form.categoryId;
          })
        : subCategories;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                        <Wrench className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Service Types</h2>
                        <p className="text-sm text-gray-500">Manage specific service types like Pipe Fitting, AC Repair, Wiring, etc.</p>
                    </div>
                </div>
                <Button
                    onClick={() => { resetForm(); setShowForm(true); }}
                    className="bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-200 transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Service Type
                </Button>
            </div>

            {/* Filter */}
            <Card className="p-4 border-0 shadow-sm bg-white flex items-center gap-4">
                <label className="text-sm font-medium text-gray-600">Filter by category:</label>
                <select
                    value={filterCategoryId}
                    onChange={(e) => setFilterCategoryId(e.target.value)}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-all"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                    ))}
                </select>
                <div className="ml-auto text-sm text-gray-400">{serviceTypes.length} results</div>
            </Card>

            {/* Create/Edit Form */}
            {showForm && (
                <Card className="p-6 border-0 shadow-md bg-white ring-1 ring-amber-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingId ? '✏️ Edit Service Type' : '➕ Create New Service Type'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Category *</label>
                                <select
                                    value={form.categoryId}
                                    onChange={(e) => setForm({ ...form, categoryId: e.target.value, subCategoryId: '' })}
                                    required
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Sub-Category <span className="text-gray-400">(optional)</span></label>
                                <select
                                    value={form.subCategoryId}
                                    onChange={(e) => setForm({ ...form, subCategoryId: e.target.value })}
                                    disabled={!form.categoryId}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">None (all sub-categories)</option>
                                    {formSubCategories.map((sub) => (
                                        <option key={sub._id} value={sub._id}>{sub.icon} {sub.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Name *</label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="e.g., Pipe Fitting, AC Repair"
                                    required
                                    className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <IconUploader
                                    value={form.icon}
                                    onChange={(url) => setForm({ ...form, icon: url })}
                                    label="Service Type Icon"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                                <Input
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Brief description"
                                    className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Priority (Order)</label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={form.priority}
                                    onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })}
                                    className="border-gray-200 focus:border-amber-400 focus:ring-amber-400"
                                />
                                <p className="text-[10px] text-gray-500 mt-1 pl-1">Lower numbers appear first (e.g., 0, 1, 2)</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <input
                                type="checkbox"
                                checked={form.isActive}
                                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                            <label className="text-sm text-gray-700">Active</label>
                        </div>
                        <div className="flex gap-2 pt-2">
                            <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
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

            {/* Service Types Table */}
            <Card className="border-0 shadow-sm bg-white overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/80 hover:bg-gray-50/80">
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Icon</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sub-Category</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-center w-[80px]">Order</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {serviceTypes.map((st) => (
                            <TableRow key={st._id} className="hover:bg-amber-50/30 transition-colors">
                                <TableCell>
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 border border-amber-100/50 overflow-hidden">
                                        {(st.icon && (st.icon.startsWith('http') || st.icon.startsWith('/'))) ? (
                                            <img src={st.icon} alt={st.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-xl">{st.icon || '🔧'}</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="font-semibold text-gray-900">{st.name}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                                        {(st as any).categoryId?.name || '—'}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {st.subCategoryId ? (
                                        <span className="inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-xs font-medium text-violet-700">
                                            {(st.subCategoryId as any)?.name || '—'}
                                        </span>
                                    ) : (
                                        <span className="text-xs text-gray-400">—</span>
                                    )}
                                </TableCell>
                                <TableCell className="text-center">
                                    <span className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                                        <Hash className="h-3 w-3" />
                                        {st.priority || 0}
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm max-w-[180px] truncate">
                                    {st.description || '—'}
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                        st.isActive
                                            ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                                            : 'bg-red-50 text-red-600 ring-1 ring-red-200'
                                    }`}>
                                        <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${st.isActive ? 'bg-emerald-500' : 'bg-red-400'}`} />
                                        {st.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-1">
                                        <Button variant="ghost" size="icon" onClick={() => handleEdit(st)} className="h-8 w-8 hover:bg-amber-50 hover:text-amber-600">
                                            <Pencil className="h-3.5 w-3.5" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(st._id)} className="h-8 w-8 hover:bg-red-50 hover:text-red-600">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!serviceTypesLoading && serviceTypes.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="h-32 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50">
                                            <Wrench className="h-7 w-7 text-amber-300" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">No service types yet</p>
                                            <p className="text-xs text-gray-500 mt-0.5">Create service types under categories for providers to list their services.</p>
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
