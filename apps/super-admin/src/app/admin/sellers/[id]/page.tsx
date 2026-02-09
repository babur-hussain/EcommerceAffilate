"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { ArrowLeft, Save, Loader2, Smartphone, Mail, MapPin, Building2, Calendar, CheckCircle, Trash2, Shield, FileText, Banknote, Package, Settings, Check, X } from "lucide-react";
import toast from "react-hot-toast";
import { Seller } from "@/types";
import { formatDate } from "@/lib/utils";
import SellerProducts from "./SellerProducts";

export default function SellerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [seller, setSeller] = useState<Seller | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [activating, setActivating] = useState(false);
    const [trustBadges, setTrustBadges] = useState<Array<{ id: string; name: string; description: string; icon: string }>>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newBadge, setNewBadge] = useState({ id: '', name: '', description: '', icon: 'shield-checkmark' });
    const [creating, setCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<'details' | 'products'>('details');

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

    const handleActivateAccount = async () => {
        if (!seller?.business?._id) return;

        const action = seller.business.status === 'APPROVED' ? 'deactivate' : 'activate';
        if (!window.confirm(`Are you sure you want to ${action} this seller account?`)) {
            return;
        }

        setActivating(true);
        try {
            const newStatus = seller.business.status === 'APPROVED' ? 'SUSPENDED' : 'APPROVED';
            await api.patch(`/api/super-admin/businesses/${seller.business._id}/status`, {
                status: newStatus
            });

            toast.success(`Account ${action}d successfully`);

            // Refresh seller data
            fetchSellerDetails();
        } catch (error: any) {
            console.error("Error updating account status:", error);
            toast.error(error.response?.data?.error || `Failed to ${action} account`);
        } finally {
            setActivating(false);
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
        if (!seller?.business?._id) return;

        setSaving(true);
        try {
            await api.patch(`/api/super-admin/businesses/${seller.business._id}/trust-badges`, {
                badges: selectedBadges
            });
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
            setTrustBadges(prev => prev.filter(b => b.id !== badgeId));
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

    const business = seller.business;

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-6 w-6 text-gray-500" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
                        <p className="text-sm text-gray-500">Seller ID: {seller._id}</p>
                    </div>
                </div>

                {/* Activate/Deactivate Button */}
                {business && (
                    <button
                        onClick={handleActivateAccount}
                        disabled={activating}
                        className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${business.status === 'APPROVED'
                            ? 'bg-red-600 hover:bg-red-700 text-white'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                            } disabled:opacity-50`}
                    >
                        {activating ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : business.status === 'APPROVED' ? (
                            <>
                                <X className="h-5 w-5" />
                                Deactivate Account
                            </>
                        ) : (
                            <>
                                <Check className="h-5 w-5" />
                                Activate Account
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => setActiveTab('details')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${activeTab === 'details'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        `}
                    >
                        Seller Profile
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                            ${activeTab === 'products'
                                ? 'border-primary-500 text-primary-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                        `}
                    >
                        Products
                    </button>
                    {/* Add other tabs like 'Orders', 'Transactions' here in future */}
                </nav>
            </div>

            {activeTab === 'products' ? (
                <SellerProducts sellerId={params.id as string} />
            ) : !business ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500 text-lg">No business registration found for this seller</p>
                </div>
            ) : (
                <>
                    {/* Status Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Status</h3>
                                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                                    ${business.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        business.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                            business.status === 'SUSPENDED' ? 'bg-orange-100 text-orange-800' :
                                                'bg-red-100 text-red-800'}`}>
                                    {business.status}
                                </span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Account Type</p>
                                <p className="text-lg font-semibold text-gray-900 capitalize">{business.accountType}</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Identity */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary-600" />
                            Business Identity
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoField label="Legal Business Name" value={business.businessIdentity?.legalBusinessName} />
                            <InfoField label="Trade Name" value={business.businessIdentity?.tradeName} />
                            <InfoField label="Business Type" value={business.businessIdentity?.businessType} />
                            <InfoField label="Nature of Business" value={business.businessIdentity?.natureOfBusiness} />
                            <InfoField label="Year of Establishment" value={business.businessIdentity?.yearOfEstablishment?.toString()} />
                        </div>
                    </div>

                    {/* Owner Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Smartphone className="h-5 w-5 text-primary-600" />
                            Owner / Authorized Person Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoField label="Full Name" value={business.ownerDetails?.fullName} />
                            <InfoField label="Designation" value={business.ownerDetails?.designation} />
                            <InfoField label="Mobile Number" value={business.ownerDetails?.mobileNumber} />
                            <InfoField label="Email" value={business.ownerDetails?.email} />
                            <InfoField label="Date of Birth" value={business.ownerDetails?.dateOfBirth ? formatDate(business.ownerDetails.dateOfBirth) : '-'} />
                            <InfoField label="Gender" value={business.ownerDetails?.gender || '-'} />
                            <InfoField label="Government ID Type" value={business.ownerDetails?.governmentIdType} />
                            <InfoField label="Government ID Number" value={business.ownerDetails?.governmentIdNumber} />
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary-600" />
                            Business Addresses
                        </h2>

                        {/* Registered Address */}
                        <div className="mb-6">
                            <h3 className="text-md font-semibold text-gray-700 mb-3">Registered Address</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                <InfoField label="Address Line 1" value={business.addresses?.registered?.addressLine1} />
                                <InfoField label="Address Line 2" value={business.addresses?.registered?.addressLine2 || '-'} />
                                <InfoField label="City" value={business.addresses?.registered?.city} />
                                <InfoField label="District" value={business.addresses?.registered?.district || '-'} />
                                <InfoField label="State" value={business.addresses?.registered?.state} />
                                <InfoField label="Country" value={business.addresses?.registered?.country} />
                                <InfoField label="Pincode" value={business.addresses?.registered?.pincode} />
                            </div>
                        </div>

                        {/* Operational Address */}
                        {business.addresses?.operational && !business.addresses.operational.sameAsRegistered && (
                            <div className="mb-6">
                                <h3 className="text-md font-semibold text-gray-700 mb-3">Operational Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <InfoField label="Address Line 1" value={business.addresses.operational.addressLine1} />
                                    <InfoField label="Address Line 2" value={business.addresses.operational.addressLine2 || '-'} />
                                    <InfoField label="City" value={business.addresses.operational.city} />
                                    <InfoField label="State" value={business.addresses.operational.state} />
                                    <InfoField label="Pincode" value={business.addresses.operational.pincode} />
                                </div>
                            </div>
                        )}

                        {/* Warehouse Address */}
                        {business.addresses?.warehouse?.addressLine1 && (
                            <div>
                                <h3 className="text-md font-semibold text-gray-700 mb-3">Warehouse Address</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <InfoField label="Address Line 1" value={business.addresses.warehouse.addressLine1} />
                                    <InfoField label="City" value={business.addresses.warehouse.city} />
                                    <InfoField label="State" value={business.addresses.warehouse.state} />
                                    <InfoField label="Pincode" value={business.addresses.warehouse.pincode} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tax & Legal */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <FileText className="h-5 w-5 text-primary-600" />
                            Tax & Legal Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoField label="GSTIN Number" value={business.taxLegal?.gstinNumber} />
                            <InfoField label="GST Registration Type" value={business.taxLegal?.gstRegistrationType} />
                            <InfoField label="PAN Number" value={business.taxLegal?.panNumber} />
                            <InfoField label="CIN/LLPIN" value={business.taxLegal?.cinLlpin || '-'} />
                            <InfoField label="MSME/Udyam Number" value={business.taxLegal?.msmeUdyamNumber || '-'} />
                        </div>
                    </div>

                    {/* Bank Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Banknote className="h-5 w-5 text-primary-600" />
                            Bank & Payment Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoField label="Account Holder Name" value={business.bankDetails?.accountHolderName} />
                            <InfoField label="Bank Name" value={business.bankDetails?.bankName} />
                            <InfoField label="Account Number" value={business.bankDetails?.accountNumber} />
                            <InfoField label="IFSC Code" value={business.bankDetails?.ifscCode} />
                            <InfoField label="Account Type" value={business.bankDetails?.accountType} />
                            <InfoField label="Settlement Cycle" value={business.bankDetails?.settlementCycle} />
                        </div>
                    </div>

                    {/* Store Profile */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary-600" />
                            Store Profile
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoField label="Brand Ownership" value={business.storeProfile?.brandOwnership} />
                            <InfoField label="Website URL" value={business.storeProfile?.websiteUrl || '-'} />
                            <InfoField label="Categories" value={business.storeProfile?.categories?.join(', ') || '-'} />
                        </div>
                        {business.storeProfile?.description && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                                <p className="text-gray-900">{business.storeProfile.description}</p>
                            </div>
                        )}
                        {business.storeProfile?.socialMediaLinks && (
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-500 mb-2">Social Media Links</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {business.storeProfile.socialMediaLinks.facebook && <InfoField label="Facebook" value={business.storeProfile.socialMediaLinks.facebook} />}
                                    {business.storeProfile.socialMediaLinks.instagram && <InfoField label="Instagram" value={business.storeProfile.socialMediaLinks.instagram} />}
                                    {business.storeProfile.socialMediaLinks.twitter && <InfoField label="Twitter" value={business.storeProfile.socialMediaLinks.twitter} />}
                                    {business.storeProfile.socialMediaLinks.linkedin && <InfoField label="LinkedIn" value={business.storeProfile.socialMediaLinks.linkedin} />}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Logistics */}
                    {business.logistics && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Settings className="h-5 w-5 text-primary-600" />
                                Logistics & Shipping
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <InfoField label="Packaging Type" value={business.logistics.packagingType} />
                                <InfoField label="Pickup Address" value={business.logistics.pickupAddress || '-'} />
                                <InfoField label="Return Address" value={business.logistics.returnAddress || '-'} />
                                <InfoField label="Return Policy Accepted" value={business.logistics.returnPolicyAccepted ? 'Yes' : 'No'} />
                            </div>
                        </div>
                    )}

                    {/* Compliance */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-primary-600" />
                            Compliance & Agreements
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <InfoField label="Seller Agreement" value={business.compliance?.sellerAgreementAccepted ? '✓ Accepted' : '✗ Not Accepted'} />
                            <InfoField label="Platform Policies" value={business.compliance?.platformPoliciesAccepted ? '✓ Accepted' : '✗ Not Accepted'} />
                            <InfoField label="Tax Responsibility" value={business.compliance?.taxResponsibilityAccepted ? '✓ Accepted' : '✗ Not Accepted'} />
                            <InfoField label="Accepted At" value={business.compliance?.acceptedAt ? formatDate(business.compliance.acceptedAt) : '-'} />
                        </div>
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
                </>
            )}

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

// Helper component for displaying info fields
function InfoField({ label, value }: { label: string; value?: string | null }) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{label}</label>
            <p className="text-gray-900 font-medium break-words">{value || '-'}</p>
        </div>
    );
}
