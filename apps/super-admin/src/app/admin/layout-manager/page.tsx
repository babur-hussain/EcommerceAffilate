"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import api from "@/lib/api";

interface ILayout {
    _id: string;
    slug: string;
    name: string;
    description: string;
    isActive: boolean;
    version: number;
    updatedAt: string;
}

export default function AdvancedLayoutsPage() {
    const [layouts, setLayouts] = useState<ILayout[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLayouts();
    }, []);

    const fetchLayouts = async () => {
        try {
            const res = await api.get("/api/admin/layouts");
            setLayouts(res.data);
        } catch (error) {
            console.error("Failed to fetch layouts", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this layout?")) return;

        try {
            await api.delete(`/api/admin/layouts/${id}`);
            fetchLayouts();
        } catch (error: any) {
            console.error("Error deleting layout", error);
            const errData = error.response?.data || {};
            alert(`Failed to delete layout: ${errData.error || error.message}`);
        }
    };

    if (loading) {
        return <div>Loading layouts...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Advanced Layouts</h1>
                    <p className="text-gray-500">Manage Server-Driven UI layouts with advanced styling</p>
                </div>
                <Link
                    href="/admin/layout-manager/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Create Layout
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name / Slug
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Version
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Last Updated
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {layouts.map((layout) => (
                            <tr key={layout._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{layout.name}</span>
                                        <span className="text-xs text-gray-500 font-mono">{layout.slug}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    v{layout.version}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${layout.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {layout.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {format(new Date(layout.updatedAt), 'MMM d, yyyy HH:mm')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex justify-end gap-2">
                                        <Link
                                            href={`/admin/layout-manager/${layout._id}`}
                                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(layout._id)}
                                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {layouts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No layouts found. Create one to get started.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
