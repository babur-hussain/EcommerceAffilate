"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
    Plus,
    Pencil,
    Trash2,
    ArrowLeft,
    ArrowRight,
    Loader2,
    Image as ImageIcon,
    Upload,
    Save,
    X,
    Sliders,
    GripVertical,
    Copy,
    Check,
    RefreshCw, // Add refresh icon for normalize
} from "lucide-react";
import Link from "next/link";

import { FilterConfig, Category as CategoryType } from "@/types";
import FilterConfigEditor from "@/components/FilterConfigEditor";



interface GroupedSubcategories {
    [key: string]: CategoryType[];
}

export default function CategoryDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [category, setCategory] = useState<CategoryType | null>(null);
    const [subcategories, setSubcategories] = useState<CategoryType[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingAttrs, setSavingAttrs] = useState(false);
    const scrollPositionRef = React.useRef<number>(0);

    // Group Ordering State
    const [isGroupOrderModalOpen, setIsGroupOrderModalOpen] = useState(false);
    const [groupOrder, setGroupOrder] = useState<string[]>([]);
    const [savingOrder, setSavingOrder] = useState(false);
    const [normalizing, setNormalizing] = useState(false);

    // Subcategory form
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<CategoryType | null>(null);
    const [subFormData, setSubFormData] = useState({
        name: "",
        group: "",
        image: "",
        isActive: true,
        order: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadingSubs, setUploadingSubs] = useState<Set<string>>(new Set());

    // Drag and Drop Handlers for Subcategories
    const handleSubIconDrop = async (e: React.DragEvent<HTMLDivElement>, subId: string) => {
        e.preventDefault();
        e.stopPropagation();

        const file = e.dataTransfer.files?.[0];
        if (!file || !file.type.startsWith('image/')) {
            toast.error("Please drop an image file");
            return;
        }

        try {
            setUploadingSubs(prev => new Set(prev).add(subId));

            // 1. Upload Image
            const fd = new FormData();
            fd.append('image', file);
            const uploadRes = await api.post('/api/upload/image', fd, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const imageUrl = uploadRes.data.imageUrl;

            // 2. Update Subcategory
            await api.put(`/api/super-admin/categories/${subId}`, { image: imageUrl });

            // 3. Update Local State
            setSubcategories(prev => prev.map(sub =>
                sub._id === subId ? { ...sub, image: imageUrl } : sub
            ));

            toast.success("Icon updated successfully");
        } catch (error) {
            console.error("Upload failed:", error);
            toast.error("Failed to upload icon");
        } finally {
            setUploadingSubs(prev => {
                const newSet = new Set(prev);
                newSet.delete(subId);
                return newSet;
            });
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2');
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        e.currentTarget.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2');
    };

    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyToClipboard = (text: string, label: string = "ID") => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedId(text);
        toast.success(`${label} copied to clipboard`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    useEffect(() => {
        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    const fetchData = async (isBackground = false) => {
        try {
            if (!isBackground) setLoading(true);
            const [catRes, subRes] = await Promise.all([
                api.get(`/api/super-admin/categories/${params.id}`), // Fetch single category by ID
                api.get(`/api/super-admin/categories?parentCategory=${params.id}`), // Fetch subcategories (ADMIN endpoint)
            ]);

            if (catRes.data) {
                setCategory(catRes.data);
                // Initialize group order
                if (catRes.data.subCategoryGroupOrder) {
                    setGroupOrder(catRes.data.subCategoryGroupOrder);
                }
            } else {
                toast.error("Category not found");
                router.push("/admin/categories");
            }

            setSubcategories(subRes.data);

        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load category details");
        } finally {
            if (!isBackground) setLoading(false);
        }
    };

    const handleSaveGroupOrder = async () => {
        if (!category) return;
        setSavingOrder(true);
        try {
            await api.put(`/api/super-admin/categories/${category._id}`, {
                subCategoryGroupOrder: groupOrder
            });
            toast.success("Group order updated");
            setIsGroupOrderModalOpen(false);
            // Update local category state to reflect change immediately if needed, 
            // though we mostly use 'groupOrder' state for sorting
            setCategory(prev => prev ? { ...prev, subCategoryGroupOrder: groupOrder } : null);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update group order");
        } finally {
            setSavingOrder(false);
        }
    };

    const moveGroup = (index: number, direction: 'up' | 'down') => {
        const newOrder = [...groupOrder];
        if (direction === 'up') {
            if (index === 0) return;
            [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
        } else {
            if (index === newOrder.length - 1) return;
            [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
        }
        setGroupOrder(newOrder);
    };

    const handleNormalizeOrders = async () => {
        if (!confirm("This will reset order numbers for all subcategories to start from 1 within each group. Continue?")) return;
        setNormalizing(true);
        try {
            // Group and sort locally first
            const grouped = subcategories.reduce((acc, sub) => {
                const group = sub.group || "Uncategorized";
                if (!acc[group]) acc[group] = [];
                acc[group].push(sub);
                return acc;
            }, {} as GroupedSubcategories);

            const updatePromises: Promise<any>[] = [];

            // Iterate groups and prepare updates
            Object.values(grouped).forEach(groupItems => {
                // Sort by current order to preserve relative sequence
                const sortedItems = [...groupItems].sort((a, b) => (a.order || 0) - (b.order || 0));

                sortedItems.forEach((item, index) => {
                    const newOrder = index + 1;
                    if (item.order !== newOrder) {
                        updatePromises.push(
                            api.put(`/api/super-admin/categories/${item._id}`, { order: newOrder })
                        );
                    }
                });
            });

            if (updatePromises.length > 0) {
                await Promise.all(updatePromises);
                toast.success(`Normalized ${updatePromises.length} subcategories`);
                fetchData(true);
            } else {
                toast.success("All orders are already normalized");
            }

        } catch (error) {
            console.error("Failed to normalize", error);
            toast.error("Failed to normalize orders");
        } finally {
            setNormalizing(false);
        }
    };

    const handleSubSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const payload = {
                ...subFormData,
                parentCategory: params.id,
            };

            if (editingSub) {
                await api.put(`/api/super-admin/categories/${editingSub._id}`, payload);
                toast.success("Subcategory updated");
            } else {
                await api.post("/api/super-admin/categories", payload);
                toast.success("Subcategory created");
            }
            closeSubModal();
            // Refresh data in background without resetting scroll
            fetchData(true);
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Failed to save subcategory");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteSub = async (id: string) => {
        if (!confirm("Delete this subcategory?")) return;
        try {
            await api.delete(`/api/super-admin/categories/${id}`);
            toast.success("Deleted successfully");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const openAddSubModal = (groupName?: string) => {
        setEditingSub(null);

        let nextOrder = 1;
        if (groupName) {
            const groupItems = subcategories.filter(s => (s.group || "Uncategorized") === groupName);
            if (groupItems.length > 0) {
                const maxOrder = Math.max(...groupItems.map(s => s.order || 0));
                nextOrder = maxOrder + 1;
            }
        } else {
            // If no group selected (generic add), maybe find max of 'Uncategorized' or just 1?
            // Let's stick to 1 or try to infer from 'Uncategorized' if that becomes default.
            const uncategorizedItems = subcategories.filter(s => !s.group || s.group === "Uncategorized");
            if (uncategorizedItems.length > 0) {
                const maxOrder = Math.max(...uncategorizedItems.map(s => s.order || 0));
                nextOrder = maxOrder + 1;
            }
        }

        setSubFormData({
            name: "",
            group: groupName || "",
            image: "",
            isActive: true,
            order: nextOrder,
        });
        setIsSubModalOpen(true);
    };

    const openEditSubModal = (sub: CategoryType) => {
        setEditingSub(sub);
        setSubFormData({
            name: sub.name,
            group: sub.group || "",
            image: sub.image || "",
            isActive: sub.isActive,
            order: sub.order,
        });
        setIsSubModalOpen(true);
    };

    const closeSubModal = () => {
        setIsSubModalOpen(false);
        setEditingSub(null);
    };

    const groupedSubcategories = subcategories.reduce((acc, sub) => {
        const group = sub.group || "Uncategorized";
        if (!acc[group]) acc[group] = [];
        acc[group].push(sub);
        return acc;
    }, {} as GroupedSubcategories);

    // Get sorted keys based on groupOrder
    const sortedGroupKeys = Object.keys(groupedSubcategories).sort((a, b) => {
        const indexA = groupOrder.indexOf(a);
        const indexB = groupOrder.indexOf(b);
        // If both found, sort by index
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
        // If only A found, A comes first
        if (indexA !== -1) return -1;
        // If only B found, B comes first
        if (indexB !== -1) return 1;
        // If neither found, sort alphabetically
        return a.localeCompare(b);
    });

    // Ensure groupOrder contains all current groups (syncing state)
    useEffect(() => {
        const currentGroups = Object.keys(groupedSubcategories);
        const newGroups = currentGroups.filter(g => !groupOrder.includes(g));
        if (newGroups.length > 0) {
            setGroupOrder(prev => [...prev, ...newGroups]);
        }
    }, [subcategories]); // Run when subcategories change

    // Image upload handler
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploading(true);
            const fd = new FormData();
            fd.append('image', file);
            const res = await api.post('/api/upload/image', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            setSubFormData(prev => ({ ...prev, image: res.data.imageUrl }));
        } catch (err) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleSaveAttributes = async () => {
        if (!category) return;
        setSavingAttrs(true);
        try {
            await api.put(`/api/super-admin/categories/${category._id}`, {
                filterConfig: category.filterConfig
            });
            toast.success("Filters updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update filters");
        } finally {
            setSavingAttrs(false);
        }
    };


    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary-600" /></div>;
    if (!category) return <div className="p-8">Category not found</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4">
                <Link href="/admin/categories" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{category.name}</h1>
                    <p className="text-sm text-gray-500">Manage subcategories and grouping</p>
                </div>
            </div>

            {/* Hero Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row gap-8 items-start">
                <div className="relative group/img w-32 h-32 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                    {category.image || category.icon ? (
                        <img src={category.image || category.icon} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="h-10 w-10 text-gray-400" />
                    )}
                    {(category.image || category.icon) && (
                        <button
                            onClick={() => copyToClipboard(category.image || category.icon || "", "Image URL")}
                            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                            title="Copy Image URL"
                        >
                            {copiedId === (category.image || category.icon) ? (
                                <Check className="h-6 w-6 text-white" />
                            ) : (
                                <div className="flex flex-col items-center gap-1">
                                    <Copy className="h-6 w-6 text-white" />
                                    <span className="text-[10px] text-white font-medium uppercase">Copy URL</span>
                                </div>
                            )}
                        </button>
                    )}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h2>
                    <p className="text-gray-600 mb-4 max-w-2xl">{category.description || "No description provided."}</p>
                    <div className="flex gap-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${category.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {category.isActive ? "Active" : "Inactive"}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Slug: {category.slug}
                        </span>
                        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                            <span className="text-xs font-mono text-gray-500">ID: {category._id}</span>
                            <button
                                onClick={() => copyToClipboard(category._id)}
                                className="p-1 hover:bg-gray-200 rounded-md transition-colors text-gray-400 hover:text-gray-600"
                                title="Copy ID"
                            >
                                {copiedId === category._id ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters & Attributes Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <Sliders className="h-5 w-5 text-gray-500" />
                            Filters & Variants
                        </h3>
                        <p className="text-sm text-gray-500">Configure filters and product variants for this category.</p>
                    </div>
                    <button
                        onClick={handleSaveAttributes}
                        disabled={savingAttrs}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                    >
                        {savingAttrs ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Save Config
                    </button>
                </div>
                <div className="p-6">
                    <FilterConfigEditor
                        filters={category.filterConfig || []}
                        onChange={(newFilters) => setCategory({ ...category, filterConfig: newFilters })}
                    />
                </div>
            </div>

            {/* Subcategories Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Subcategories & Groups</h2>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleNormalizeOrders}
                            disabled={normalizing}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                            title="Reset order numbers to start from 1 for each group"
                        >
                            <RefreshCw className={`h-4 w-4 ${normalizing ? 'animate-spin' : ''}`} />
                            Normalize Orders
                        </button>
                        <button
                            onClick={() => setIsGroupOrderModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <GripVertical className="h-4 w-4" />
                            Reorder Groups
                        </button>
                        <button
                            onClick={() => openAddSubModal()}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white border border-transparent rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add Subcategory
                        </button>
                    </div>
                </div>

                <div className="space-y-8">
                    {sortedGroupKeys.map((group) => {
                        const items = groupedSubcategories[group];
                        return (
                            <div key={group} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        {group}
                                        <span className="text-xs font-normal text-gray-500 bg-white px-2 py-0.5 rounded-full border border-gray-200">
                                            {items.length} items
                                        </span>
                                    </h3>
                                    <button
                                        onClick={() => openAddSubModal(group)}
                                        className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                                    >
                                        <Plus className="h-3 w-3" /> Add to {group}
                                    </button>
                                </div>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {items.map(sub => (
                                        <div key={sub._id} className="group relative flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all bg-white">
                                            <div
                                                className="relative group/subimg h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0 transition-all"
                                                onDragOver={handleDragOver}
                                                onDragLeave={handleDragLeave}
                                                onDrop={(e) => {
                                                    e.currentTarget.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2');
                                                    handleSubIconDrop(e, sub._id);
                                                }}
                                            >
                                                {uploadingSubs.has(sub._id) ? (
                                                    <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                                                ) : sub.image ? (
                                                    <img src={sub.image} alt={sub.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="h-4 w-4 text-gray-400" />
                                                )}
                                                {sub.image && !uploadingSubs.has(sub._id) && (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyToClipboard(sub.image || "", "Image URL");
                                                        }}
                                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/subimg:opacity-100 transition-opacity"
                                                        title="Copy Image URL"
                                                    >
                                                        {copiedId === sub.image ? (
                                                            <Check className="h-3 w-3 text-white" />
                                                        ) : (
                                                            <Copy className="h-3 w-3 text-white" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 truncate">{sub.name}</p>
                                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                    <div className="flex items-center gap-1">
                                                        <span className={`w-2 h-2 rounded-full ${sub.isActive ? "bg-green-500" : "bg-red-500"}`} />
                                                        <span className="text-xs text-gray-500">Order: {sub.order}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">
                                                        <span className="text-[10px] font-medium text-gray-600">
                                                            {sub.productCount || 0} Products
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 group/id mt-1">
                                                    <span className="text-[10px] font-mono text-gray-400">ID: {sub._id}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            copyToClipboard(sub._id);
                                                        }}
                                                        className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-300 hover:text-gray-500"
                                                        title="Copy ID"
                                                    >
                                                        {copiedId === sub._id ? <Check className="h-2.5 w-2.5 text-green-600" /> : <Copy className="h-2.5 w-2.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/admin/categories/${sub._id}`}
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Manage Subcategories"
                                                >
                                                    <ArrowRight className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => openEditSubModal(sub)}
                                                    className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-50 rounded"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSub(sub._id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-50 rounded"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {subcategories.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No subcategories found. Add one to get started!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal for Add/Edit Subcategory */}
            {
                isSubModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {editingSub ? "Edit Subcategory" : "Add Subcategory"}
                                </h3>
                                <button onClick={closeSubModal} className="text-gray-400 hover:text-gray-500">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                                        value={subFormData.name}
                                        onChange={e => setSubFormData({ ...subFormData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Group / Section Title</label>
                                    <input
                                        type="text"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                                        placeholder="e.g. Staples"
                                        value={subFormData.group}
                                        onChange={e => setSubFormData({ ...subFormData, group: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                                    <div className="space-y-2">
                                        {subFormData.image && (
                                            <div className="relative h-24 bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={subFormData.image} className="w-full h-full object-cover" />
                                                <button type="button" onClick={() => setSubFormData({ ...subFormData, image: "" })} className="absolute top-1 right-1 p-1 bg-white rounded-full"><X className="h-3 w-3" /></button>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                            className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-gray-900"
                                            value={subFormData.order}
                                            onChange={e => setSubFormData({ ...subFormData, order: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>
                                    <label className="flex items-center gap-2 pt-6 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={subFormData.isActive}
                                            onChange={e => setSubFormData({ ...subFormData, isActive: e.target.checked })}
                                            className="w-4 h-4 text-primary-600 rounded"
                                        />
                                        <span className="text-sm font-medium text-gray-700">Active</span>
                                    </label>
                                </div>
                                <div className="flex justify-end gap-3 pt-4">
                                    <button type="button" onClick={closeSubModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                                    <button
                                        type="submit"
                                        disabled={submitting || uploading}
                                        className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            {/* Modal for Group Ordering */}
            {
                isGroupOrderModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-sm overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">Reorder Groups</h3>
                                <button onClick={() => setIsGroupOrderModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-2">
                                {groupOrder.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No groups found.</p>
                                ) : (
                                    groupOrder.map((group, index) => (
                                        <div key={group} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <span className="font-medium text-gray-700">{group}</span>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => moveGroup(index, 'up')}
                                                    disabled={index === 0}
                                                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => moveGroup(index, 'down')}
                                                    disabled={index === groupOrder.length - 1}
                                                    className="p-1 hover:bg-gray-200 rounded disabled:opacity-30"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-2">
                                <button
                                    onClick={() => setIsGroupOrderModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveGroupOrder}
                                    disabled={savingOrder}
                                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {savingOrder && <Loader2 className="h-3 w-3 animate-spin" />}
                                    Save Order
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
