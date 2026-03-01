"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Save, ArrowLeft, Code, Clock, Bookmark, BookmarkPlus, Trash2, RotateCcw, Pencil, X, Check, User, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
    saveVersion,
    getVersions,
    deleteVersion,
    clearHistory,
    saveBookmark,
    getBookmarks,
    deleteBookmark,
    updateBookmarkNote,
    type LayoutVersion,
    type LayoutBookmark,
} from "@/lib/layoutHistory";
import toast from "react-hot-toast";

type SideTab = "sections" | "history" | "bookmarks";

export default function LayoutEditorPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { userEmail, userName } = useAuth();
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

    // ─── History & Bookmarks State ────────────────────────────────
    const [sideTab, setSideTab] = useState<SideTab>("sections");
    const [versions, setVersions] = useState<LayoutVersion[]>([]);
    const [bookmarks, setBookmarks] = useState<LayoutBookmark[]>([]);
    const [showBookmarkModal, setShowBookmarkModal] = useState(false);
    const [bookmarkNote, setBookmarkNote] = useState('');
    const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(null);
    const [editingNote, setEditingNote] = useState('');
    const [restoredMessage, setRestoredMessage] = useState('');
    const [rollingBack, setRollingBack] = useState(false);

    // Load history & bookmarks from localStorage
    const refreshSideData = useCallback(() => {
        if (isNew) return;
        setVersions(getVersions(params.id));
        setBookmarks(getBookmarks(params.id));
    }, [params.id, isNew]);

    useEffect(() => {
        if (!isNew) {
            fetchLayout();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params.id]);

    useEffect(() => {
        refreshSideData();
    }, [refreshSideData]);

    const fetchLayout = async () => {
        try {
            const res = await api.get(`/api/admin/layouts/${params.id}`);
            const data = res.data;
            setFormData({
                name: data.name,
                slug: data.slug,
                description: data.description || '',
                isActive: data.isActive,
                components: data.components,
                meta: data.meta || {}
            });
            setJsonContent(JSON.stringify(data.components, null, 2));
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

                // Validate schema locally to prevent 500 errors
                parsedComponents.forEach((comp: any, index: number) => {
                    if (!comp.id) throw new Error(`Component at index ${index} missing 'id'`);
                    if (!comp.type) throw new Error(`Component at index ${index} missing 'type'`);
                });

            } catch (e: any) {
                setError(`Invalid JSON: ${e.message}`);
                setSaving(false);
                return;
            }

            // Save version to localStorage BEFORE the API call (with user info)
            if (!isNew) {
                saveVersion(params.id, jsonContent, formData.name || formData.slug, userEmail, userName);
            }

            const payload = {
                ...formData,
                components: parsedComponents
            };

            const url = isNew
                ? `/api/admin/layouts`
                : `/api/admin/layouts/${params.id}`;

            const method = isNew ? 'post' : 'put';

            // @ts-ignore
            const response = await api[method](url, payload);
            console.log('Save response:', response.data);

            // Refresh side data after save
            refreshSideData();

            toast.success("Layout saved successfully!");
            router.push('/admin/layout-manager');
        } catch (err: any) {
            console.error('Full error:', err);
            const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Error saving layout";
            setError(errorMessage);
        } finally {
            setSaving(false);
        }
    };

    // ─── History actions ─────────────────────────────────────────

    /** Restore to editor only (does NOT save to backend) */
    const handleRestoreVersion = (json: string) => {
        setJsonContent(json);
        setRestoredMessage('Version restored to editor. Click "Save Layout" to apply.');
        setSideTab("sections");
        setTimeout(() => setRestoredMessage(''), 5000);
    };

    /** Rollback: restore to editor AND save to backend immediately */
    const handleRollback = async (version: LayoutVersion) => {
        if (!confirm(`Rollback to version from ${format(new Date(version.timestamp), 'MMM d, yyyy HH:mm')}${version.savedByName ? ` by ${version.savedByName}` : ''}?\n\nThis will save this version to the server immediately.`)) return;

        setRollingBack(true);
        try {
            // Parse the version JSON
            const parsedComponents = JSON.parse(version.json);

            // Save to API
            await api.put(`/api/admin/layouts/${params.id}`, {
                ...formData,
                components: parsedComponents,
            });

            // Save a new version entry marking the rollback
            saveVersion(
                params.id,
                version.json,
                formData.name || formData.slug,
                userEmail,
                userName
            );

            // Update editor
            setJsonContent(version.json);
            refreshSideData();
            toast.success("Rolled back successfully!");
        } catch (err: any) {
            console.error("Rollback error:", err);
            toast.error("Rollback failed: " + (err.response?.data?.error || err.message));
        } finally {
            setRollingBack(false);
        }
    };

    const handleDeleteVersion = (versionId: string) => {
        deleteVersion(params.id, versionId);
        refreshSideData();
    };

    const handleClearHistory = () => {
        if (!confirm("Delete all version history for this layout?")) return;
        clearHistory(params.id);
        refreshSideData();
    };

    // ─── Bookmark actions ────────────────────────────────────────

    const handleAddBookmark = () => {
        if (!bookmarkNote.trim()) return;
        saveBookmark(params.id, jsonContent, bookmarkNote.trim(), formData.name || formData.slug, userEmail, userName);
        setBookmarkNote('');
        setShowBookmarkModal(false);
        refreshSideData();
        toast.success("Bookmark saved!");
    };

    const handleRestoreBookmark = (json: string) => {
        setJsonContent(json);
        setRestoredMessage('Bookmark restored to editor!');
        setTimeout(() => setRestoredMessage(''), 3000);
    };

    const handleDeleteBookmark = (bookmarkId: string) => {
        deleteBookmark(params.id, bookmarkId);
        refreshSideData();
    };

    const handleStartEditNote = (bookmark: LayoutBookmark) => {
        setEditingBookmarkId(bookmark.id);
        setEditingNote(bookmark.note);
    };

    const handleSaveEditNote = () => {
        if (editingBookmarkId) {
            updateBookmarkNote(params.id, editingBookmarkId, editingNote);
            setEditingBookmarkId(null);
            setEditingNote('');
            refreshSideData();
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
                    {restoredMessage && (
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <Check className="h-4 w-4" />
                            {restoredMessage}
                        </span>
                    )}
                    {error && <span className="text-red-600 text-sm font-medium">{error}</span>}

                    {/* Bookmark Button */}
                    {!isNew && (
                        <button
                            onClick={() => setShowBookmarkModal(true)}
                            className="flex items-center gap-2 px-4 py-2 border border-amber-300 text-amber-700 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                            title="Bookmark current JSON"
                        >
                            <BookmarkPlus className="h-4 w-4" />
                            Bookmark
                        </button>
                    )}

                    <button
                        onClick={handleSave}
                        disabled={saving || rollingBack}
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

                {/* Left Sidebar with Tabs */}
                <div className="w-72 border-r border-gray-200 bg-gray-50 flex flex-col">
                    {/* Tab Buttons */}
                    <div className="flex border-b border-gray-200">
                        <button
                            onClick={() => setSideTab("sections")}
                            className={`flex-1 px-2 py-2.5 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${sideTab === "sections"
                                ? "text-primary-600 border-b-2 border-primary-600 bg-white"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Code className="h-3.5 w-3.5" />
                            Sections
                        </button>
                        <button
                            onClick={() => setSideTab("history")}
                            className={`flex-1 px-2 py-2.5 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${sideTab === "history"
                                ? "text-primary-600 border-b-2 border-primary-600 bg-white"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Clock className="h-3.5 w-3.5" />
                            History
                            {versions.length > 0 && (
                                <span className="ml-0.5 px-1.5 py-0.5 bg-gray-200 text-gray-600 rounded-full text-[10px] leading-none">
                                    {versions.length}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => setSideTab("bookmarks")}
                            className={`flex-1 px-2 py-2.5 text-xs font-medium uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors ${sideTab === "bookmarks"
                                ? "text-amber-600 border-b-2 border-amber-500 bg-white"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Bookmark className="h-3.5 w-3.5" />
                            Saved
                            {bookmarks.length > 0 && (
                                <span className="ml-0.5 px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] leading-none">
                                    {bookmarks.length}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="flex-1 overflow-y-auto">

                        {/* ── Sections Tab ─────────────────── */}
                        {sideTab === "sections" && (
                            <div className="p-2 space-y-2">
                                {(() => {
                                    try {
                                        const sections = JSON.parse(jsonContent);
                                        if (Array.isArray(sections)) {
                                            return sections.map((section: any, idx: number) => {
                                                const isHidden = section.isHidden === true;
                                                return (
                                                    <div key={idx} className={`p-2 bg-white border border-gray-200 rounded text-sm hover:border-primary-400 cursor-default transition-opacity ${isHidden ? 'opacity-60' : ''}`}>
                                                        <div className="flex justify-between items-start">
                                                            <div className="font-semibold text-gray-900 truncate pr-2 flex items-center">
                                                                {section.props?.title || section.id || `Section ${idx + 1}`}
                                                                {isHidden && <span className="ml-2 text-[10px] uppercase bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full font-medium">Hidden</span>}
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    const newSections = [...sections];
                                                                    newSections[idx] = { ...newSections[idx] };
                                                                    if (newSections[idx].isHidden) {
                                                                        delete newSections[idx].isHidden;
                                                                    } else {
                                                                        newSections[idx].isHidden = true;
                                                                    }
                                                                    setJsonContent(JSON.stringify(newSections, null, 2));
                                                                }}
                                                                className={`p-1 rounded transition-colors ${isHidden ? 'text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
                                                                title={isHidden ? "Show Section" : "Hide Section"}
                                                            >
                                                                {isHidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                                                            </button>
                                                        </div>
                                                        <div className="text-xs text-gray-500 font-mono mt-1.5 flex justify-between items-center">
                                                            <span>{section.type}</span>
                                                            {section.dataSource && <span className="text-blue-600">⚡ Dynamic</span>}
                                                        </div>
                                                    </div>
                                                )
                                            });
                                        }
                                    } catch (e) {
                                        return <div className="p-3 text-xs text-red-500">Invalid JSON</div>;
                                    }
                                    return <div className="p-3 text-xs text-gray-400">No components defined</div>;
                                })()}
                            </div>
                        )}

                        {/* ── History Tab ──────────────────── */}
                        {sideTab === "history" && (
                            <div className="p-2 space-y-2">
                                {versions.length > 0 && (
                                    <button
                                        onClick={handleClearHistory}
                                        className="w-full text-xs text-red-500 hover:text-red-700 py-1 hover:bg-red-50 rounded transition-colors"
                                    >
                                        Clear All History
                                    </button>
                                )}
                                {versions.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-gray-400">
                                        <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                        <p>No version history yet.</p>
                                        <p className="mt-1">Versions are saved automatically when you click &quot;Save Layout&quot;.</p>
                                    </div>
                                ) : (
                                    versions.map((v, idx) => (
                                        <div key={v.id} className="p-2.5 bg-white border border-gray-200 rounded-lg text-sm hover:border-blue-300 transition-colors">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs font-bold text-gray-500">v{versions.length - idx}</span>
                                                <span className="text-[10px] text-gray-400">
                                                    {format(new Date(v.timestamp), 'MMM d, HH:mm')}
                                                </span>
                                            </div>
                                            <div className="text-xs text-gray-500 truncate mb-1">
                                                {v.layoutName}
                                            </div>
                                            {/* User who saved this version */}
                                            {(v.savedByName || v.savedByEmail) && (
                                                <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-2">
                                                    <User className="h-2.5 w-2.5" />
                                                    <span className="truncate">
                                                        {v.savedByName || v.savedByEmail}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleRestoreVersion(v.json)}
                                                    className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                                                    title="Load into editor (preview only)"
                                                >
                                                    <Code className="h-3 w-3" />
                                                    Preview
                                                </button>
                                                <button
                                                    onClick={() => handleRollback(v)}
                                                    disabled={rollingBack}
                                                    className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 text-green-600 bg-green-50 hover:bg-green-100 rounded transition-colors disabled:opacity-50"
                                                    title="Rollback: restore and save to server"
                                                >
                                                    <RotateCcw className="h-3 w-3" />
                                                    Rollback
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteVersion(v.id)}
                                                    className="flex items-center justify-center text-xs px-2 py-1 text-red-500 bg-red-50 hover:bg-red-100 rounded transition-colors"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* ── Bookmarks Tab ───────────────── */}
                        {sideTab === "bookmarks" && (
                            <div className="p-2 space-y-2">
                                {bookmarks.length === 0 ? (
                                    <div className="p-4 text-center text-xs text-gray-400">
                                        <Bookmark className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                                        <p>No bookmarks yet.</p>
                                        <p className="mt-1">Click &quot;Bookmark&quot; in the header to save the current JSON with a note.</p>
                                    </div>
                                ) : (
                                    bookmarks.map((b) => (
                                        <div key={b.id} className="p-2.5 bg-white border border-amber-200 rounded-lg text-sm hover:border-amber-400 transition-colors">
                                            {editingBookmarkId === b.id ? (
                                                /* Editing note inline */
                                                <div className="space-y-1.5">
                                                    <input
                                                        type="text"
                                                        value={editingNote}
                                                        onChange={(e) => setEditingNote(e.target.value)}
                                                        className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:ring-amber-500 focus:border-amber-500 text-gray-900"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleSaveEditNote();
                                                            if (e.key === 'Escape') setEditingBookmarkId(null);
                                                        }}
                                                    />
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={handleSaveEditNote}
                                                            className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 text-green-600 bg-green-50 hover:bg-green-100 rounded"
                                                        >
                                                            <Check className="h-3 w-3" />
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={() => setEditingBookmarkId(null)}
                                                            className="flex items-center justify-center text-xs px-2 py-1 text-gray-500 bg-gray-50 hover:bg-gray-100 rounded"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-start justify-between gap-1 mb-1">
                                                        <div className="flex items-center gap-1.5 min-w-0">
                                                            <Bookmark className="h-3 w-3 text-amber-500 shrink-0 fill-amber-500" />
                                                            <span className="text-xs font-semibold text-gray-800 truncate">{b.note}</span>
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                            {format(new Date(b.timestamp), 'MMM d, HH:mm')}
                                                        </span>
                                                    </div>
                                                    {/* User who saved this bookmark */}
                                                    {(b.savedByName || b.savedByEmail) && (
                                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-1.5">
                                                            <User className="h-2.5 w-2.5" />
                                                            <span className="truncate">
                                                                {b.savedByName || b.savedByEmail}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex gap-1 mt-2">
                                                        <button
                                                            onClick={() => handleRestoreBookmark(b.json)}
                                                            className="flex-1 flex items-center justify-center gap-1 text-xs px-2 py-1 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition-colors"
                                                        >
                                                            <RotateCcw className="h-3 w-3" />
                                                            Restore
                                                        </button>
                                                        <button
                                                            onClick={() => handleStartEditNote(b)}
                                                            className="flex items-center justify-center text-xs px-2 py-1 text-gray-500 bg-gray-50 hover:bg-gray-100 rounded transition-colors"
                                                            title="Edit note"
                                                        >
                                                            <Pencil className="h-3 w-3" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteBookmark(b.id)}
                                                            className="flex items-center justify-center text-xs px-2 py-1 text-red-500 bg-red-50 hover:bg-red-100 rounded transition-colors"
                                                            title="Delete bookmark"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
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

            {/* ─── Bookmark Modal ──────────────────────────────────── */}
            {showBookmarkModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowBookmarkModal(false)}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 mx-4" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                <BookmarkPlus className="h-5 w-5 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Bookmark Current JSON</h3>
                                <p className="text-sm text-gray-500">Add a note to remember this version</p>
                            </div>
                        </div>
                        <input
                            type="text"
                            value={bookmarkNote}
                            onChange={(e) => setBookmarkNote(e.target.value)}
                            placeholder="e.g., Before adding hero banner, Working Ramadan layout..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-amber-500 focus:border-amber-500 text-gray-900 mb-4"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && bookmarkNote.trim()) handleAddBookmark();
                                if (e.key === 'Escape') setShowBookmarkModal(false);
                            }}
                        />
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowBookmarkModal(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddBookmark}
                                disabled={!bookmarkNote.trim()}
                                className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                <Bookmark className="h-4 w-4" />
                                Save Bookmark
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
