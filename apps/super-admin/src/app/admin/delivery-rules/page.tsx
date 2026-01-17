"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
    Plus,
    Pencil,
    Trash2,
    Loader2,
    X,
} from "lucide-react";

interface DeliveryRule {
    _id: string;
    name: string;
    minDistance: number;
    maxDistance: number;
    timeValue: number;
    timeUnit: 'hours' | 'days';
    isActive: boolean;
}

export default function DeliveryRulesPage() {
    const [rules, setRules] = useState<DeliveryRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRule, setEditingRule] = useState<DeliveryRule | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        minDistance: 0,
        maxDistance: 0,
        timeValue: 1,
        timeUnit: 'days' as 'hours' | 'days',
        isActive: true,
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            setLoading(true);
            const response = await api.get("/api/delivery-rules");
            setRules(response.data);
        } catch (error) {
            console.error("Error fetching rules:", error);
            toast.error("Failed to load delivery rules");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (Number(formData.minDistance) >= Number(formData.maxDistance)) {
            toast.error("Min Distance must be less than Max Distance");
            return;
        }

        setSubmitting(true);

        try {
            if (editingRule) {
                await api.put(`/api/delivery-rules/${editingRule._id}`, formData);
                toast.success("Rule updated successfully");
            } else {
                await api.post("/api/delivery-rules", formData);
                toast.success("Rule created successfully");
            }
            closeModal();
            fetchRules();
        } catch (error: any) {
            console.error("Error saving rule:", error);
            toast.error(error.response?.data?.message || "Failed to save rule");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this rule?")) return;

        try {
            await api.delete(`/api/delivery-rules/${id}`);
            toast.success("Rule deleted successfully");
            fetchRules();
        } catch (error: any) {
            console.error("Error deleting rule:", error);
            toast.error(error.response?.data?.message || "Failed to delete rule");
        }
    };

    const openAddModal = () => {
        setEditingRule(null);
        setFormData({
            name: "",
            minDistance: 0,
            maxDistance: 10,
            timeValue: 1,
            timeUnit: 'days',
            isActive: true,
        });
        setIsModalOpen(true);
    };

    const openEditModal = (rule: DeliveryRule) => {
        setEditingRule(rule);
        setFormData({
            name: rule.name,
            minDistance: rule.minDistance,
            maxDistance: rule.maxDistance,
            timeValue: rule.timeValue,
            timeUnit: rule.timeUnit,
            isActive: rule.isActive,
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingRule(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Delivery Rules</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage delivery time calculations based on distance
                    </p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Rule
                </button>
            </div>

            {/* Rules Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Name</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Distance Range (km)</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Added Time</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                                        </div>
                                    </td>
                                </tr>
                            ) : rules.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No delivery rules found
                                    </td>
                                </tr>
                            ) : (
                                rules.map((rule) => (
                                    <tr key={rule._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">{rule.name}</td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {rule.minDistance} - {rule.maxDistance} km
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            +{rule.timeValue} {rule.timeUnit}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rule.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {rule.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(rule)}
                                                    className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(rule._id)}
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
                                {editingRule ? "Edit Rule" : "Add Delivery Rule"}
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
                                        Rule Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) =>
                                            setFormData({ ...formData, name: e.target.value })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                        placeholder="e.g. Local Delivery"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Distance (km)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.minDistance}
                                            onChange={(e) =>
                                                setFormData({ ...formData, minDistance: parseFloat(e.target.value) || 0 })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Distance (km)
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.maxDistance}
                                            onChange={(e) =>
                                                setFormData({ ...formData, maxDistance: parseFloat(e.target.value) || 0 })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Time Value
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.timeValue}
                                            onChange={(e) =>
                                                setFormData({ ...formData, timeValue: parseFloat(e.target.value) || 0 })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Unit
                                        </label>
                                        <select
                                            value={formData.timeUnit}
                                            onChange={(e) =>
                                                setFormData({ ...formData, timeUnit: e.target.value as 'hours' | 'days' })
                                            }
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                                        >
                                            <option value="hours">Hours</option>
                                            <option value="days">Days</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex items-center pt-2">
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
                                            Active Rule
                                        </span>
                                    </label>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                        {editingRule ? "Save Changes" : "Create Rule"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
