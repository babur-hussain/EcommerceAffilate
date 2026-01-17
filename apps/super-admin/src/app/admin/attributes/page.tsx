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
    Check,
} from "lucide-react";

interface Attribute {
    _id: string;
    code: string;
    name: string;
    type: 'checkbox' | 'radio' | 'range' | 'boolean';
    isFilterable: boolean;
    isVariant: boolean;
    values: string[];
}

export default function AttributesPage() {
    const [attributes, setAttributes] = useState<Attribute[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        code: "",
        name: "",
        type: "checkbox" as Attribute['type'],
        isFilterable: true,
        isVariant: false,
        values: "" // Comma separated string for input
    });

    useEffect(() => {
        fetchAttributes();
    }, []);

    const fetchAttributes = async () => {
        try {
            const response = await api.get("/api/super-admin/attributes");
            setAttributes(response.data);
        } catch (error) {
            console.error("Error fetching attributes:", error);
            toast.error("Failed to load attributes");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                ...formData,
                values: formData.values.split(',').map(v => v.trim()).filter(v => v),
            };

            if (editingAttribute) {
                await api.put(`/api/super-admin/attributes/${editingAttribute._id}`, payload);
                toast.success("Attribute updated successfully");
            } else {
                await api.post("/api/super-admin/attributes", payload);
                toast.success("Attribute created successfully");
            }
            closeModal();
            fetchAttributes();
        } catch (error: any) {
            console.error("Error saving attribute:", error);
            toast.error(error.response?.data?.error || "Failed to save attribute");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will remove this attribute from all associated categories.")) return;

        try {
            await api.delete(`/api/super-admin/attributes/${id}`);
            toast.success("Attribute deleted successfully");
            fetchAttributes();
        } catch (error: any) {
            console.error("Error deleting attribute:", error);
            toast.error(error.response?.data?.error || "Failed to delete attribute");
        }
    };

    const openAddModal = () => {
        setEditingAttribute(null);
        setFormData({
            code: "",
            name: "",
            type: "checkbox",
            isFilterable: true,
            isVariant: false,
            values: "",
        });
        setIsModalOpen(true);
    };

    const openEditModal = (attr: Attribute) => {
        setEditingAttribute(attr);
        setFormData({
            code: attr.code,
            name: attr.name,
            type: attr.type,
            isFilterable: attr.isFilterable,
            isVariant: attr.isVariant,
            values: attr.values.join(", "),
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingAttribute(null);
    };

    const filteredAttributes = attributes.filter((attr) =>
        attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 max-w-7xl mx-auto p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attributes</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage global attributes for product filtering (e.g. Brand, Size, Color).
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Create Attribute
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search attributes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Name / Code</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Type</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase">Config</th>
                                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
                                        Loading attributes...
                                    </td>
                                </tr>
                            ) : filteredAttributes.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No attributes found. Create one to get started.
                                    </td>
                                </tr>
                            ) : (
                                filteredAttributes.map((attr) => (
                                    <tr key={attr._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{attr.name}</div>
                                            <div className="text-xs text-gray-500 font-mono bg-gray-100 px-1 py-0.5 rounded w-fit mt-1">{attr.code}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {attr.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                {attr.isFilterable && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Filterable</span>}
                                                {attr.isVariant && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">Variant</span>}
                                            </div>
                                            {attr.values.length > 0 && (
                                                <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                                    {attr.values.join(", ")}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(attr)}
                                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(attr._id)}
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
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {editingAttribute ? "Edit Attribute" : "Create Attribute"}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                            placeholder="e.g. Brand"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.code}
                                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                            disabled={!!editingAttribute} // Code is immutable after creation
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 disabled:bg-gray-100"
                                            placeholder="e.g. brand"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Unique identifier (slug).</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Type
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                                    >
                                        <option value="checkbox">Checkbox (Multiple Select)</option>
                                        <option value="radio">Radio (Single Select)</option>
                                        <option value="boolean">Boolean (Yes/No)</option>
                                        <option value="range">Range (Slider/Min-Max)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Default Values (Optional)
                                    </label>
                                    <textarea
                                        value={formData.values}
                                        onChange={(e) => setFormData({ ...formData, values: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                        placeholder="Option A, Option B, Option C"
                                        rows={3}
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Comma-separated list of predefined values.</p>
                                </div>

                                <div className="flex gap-6 pt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isFilterable}
                                            onChange={(e) => setFormData({ ...formData, isFilterable: e.target.checked })}
                                            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Filterable</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.isVariant}
                                            onChange={(e) => setFormData({ ...formData, isVariant: e.target.checked })}
                                            className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Is Variant (Size/Color)</span>
                                    </label>
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
                                {editingAttribute ? "Save Changes" : "Create Attribute"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
