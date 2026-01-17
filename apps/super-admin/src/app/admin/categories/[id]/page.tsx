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
} from "lucide-react";
import Link from "next/link";

interface Attribute {
    _id: string;
    code: string;
    name: string;
    type: string;
}

interface CategoryAttribute {
    attributeId: Attribute | string; // Populated or ID
    position: number;
    isRequired: boolean;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    image?: string;
    icon?: string;
    isActive: boolean;
    order: number;
    parentCategory?: {
        _id: string;
        name: string;
    };
    group?: string;
    attributes?: CategoryAttribute[];
    subCategoryGroupOrder?: string[];
}

interface GroupedSubcategories {
    [key: string]: Category[];
}

export default function CategoryDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [category, setCategory] = useState<Category | null>(null);
    const [subcategories, setSubcategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [allAttributes, setAllAttributes] = useState<Attribute[]>([]);
    const scrollPositionRef = React.useRef<number>(0);

    // Group Ordering State
    const [isGroupOrderModalOpen, setIsGroupOrderModalOpen] = useState(false);
    const [groupOrder, setGroupOrder] = useState<string[]>([]);
    const [savingOrder, setSavingOrder] = useState(false);

    // Subcategory form
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [editingSub, setEditingSub] = useState<Category | null>(null);
    const [subFormData, setSubFormData] = useState({
        name: "",
        group: "",
        image: "",
        isActive: true,
        order: 0,
    });
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Attribute Management State
    const [assignedAttributes, setAssignedAttributes] = useState<CategoryAttribute[]>([]);
    const [isAttrModalOpen, setIsAttrModalOpen] = useState(false);
    const [savingAttrs, setSavingAttrs] = useState(false);

    // Quick Create Attribute State
    const [isCreatingAttr, setIsCreatingAttr] = useState(false);
    const [creatingAttrLoading, setCreatingAttrLoading] = useState(false);
    const [newAttrData, setNewAttrData] = useState({
        name: "",
        code: "",
        type: "checkbox",
        isFilterable: true,
        isVariant: false,
        values: [] as string[]
    });
    const [currentValue, setCurrentValue] = useState("");

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
            const [catRes, subRes, attrRes] = await Promise.all([
                api.get(`/api/super-admin/categories/${params.id}`), // Fetch single category by ID
                api.get(`/api/super-admin/categories?parentCategory=${params.id}`), // Fetch subcategories (ADMIN endpoint)
                api.get('/api/super-admin/attributes') // Fetch all global attributes
            ]);

            if (catRes.data) {
                setCategory(catRes.data);
                // Initialize assigned attributes state
                if (catRes.data.attributes) {
                    setAssignedAttributes(catRes.data.attributes);
                }
                // Initialize group order
                if (catRes.data.subCategoryGroupOrder) {
                    setGroupOrder(catRes.data.subCategoryGroupOrder);
                }
            } else {
                toast.error("Category not found");
                router.push("/admin/categories");
            }

            setSubcategories(subRes.data);
            setAllAttributes(attrRes.data);

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
        setSubFormData({
            name: "",
            group: groupName || "",
            image: "",
            isActive: true,
            order: 0,
        });
        setIsSubModalOpen(true);
    };

    const openEditSubModal = (sub: Category) => {
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

    // --- Attributes Logic ---
    const handleAddAttribute = (attrId: string) => {
        // Check if already assigned
        if (assignedAttributes.some(a => (typeof a.attributeId === 'string' ? a.attributeId : a.attributeId._id) === attrId)) {
            toast.error("Attribute already assigned");
            return;
        }

        const attrObj = allAttributes.find(a => a._id === attrId);
        if (!attrObj) return;

        setAssignedAttributes([...assignedAttributes, {
            attributeId: attrObj, // Store the full object temporarily for display
            position: assignedAttributes.length,
            isRequired: false
        }]);
        setIsAttrModalOpen(false);
        setIsCreatingAttr(false); // Reset state
    };

    const handleCreateAttribute = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreatingAttrLoading(true);
        try {
            const res = await api.post("/api/super-admin/attributes", newAttrData);
            const newAttr = res.data;

            // Add to local list of all attributes
            setAllAttributes([...allAttributes, newAttr]);

            // Immediately add to assigned attributes
            setAssignedAttributes([...assignedAttributes, {
                attributeId: newAttr,
                position: assignedAttributes.length,
                isRequired: false
            }]);

            toast.success("Attribute created and added!");
            setIsAttrModalOpen(false);
            setIsCreatingAttr(false);
            setNewAttrData({ name: "", code: "", type: "checkbox", isFilterable: true, isVariant: false, values: [] });
            setCurrentValue("");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || "Failed to create attribute");
        } finally {
            setCreatingAttrLoading(false);
        }
    };

    const handleRemoveAttribute = (index: number) => {
        const newAttrs = [...assignedAttributes];
        newAttrs.splice(index, 1);
        setAssignedAttributes(newAttrs);
    };

    const handleToggleRequired = (index: number) => {
        const newAttrs = [...assignedAttributes];
        newAttrs[index].isRequired = !newAttrs[index].isRequired;
        setAssignedAttributes(newAttrs);
    };

    const handleSaveAttributes = async () => {
        if (!category) return;
        setSavingAttrs(true);
        try {
            // Format for backend: just IDs
            const formattedAttributes = assignedAttributes.map(a => ({
                attributeId: typeof a.attributeId === 'string' ? a.attributeId : a.attributeId._id,
                position: a.position,
                isRequired: a.isRequired
            }));

            await api.put(`/api/super-admin/categories/${category._id}`, {
                attributes: formattedAttributes
            });
            toast.success("Filters updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update filters");
        } finally {
            setSavingAttrs(false);
        }
    };

    const getAttributeName = (attr: CategoryAttribute) => {
        if (typeof attr.attributeId === 'string') {
            // Fallback if not populated (shouldn't happen with updated API)
            return allAttributes.find(a => a._id === attr.attributeId)?.name || "Unknown";
        }
        return attr.attributeId.name;
    };

    const getAttributeCode = (attr: CategoryAttribute) => {
        if (typeof attr.attributeId === 'string') {
            return allAttributes.find(a => a._id === attr.attributeId)?.code || "unknown";
        }
        return attr.attributeId.code;
    };


    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary-600" /></div>;
    if (!category) return <div className="p-8">Category not found</div>;

    const availableAttributes = allAttributes.filter(a =>
        !assignedAttributes.some(assigned =>
            (typeof assigned.attributeId === 'string' ? assigned.attributeId : assigned.attributeId._id) === a._id
        )
    );

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
                            Filters & Attributes
                        </h3>
                        <p className="text-sm text-gray-500">Configure which filters apply to products in this category.</p>
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
                    <div className="space-y-4">
                        {assignedAttributes.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                <p className="text-gray-500 mb-2">No filters assigned yet.</p>
                                <button
                                    onClick={() => setIsAttrModalOpen(true)}
                                    className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                                >
                                    + Add Filter
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {assignedAttributes.map((attr, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-gray-300 transition-colors">
                                        <div className="cursor-move text-gray-400">
                                            <GripVertical className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{getAttributeName(attr)}</h4>
                                            <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-gray-500">{getAttributeCode(attr)}</code>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={attr.isRequired}
                                                    onChange={() => handleToggleRequired(index)}
                                                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                Required
                                            </label>
                                            <button
                                                onClick={() => handleRemoveAttribute(index)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button
                                    onClick={() => setIsAttrModalOpen(true)}
                                    className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-gray-300 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="h-4 w-4" /> Add Another Filter
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Subcategories Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Subcategories & Groups</h2>
                    <div className="flex items-center gap-2">
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
                                            <div className="relative group/subimg h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {sub.image ? (
                                                    <img src={sub.image} alt={sub.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="h-4 w-4 text-gray-400" />
                                                )}
                                                {sub.image && (
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
                                                <div className="flex items-center gap-3 mt-0.5">
                                                    <div className="flex items-center gap-1">
                                                        <span className={`w-2 h-2 rounded-full ${sub.isActive ? "bg-green-500" : "bg-red-500"}`} />
                                                        <span className="text-xs text-gray-500">Order: {sub.order}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 group/id">
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
            {isSubModalOpen && (
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
            )}

            {/* Modal for Selecting Attributes */}
            {isAttrModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[80vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-shrink-0">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {isCreatingAttr ? "Create New Attribute" : "Add Attribute"}
                            </h3>
                            <button onClick={() => { setIsAttrModalOpen(false); setIsCreatingAttr(false); }} className="text-gray-400 hover:text-gray-500">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {!isCreatingAttr ? (
                            <>
                                <div className="overflow-y-auto p-2 flex-1">
                                    {availableAttributes.length === 0 ? (
                                        <div className="p-8 text-center">
                                            <p className="text-gray-500 mb-4">No more attributes available.</p>
                                            <button
                                                onClick={() => setIsCreatingAttr(true)}
                                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium transition-colors"
                                            >
                                                Create New Attribute
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            {availableAttributes.map(attr => (
                                                <button
                                                    key={attr._id}
                                                    onClick={() => handleAddAttribute(attr._id)}
                                                    className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-left"
                                                >
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900">{attr.name}</div>
                                                        <div className="text-xs text-gray-500 code">{attr.code}</div>
                                                    </div>
                                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{attr.type}</span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {availableAttributes.length > 0 && (
                                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                                        <button
                                            onClick={() => setIsCreatingAttr(true)}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                                        >
                                            <Plus className="h-4 w-4" /> Create New Attribute
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <form onSubmit={handleCreateAttribute} className="flex flex-col flex-1 min-h-0">
                                <div className="p-6 space-y-4 overflow-y-auto flex-1">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newAttrData.name}
                                            onChange={(e) => {
                                                const name = e.target.value;
                                                // Auto-generate code from name if code is empty or matches previous slug
                                                const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                                setNewAttrData(prev => ({
                                                    ...prev,
                                                    name,
                                                    code: prev.code === "" || prev.code === prev.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') ? slug : prev.code
                                                }));
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                            placeholder="e.g. Screen Size"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={newAttrData.code}
                                            onChange={(e) => setNewAttrData({ ...newAttrData, code: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                            placeholder="e.g. screen_size"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Unique identifier (slug).</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Type
                                        </label>
                                        <select
                                            value={newAttrData.type}
                                            onChange={(e) => setNewAttrData({ ...newAttrData, type: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 bg-white"
                                        >
                                            <option value="checkbox">Checkbox (Multiple Select)</option>
                                            <option value="radio">Radio (Single Select)</option>
                                            <option value="boolean">Boolean (Yes/No)</option>
                                            <option value="range">Range (Slider/Min-Max)</option>
                                        </select>
                                    </div>

                                    {/* Values - Only for checkbox/radio */}
                                    {(newAttrData.type === 'checkbox' || newAttrData.type === 'radio') && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Values
                                            </label>
                                            <div className="space-y-2">
                                                <div className="flex gap-2">
                                                    <input
                                                        type="text"
                                                        value={currentValue}
                                                        onChange={(e) => setCurrentValue(e.target.value)}
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                if (currentValue.trim()) {
                                                                    setNewAttrData(prev => ({
                                                                        ...prev,
                                                                        values: [...prev.values, currentValue.trim()]
                                                                    }));
                                                                    setCurrentValue("");
                                                                }
                                                            }
                                                        }}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                                        placeholder="e.g. Red, Blue, Small, Large"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (currentValue.trim()) {
                                                                setNewAttrData(prev => ({
                                                                    ...prev,
                                                                    values: [...prev.values, currentValue.trim()]
                                                                }));
                                                                setCurrentValue("");
                                                            }
                                                        }}
                                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                                    >
                                                        Add
                                                    </button>
                                                </div>
                                                {newAttrData.values.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {newAttrData.values.map((val, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded text-sm"
                                                            >
                                                                {val}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setNewAttrData(prev => ({
                                                                            ...prev,
                                                                            values: prev.values.filter((_, i) => i !== idx)
                                                                        }));
                                                                    }}
                                                                    className="text-primary-600 hover:text-primary-800"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Checkboxes */}
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newAttrData.isFilterable}
                                                onChange={(e) => setNewAttrData({ ...newAttrData, isFilterable: e.target.checked })}
                                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-700">Filterable (show in mobile filters)</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={newAttrData.isVariant}
                                                onChange={(e) => setNewAttrData({ ...newAttrData, isVariant: e.target.checked })}
                                                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-700">Use for Variants (e.g., Size, Color)</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreatingAttr(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={creatingAttrLoading}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        {creatingAttrLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                        Create & Add
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
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
