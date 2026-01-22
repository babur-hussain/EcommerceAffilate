"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import toast from "react-hot-toast";
import {
    Save,
    RefreshCw,
    LayoutDashboard,
    Copy,
    Plus,
    ArrowUp,
    ArrowDown,
    Trash2,
    FilePlus,
    Monitor
} from "lucide-react";

interface Section {
    id: string;
    type: string;
    title?: string;
    adminLabel?: string;
    priority: number;
    content: any;
    _id?: string;
    [key: string]: any;
}

interface PageInfo {
    pageSlug: string;
    name: string;
    description?: string;
    isActive: boolean;
}

export default function LayoutManager() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Pages State
    const [pages, setPages] = useState<PageInfo[]>([]);
    const [selectedPageSlug, setSelectedPageSlug] = useState<string>("home");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPageData, setNewPageData] = useState({ slug: "", name: "", description: "" });

    // Layout State
    const [layout, setLayout] = useState<any>(null);
    const [sections, setSections] = useState<Section[]>([]);

    // Selection State
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
    const [jsonContent, setJsonContent] = useState("");

    useEffect(() => {
        fetchPages();
    }, []);

    useEffect(() => {
        if (selectedPageSlug) {
            fetchLayout(selectedPageSlug);
        }
    }, [selectedPageSlug]);

    // Update JSON content when selection changes
    useEffect(() => {
        if (selectedSectionId && sections.length > 0) {
            const section = sections.find(s => s.id === selectedSectionId);
            if (section) {
                setJsonContent(JSON.stringify(section, null, 2));
            }
        } else {
            setJsonContent("");
        }
    }, [selectedSectionId, sections]);

    const fetchPages = async () => {
        try {
            const response = await api.get("/api/admin/layout/list");
            setPages(response.data);
        } catch (error) {
            console.error("Failed to fetch pages", error);
        }
    }

    const fetchLayout = async (slug: string) => {
        try {
            setFetching(true);
            const response = await api.get(`/api/admin/layout/${slug}`);
            if (response.data) {
                setLayout(response.data);
                // Sort sections by priority for the list view
                const sortedSections = (response.data.sections || []).sort((a: Section, b: Section) => a.priority - b.priority);
                setSections(sortedSections);

                // Select first item by default if nothing selected or previous selection gone
                if (sortedSections.length > 0) {
                    setSelectedSectionId(sortedSections[0].id);
                } else {
                    setSelectedSectionId(null);
                }
            }
        } catch (error: any) {
            console.error("Error fetching layout:", error);
            if (error.response?.status === 404) {
                toast.error("Page layout not found");
                setSections([]);
            } else {
                toast.error("Failed to fetch layout");
            }
        } finally {
            setFetching(false);
        }
    };

    const handleJsonChange = (val: string) => {
        setJsonContent(val);
    }

    const saveCurrentSection = () => {
        // Parse local JSON
        try {
            const updatedSection = JSON.parse(jsonContent);
            if (!updatedSection.id || !updatedSection.type) {
                toast.error("Section must have 'id' and 'type'");
                return null;
            }

            // Update the list in memory
            const newSections = sections.map(s =>
                s.id === selectedSectionId ? updatedSection : s
            );

            setSections(newSections);
            // Update selection ID in case ID changed
            if (updatedSection.id !== selectedSectionId) {
                setSelectedSectionId(updatedSection.id);
            }

            return newSections;
        } catch (e) {
            toast.error("Invalid JSON content");
            return null;
        }
    }

    const saveLayoutToBackend = async () => {
        try {
            setLoading(true);

            // If we have an active selection, validate/save it first to memory
            let currentList = sections;
            if (selectedSectionId && jsonContent) {
                const updated = saveCurrentSection();
                if (!updated) {
                    setLoading(false);
                    return;
                }
                currentList = updated;
            }

            // Re-assign priorities based on current list order to ensure consistency
            const orderedList = currentList.map((section, index) => ({
                ...section,
                priority: (index + 1) * 10
            }));

            const token = localStorage.getItem("authToken");
            await api.put(`/api/admin/layout/${selectedPageSlug}`, { sections: orderedList }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success("Layout published to App!");
            fetchLayout(selectedPageSlug); // Refresh to ensure sync
        } catch (error: any) {
            console.error("Save error:", error);
            toast.error(error.response?.data?.error || "Failed to save layout");
        } finally {
            setLoading(false);
        }
    };

    const createPage = async () => {
        try {
            if (!newPageData.slug || !newPageData.name) {
                toast.error("Slug and Name are required");
                return;
            }
            await api.post("/api/admin/layout", {
                pageSlug: newPageData.slug,
                name: newPageData.name,
                description: newPageData.description
            });
            toast.success("Page created!");
            setShowCreateModal(false);
            fetchPages();
            setSelectedPageSlug(newPageData.slug);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to create page");
        }
    }

    const moveSection = (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        if (direction === 'up' && index > 0) {
            [newSections[index], newSections[index - 1]] = [newSections[index - 1], newSections[index]];
        } else if (direction === 'down' && index < newSections.length - 1) {
            [newSections[index], newSections[index + 1]] = [newSections[index + 1], newSections[index]];
        }
        setSections(newSections);
    }

    const addNewSection = () => {
        const newId = `section_${Date.now()}`;
        const newSection: Section = {
            id: newId,
            type: 'banner_single',
            adminLabel: 'New Section',
            title: 'New Section',
            priority: (sections.length + 1) * 10,
            content: {}
        };
        setSections([...sections, newSection]);
        setSelectedSectionId(newId);
    }

    const deleteSection = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm("Are you sure you want to delete this section?")) {
            const newSections = sections.filter(s => s.id !== id);
            setSections(newSections);
            if (selectedSectionId === id) {
                setSelectedSectionId(null);
            }
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(jsonContent);
        toast.success("Copied JSON");
    }

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <LayoutDashboard className="w-8 h-8 text-primary-600" />
                        Layout Manager
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Manage layouts for {pages.length} pages
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <select
                            value={selectedPageSlug}
                            onChange={(e) => setSelectedPageSlug(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white focus:border-primary-500 font-medium min-w-[200px]"
                        >
                            {pages.map(p => (
                                <option key={p.pageSlug} value={p.pageSlug}>{p.name} ({p.pageSlug})</option>
                            ))}
                            {pages.length === 0 && <option value="home">Home (default)</option>}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white"
                    >
                        <FilePlus className="w-4 h-4" /> New Page
                    </button>

                    <button
                        onClick={saveLayoutToBackend}
                        disabled={loading || fetching}
                        className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 shadow-sm"
                    >
                        {loading ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        Publish Changes
                    </button>
                </div>
            </div>

            <div className="flex flex-1 gap-6 overflow-hidden">
                {/* Left Sidebar: Components List */}
                <div className="w-1/3 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg flex justify-between items-center">
                        <div>
                            <h2 className="font-semibold text-gray-700">Sections Order</h2>
                            <p className="text-xs text-gray-500">{sections.length} sections on this page</p>
                        </div>
                        <button onClick={addNewSection} className="text-primary-600 hover:bg-primary-50 p-1 rounded">
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {sections.map((section, index) => (
                            <div
                                key={section.id}
                                onClick={() => setSelectedSectionId(section.id)}
                                className={`p-3 rounded-lg border cursor-pointer transition-all group ${selectedSectionId === section.id
                                    ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-1 items-center justify-center text-gray-400">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); moveSection(index, 'up'); }}
                                                disabled={index === 0}
                                                className="hover:text-primary-600 disabled:opacity-30 p-0.5"
                                            >
                                                <ArrowUp className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); moveSection(index, 'down'); }}
                                                disabled={index === sections.length - 1}
                                                className="hover:text-primary-600 disabled:opacity-30 p-0.5"
                                            >
                                                <ArrowDown className="w-3 h-3" />
                                            </button>
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 text-sm">
                                                {section.adminLabel || section.title || "Untitled Section"}
                                            </h3>
                                            <div className="text-xs text-gray-500 font-mono flex items-center gap-2">
                                                <span className="bg-gray-100 px-1 rounded">{section.type}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={(e) => deleteSection(section.id, e)}
                                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {sections.length === 0 && !fetching && (
                            <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                                <Monitor className="w-12 h-12 opacity-20 mb-2" />
                                <p>No sections yet.</p>
                                <button onClick={addNewSection} className="text-primary-600 font-medium text-sm mt-2 hover:underline">
                                    Add your first section
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Content: JSON Editor */}
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col overflow-hidden">
                    {selectedSectionId ? (
                        <>
                            <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-gray-700">Properties Editor</span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-mono">
                                        {selectedSectionId}
                                    </span>
                                </div>
                                <button onClick={copyToClipboard} className="text-xs text-gray-600 hover:text-primary-600 flex items-center gap-1">
                                    <Copy className="w-3 h-3" /> Copy JSON
                                </button>
                            </div>
                            <div className="flex-1 relative bg-slate-50">
                                <textarea
                                    value={jsonContent}
                                    onChange={(e) => handleJsonChange(e.target.value)}
                                    className="absolute inset-0 w-full h-full p-4 font-mono text-sm resize-none focus:outline-none focus:bg-white transition-colors text-slate-800"
                                    spellCheck={false}
                                />
                            </div>
                            <div className="p-2 border-t border-gray-200 bg-yellow-50 text-xs text-yellow-800 px-4">
                                💡 Tip: Add "adminLabel": "My Name" to customize the name in the list.
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-400 flex-col gap-2">
                            <LayoutDashboard className="w-12 h-12 opacity-20" />
                            <p>Select a section from the left to edit</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Page Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96 shadow-xl">
                        <h2 className="text-xl font-bold mb-4">Create New Page</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Page Slug (ID)</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2 text-gray-900"
                                    placeholder="e.g. category-fashion"
                                    value={newPageData.slug}
                                    onChange={(e) => setNewPageData({ ...newPageData, slug: e.target.value })}
                                />
                                <p className="text-xs text-gray-500 mt-1">Unique identifier used in code</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                                <input
                                    type="text"
                                    className="w-full border rounded p-2 text-gray-900"
                                    placeholder="e.g. Fashion Landing Page"
                                    value={newPageData.name}
                                    onChange={(e) => setNewPageData({ ...newPageData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    className="w-full border rounded p-2 text-gray-900"
                                    rows={3}
                                    value={newPageData.description}
                                    onChange={(e) => setNewPageData({ ...newPageData, description: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={createPage}
                                    className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
                                >
                                    Create Page
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
