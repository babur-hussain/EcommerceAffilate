"use client";

import React, { useEffect, useState } from "react";
import { Save, ArrowLeft, Code } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LayoutEditorPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const isNew = params.id === 'new';

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        isActive: true,
        components: [] as any[],
        meta: {}
    });

    const [jsonContent, setJsonContent] = useState('[]');
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isNew) {
            fetchLayout();
        }
    }, [params.id]);

    const fetchLayout = async () => {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/layouts/${params.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    name: data.name,
                    slug: data.slug,
                    description: data.description || '',
                    isActive: data.isActive,
                    components: data.components,
                    meta: data.meta || {}
                });
                setJsonContent(JSON.stringify(data.components, null, 2));
            } else {
                setError("Failed to load layout");
            }
        } catch (err) {
            console.error(err);
            setError("Error loading layout");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');

        try {
            // Validate JSON
            let parsedComponents;
            try {
                parsedComponents = JSON.parse(jsonContent);
                if (!Array.isArray(parsedComponents)) {
                    throw new Error("Root element must be an array of components");
                }
            } catch (e: any) {
                setError(`Invalid JSON: ${e.message}`);
                setSaving(false);
                return;
            }

            const payload = {
                ...formData,
                components: parsedComponents
            };

            const token = localStorage.getItem("authToken");
            const url = isNew
                ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/layouts`
                : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/api/admin/layouts/${params.id}`;

            const method = isNew ? 'POST' : 'PUT';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                router.push('/admin/layout-manager');
            } else {
                const errData = await res.json();
                setError(errData.error || "Failed to save layout");
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Error saving layout");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Link href="/admin/layout-manager" className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="h-5 w-5 text-gray-500" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'Create New Layout' : 'Edit Layout'}</h1>
                        <p className="text-gray-500">{isNew ? 'Define a new SDUI layout structure' : `Editing: ${formData.slug}`}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {error && <span className="text-red-600 text-sm font-medium">{error}</span>}
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Layout'}
                    </button>
                </div>
            </div>

            {/* Metadata Form */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Layout Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                            placeholder="e.g., Black Friday Home"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (Unique ID)</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 font-mono text-sm text-gray-900"
                            placeholder="e.g., black-friday-home"
                            disabled={!isNew}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 text-gray-900"
                            placeholder="Internal description"
                        />
                    </div>
                    <div className="flex items-end h-full pb-3">
                        <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition cursor-pointer"
                            />
                            <span className="text-gray-900 font-medium select-none">Set as Active</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex overflow-hidden">

                {/* Visual Section Tree (Enhancement) */}
                <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
                    <div className="p-3 border-b border-gray-200 font-medium text-xs text-gray-500 uppercase tracking-wider">
                        Sections
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {(() => {
                            try {
                                const sections = JSON.parse(jsonContent);
                                if (Array.isArray(sections)) {
                                    return sections.map((section: any, idx: number) => (
                                        <div key={idx} className="p-2 bg-white border border-gray-200 rounded text-sm hover:border-primary-400 cursor-default">
                                            <div className="font-semibold text-gray-900 truncate">
                                                {section.props?.title || section.id || `Section ${idx + 1}`}
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono mt-1 flex justify-between">
                                                <span>{section.type}</span>
                                                {section.dataSource && <span className="text-blue-600">⚡ Dynamic</span>}
                                            </div>
                                        </div>
                                    ));
                                }
                            } catch (e) {
                                return <div className="p-3 text-xs text-red-500">Invalid JSON</div>;
                            }
                            return <div className="p-3 text-xs text-gray-400">No components defined</div>;
                        })()}
                    </div>
                </div>

                {/* JSON Editor */}
                <div className="flex-1 flex flex-col">
                    <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            Component Structure (JSON)
                        </h3>
                        <span className="text-xs text-gray-500">Edit JSON to update the structure.</span>
                    </div>
                    <div className="flex-1 relative">
                        <textarea
                            value={jsonContent}
                            onChange={(e) => setJsonContent(e.target.value)}
                            className="absolute inset-0 w-full h-full p-4 font-mono text-sm resize-none focus:outline-none focus:ring-0 text-gray-900"
                            spellCheck={false}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
