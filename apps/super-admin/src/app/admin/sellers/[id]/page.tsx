"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Save, Loader2, Smartphone, Mail, MapPin, Building2, Calendar, CheckCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Seller } from "@/types";
import { formatDate } from "@/lib/utils";

export default function SellerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [seller, setSeller] = useState<Seller | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [trustBadges, setTrustBadges] = useState<Array<{ id: string; name: string; description: string; icon: string }>>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBadge, setNewBadge] = useState({ id: '', name: '', description: '', icon: 'shield-checkmark' });
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchSellerDetails();
            fetchTrustBadges();
        }
    }, [params.id]);

    const fetchSellerDetails = async () => {
        try {
            const response = await api.get(`/api/super-admin/sellers/${params.id}`);
            setSeller(response.data);
            if (response.data.business?.trustBadges) {
                setSelectedBadges(response.data.business.trustBadges);
            }
        } catch (error) {
            console.error("Error fetching seller:", error);
            toast.error("Failed to fetch seller details");
        } finally {
            setLoading(false);
        }
    };

    const fetchTrustBadges = async () => {
        try {
            const response = await api.get("/api/super-admin/trust-badges");
            setTrustBadges(response.data);
        } catch (error) {
            console.error("Error fetching trust badges:", error);
            toast.error("Failed to fetch trust badges");
        }
    };

    const handleCreateBadge = async () => {
        if (!newBadge.id || !newBadge.name) {
            toast.error("Please fill Badge ID and Badge Name");
            return;
        }

        setCreating(true);
        try {
            await api.post("/api/super-admin/trust-badges", newBadge);
            toast.success("Badge created successfully");
            setShowCreateModal(false);
            setNewBadge({ id: '', name: '', description: '', icon: 'shield-checkmark' });
            fetchTrustBadges();
        } catch (error: any) {
            console.error("Error creating badge:", error);
            toast.error(error.response?.data?.error || "Failed to create badge");
        } finally {
            setCreating(false);
        }
    };

    const handleSaveBadges = async () => {
        console.log('handleSaveBadges called');
        console.log('seller:', seller);
        console.log('seller.business:', seller?.business);
        console.log('seller.business._id:', seller?.business?._id);
        console.log('selectedBadges:', selectedBadges);

        if (!seller?.business?._id) {
            console.log('No business ID, returning early');
            return;
        }

        setSaving(true);
        try {
            console.log('Making API call to:', `/api/super-admin/businesses/${seller.business._id}/trust-badges`);
            const response = await api.patch(`/api/super-admin/businesses/${seller.business._id}/trust-badges`, {
                badges: selectedBadges
            });
            console.log('API response:', response);
            toast.success("Trust badges assigned successfully");
        } catch (error) {
            console.error("Error saving badges:", error);
            toast.error("Failed to save trust badges");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteBadge = async (e: React.MouseEvent, badgeId: string) => {
        e.stopPropagation();
        if (!window.confirm("Are you sure you want to delete this trust badge? This action cannot be undone.")) {
            return;
        }

        try {
            await api.delete(`/api/super-admin/trust-badges/${badgeId}`);
            toast.success("Trust badge deleted successfully");

            // Remove from local list
            setTrustBadges(prev => prev.filter(b => b.id !== badgeId));

            // Remove from selection if present
            if (selectedBadges.includes(badgeId)) {
                setSelectedBadges(prev => prev.filter(id => id !== badgeId));
            }
        } catch (error: any) {
            console.error("Error deleting badge:", error);
            toast.error(error.response?.data?.error || "Failed to delete trust badge");
        }
    };

    const toggleBadge = (id: string) => {
        setSelectedBadges(prev =>
            prev.includes(id)
                ? prev.filter(badgeId => badgeId !== id)
                : [...prev, id]
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    if (!seller) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-gray-500 mb-4">Seller not found</p>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                >
                    <ArrowLeft className="h-4 w-4" /> Go Back
                </button>
            </div>
        );
    }



    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-500" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
                    <p className="text-gray-500">Seller ID: {seller._id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Info Cards */}
                <div className="space-y-6 md:col-span-2">
                    {/* Business Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-gray-400" />
                            Business Details
                        </h2>
                        {seller.business ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Business Name</label>
                                    <p className="mt-1 text-gray-900 font-medium">{seller.business.businessName}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Business Type</label>
                                    <p className="mt-1 text-gray-900">{seller.business.businessType}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Status</label>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1
                                        ${seller.business.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                            seller.business.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'}`}>
                                        {seller.business.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Joined Date</label>
                                    <p className="mt-1 text-gray-900 flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                        {formatDate(seller.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No business details available</p>
                        )}
                    </div>

                    {/* Trust Badges Assignment */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-primary-600" />
                                    Trust Badges
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Assign trust badges that will be displayed on this seller's products.
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    Create Badge
                                </button>
                                <button
                                    onClick={handleSaveBadges}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    Save Changes
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {trustBadges.map((badge) => {
                                const isSelected = selectedBadges.includes(badge.id);
                                return (
                                    <div
                                        key={badge.id}
                                        onClick={() => toggleBadge(badge.id)}
                                        className={`relative cursor-pointer border rounded-lg p-4 transition-all duration-200 flex flex-col items-center text-center gap-3 group
                                            ${isSelected ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                                        `}
                                    >
                                        <button
                                            onClick={(e) => handleDeleteBadge(e, badge.id)}
                                            className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Badge"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>

                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors
                                            ${isSelected ? 'bg-primary-600' : 'bg-gray-100'}
                                        `}>
                                            <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors
                                                ${isSelected ? 'bg-white border-white' : 'border-gray-300 bg-white'}
                                            `}>
                                                {isSelected && <CheckCircle className="h-4 w-4 text-primary-600" />}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className={`font-medium ${isSelected ? 'text-primary-900' : 'text-gray-900'}`}>
                                                {badge.name}
                                            </h3>
                                            <p className={`text-xs mt-1 ${isSelected ? 'text-primary-700' : 'text-gray-500'}`}>
                                                {badge.description}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Column: Contact/Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Info</h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Mail className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase font-medium">Email</p>
                                    <p className="text-sm text-gray-900 font-medium break-all">{seller.email}</p>
                                </div>
                            </div>

                            {seller.phoneNumber && (
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg">
                                        <Smartphone className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium">Phone</p>
                                        <p className="text-sm text-gray-900 font-medium">{seller.phoneNumber}</p>
                                    </div>
                                </div>
                            )}

                            {seller.business?.address && (
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-100 rounded-lg mt-0.5">
                                        <MapPin className="h-5 w-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-medium">Address</p>
                                        <p className="text-sm text-gray-900">
                                            {seller.business.address.street}<br />
                                            {seller.business.address.city}, {seller.business.address.state} {seller.business.address.zipCode}<br />
                                            {seller.business.address.country}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Badge Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Trust Badge</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Badge ID</label>
                                <input
                                    type="text"
                                    value={newBadge.id}
                                    onChange={(e) => setNewBadge({ ...newBadge, id: e.target.value })}
                                    placeholder="e.g., brand_support"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Badge Name</label>
                                <input
                                    type="text"
                                    value={newBadge.name}
                                    onChange={(e) => setNewBadge({ ...newBadge, name: e.target.value })}
                                    placeholder="e.g., 7-day Brand Support"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
                                <textarea
                                    value={newBadge.description}
                                    onChange={(e) => setNewBadge({ ...newBadge, description: e.target.value })}
                                    placeholder="e.g., Seller provides 7-day brand support"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon Name</label>
                                <input
                                    type="text"
                                    value={newBadge.icon}
                                    onChange={(e) => setNewBadge({ ...newBadge, icon: e.target.value })}
                                    placeholder="e.g., shield-checkmark"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900"
                                />
                                <p className="text-xs text-gray-500 mt-1">Use Ionicons icon names</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setNewBadge({ id: '', name: '', description: '', icon: 'shield-checkmark' });
                                }}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateBadge}
                                disabled={creating}
                                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                Create Badge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
