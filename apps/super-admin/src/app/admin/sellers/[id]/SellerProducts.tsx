"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { Product } from "@/types";
import toast from "react-hot-toast";
import {
    Search, Package, Filter, ChevronDown, ChevronRight, Eye, Check, X,
    AlertCircle, AlertTriangle, ImageIcon, ChevronLeft, ChevronRight as ChevronRightIcon,
    Save, Calculator, Clock
} from "lucide-react";

interface SellerProductsProps {
    sellerId: string;
}

// Reuse FieldValue and FieldRow helper components from ReviewProductsPage
const FieldValue = ({ value, type = "text", label }: { value: any; type?: string; label?: string }) => {
    const isEmpty = value === undefined || value === null || value === "" ||
        (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
        return <span className="text-gray-400 text-sm">-</span>;
    }

    if (type === "status") return <StatusBadge status={value} />;
    if (type === "price") return <span className="font-medium text-gray-900">₹{value}</span>;
    if (type === "boolean") return <span className={`font-medium ${value ? "text-green-600" : "text-gray-500"}`}>{value ? "Yes" : "No"}</span>;
    if (type === "date") return <span className="text-gray-900">{new Date(value).toLocaleDateString()}</span>;
    if (type === "array") return <span className="text-gray-900">{Array.isArray(value) ? value.join(", ") : value}</span>;
    return <span className="font-medium text-gray-900">{value}</span>;
};

const FieldRow = ({ label, value, type = "text" }: { label?: string; value: any; type?: string }) => (
    <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors px-2 -mx-2 rounded items-center">
        <span className="text-gray-500 text-sm font-medium">{label}</span>
        <div className="text-right">
            <FieldValue value={value} type={type} />
        </div>
    </div>
);

// Helper to resolve image URLs
const getValidImageUrl = (url?: string) => {
    if (!url || url === "" || url === "string" || url === "url") return null;

    // 1. Full URLs (https://...) or Data URIs -> Return as is
    if (url.startsWith("http") || url.startsWith("data:")) return url;

    // 2. Relative paths starting with / (e.g. /uploads/...) -> Use API Base
    if (url.startsWith("/")) return `https://api.lfvs.in${url}`;

    // 3. Everything else (e.g. "products/shirt", "v123/img.jpg") -> Treat as Cloudinary Public ID
    // Using cloud_name: deljcbcvu found in codebase
    return `https://res.cloudinary.com/deljcbcvu/image/upload/q_auto,f_auto/${url}`;
};

const ProductImage = ({ product, className, fallbackClassName = "h-6 w-6" }: { product?: Product | null; className?: string; fallbackClassName?: string }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!product) return;

        // Try to resolve the best available image in order
        const candidate = getValidImageUrl(product.primaryImage) ||
            getValidImageUrl(product.image) ||
            (product.images && product.images.length > 0 ? getValidImageUrl(product.images[0]) : null);

        setImgSrc(candidate);
        setError(false);
    }, [product]);

    if (!imgSrc || error) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-gray-100 text-gray-400`}>
                <ImageIcon className={fallbackClassName} />
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={product?.title || "Product"}
            className={className}
            onError={() => setError(true)}
            loading="lazy"
        />
    );
};

// Simple Image component for direct URLs (e.g. from gallery array)
const GalleryImage = ({ src, alt, className, fallbackClassName = "h-6 w-6" }: { src?: string; alt: string; className?: string; fallbackClassName?: string }) => {
    const [error, setError] = useState(false);
    const validSrc = getValidImageUrl(src);

    if (!validSrc || error) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-gray-100 text-gray-400`}>
                <ImageIcon className={fallbackClassName} />
            </div>
        );
    }

    return (
        <img
            src={validSrc}
            alt={alt}
            className={className}
            onError={() => setError(true)}
            loading="lazy"
        />
    );
};

const StatusBadge = ({ status: rawStatus }: { status?: string }) => {
    const status = (rawStatus || 'UNKNOWN').toUpperCase();
    let badgeClass = 'bg-gray-100 text-gray-700 border-gray-200';
    let icon = null;

    if (status === 'APPROVED') {
        badgeClass = 'bg-green-100 text-green-800 border-green-200';
        icon = <Check className="h-3 w-3" />;
    } else if (status === 'REJECTED') {
        badgeClass = 'bg-red-100 text-red-800 border-red-200';
        icon = <X className="h-3 w-3" />;
    } else if (status === 'PENDING') {
        badgeClass = 'bg-amber-100 text-amber-800 border-amber-200';
        icon = <Clock className="h-3 w-3" />;
    } else if (status === 'SUSPENDED') {
        badgeClass = 'bg-red-100 text-red-800 border-red-200';
        icon = <AlertCircle className="h-3 w-3" />;
    }

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${badgeClass}`}>
            {icon}
            {status}
        </span>
    );
};

export default function SellerProducts({ sellerId }: SellerProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [detailModal, setDetailModal] = useState<Product | null>(null);
    const [rejectModal, setRejectModal] = useState<{ product: Product } | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [processing, setProcessing] = useState<string | null>(null);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    // Commission State
    const [platformCommission, setPlatformCommission] = useState<number>(0);
    const [influencerCommission, setInfluencerCommission] = useState<number>(0);
    const [savingCommissions, setSavingCommissions] = useState(false);

    useEffect(() => {
        fetchSellerProducts();
    }, [sellerId]);

    useEffect(() => {
        if (detailModal) {
            setSelectedImageIdx(0);
            setPlatformCommission(detailModal.platformCommission || 0);
            setInfluencerCommission(detailModal.influencerCommission || 0);
        }
    }, [detailModal]);

    const fetchSellerProducts = async () => {
        setLoading(true);
        try {
            // Try fetching from the nested resource endpoint
            // If this fails, we might need to adjust based on actual API
            const response = await api.get(`/api/super-admin/sellers/${sellerId}/products`);

            // Debug: Log first product's image fields from API
            if (response.data && response.data.length > 0) {
                const p = response.data[0];
                console.log('🔍 RAW API Response - First Product Image Fields:', {
                    title: p.title,
                    image: p.image,
                    images: p.images,
                    primaryImage: p.primaryImage,
                    thumbnailImage: p.thumbnailImage
                });
            }

            setProducts(response.data);

            // Expand all categories by default
            if (response.data && response.data.length > 0) {
                const categories = new Set<string>(response.data.map((p: Product) => p.category));
                setExpandedCategories(categories);
            }

        } catch (error) {
            console.error("Failed to fetch seller products:", error);
            // Fallback to general products endpoint if specific one implies searching
            try {
                const response = await api.get(`/api/super-admin/products`, { params: { sellerId } });
                setProducts(response.data.products || response.data);
            } catch (fallbackError) {
                console.error("Fallback fetch failed:", fallbackError);
                toast.error("Failed to load products");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (productId: string) => {
        setProcessing(productId);
        try {
            await api.patch(`/api/super-admin/products/${productId}/approve`);
            toast.success("Product approved!");
            setDetailModal(null);
            fetchSellerProducts(); // Refresh list
        } catch (error) {
            toast.error("Failed to approve product");
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async () => {
        if (!rejectModal || !rejectReason.trim()) return;
        setProcessing(rejectModal.product._id);
        try {
            await api.patch(`/api/super-admin/products/${rejectModal.product._id}/reject`, { reason: rejectReason });
            toast.success("Product rejected");
            setRejectModal(null);
            setDetailModal(null);
            setRejectReason("");
            fetchSellerProducts(); // Refresh list
        } catch (error) {
            toast.error("Failed to reject product");
        } finally {
            setProcessing(null);
        }
    };

    const handleSaveCommissions = async () => {
        if (!detailModal) return;

        if (influencerCommission > platformCommission) {
            toast.error("Influencer commission cannot be greater than Platform commission");
            return;
        }

        setSavingCommissions(true);
        try {
            await api.patch(`/api/super-admin/products/${detailModal._id}/commission`, {
                platformCommission,
                influencerCommission
            });
            toast.success("Commissions updated successfully");

            // Update local state without refetching everything
            setDetailModal(prev => prev ? ({ ...prev, platformCommission, influencerCommission }) : null);
            setProducts(prev => prev.map(p => p._id === detailModal._id ? { ...p, platformCommission, influencerCommission } : p));
        } catch (error) {
            console.error("Failed to update commissions:", error);
            toast.error("Failed to update commissions");
        } finally {
            setSavingCommissions(false);
        }
    };

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(category)) {
                next.delete(category);
            } else {
                next.add(category);
            }
            return next;
        });
    };

    // Filter and group products
    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const groupedProducts = filteredProducts.reduce((acc, product) => {
        const category = product.category || "Uncategorized";
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    const categories = Object.keys(groupedProducts).sort();

    const allImages = detailModal ? [detailModal.primaryImage || detailModal.image, ...(detailModal.images || [])].filter((img, idx, arr) => img && arr.indexOf(img) === idx) : [];

    if (loading) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products by name, SKU..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none text-gray-900"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Package className="h-4 w-4" />
                    <span>{filteredProducts.length} Products Found</span>
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No products found matching your criteria</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {categories.map(category => (
                        <div key={category} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {expandedCategories.has(category) ? <ChevronDown className="h-5 w-5 text-gray-500" /> : <ChevronRight className="h-5 w-5 text-gray-500" />}
                                    <h3 className="font-semibold text-gray-900">{category}</h3>
                                </div>
                                <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-xs font-medium">
                                    {groupedProducts[category].length} items
                                </span>
                            </button>

                            {expandedCategories.has(category) && (
                                <div className="divide-y divide-gray-100">
                                    {groupedProducts[category].map(product => (
                                        <div key={product._id} className="px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-gray-50 transition-colors">
                                            <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                <ProductImage
                                                    product={product}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0 space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                                                    <StatusBadge status={product.status || product.approvalStatus} />
                                                </div>
                                                <div className="text-sm text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                                                    <span>SKU: {product.sku || 'N/A'}</span>
                                                    <span>•</span>
                                                    <span className="font-medium text-gray-900">₹{product.price}</span>
                                                    <span>•</span>
                                                    <span>Stock: {product.stock}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                                                <button
                                                    onClick={() => setDetailModal(product)}
                                                    className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sm:hidden">View</span>
                                                </button>

                                                {product.status !== 'APPROVED' && (
                                                    <button
                                                        onClick={() => handleApprove(product._id)}
                                                        disabled={processing === product._id}
                                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
                                                        title="Approve Product"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </button>
                                                )}

                                                {product.status !== 'REJECTED' && (
                                                    <button
                                                        onClick={() => setRejectModal({ product })}
                                                        disabled={processing === product._id}
                                                        className="flex-1 sm:flex-none flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                                                        title="Reject Product"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* PRODUCT DETAIL MODAL */}
            {detailModal && (
                <div className="fixed inset-0 bg-black/60 z-50 overflow-y-auto flex justify-center py-10 px-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl flex flex-col relative my-auto">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-gray-50 to-white">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Product Details</h2>
                                <p className="text-sm text-gray-500">{detailModal.title}</p>
                            </div>
                            <button onClick={() => setDetailModal(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><X className="h-6 w-6 text-gray-500" /></button>
                        </div>

                        <div className="p-6">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                {/* Column 1: Images & Media */}
                                <div className="lg:col-span-1 space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="font-bold text-gray-900 text-sm uppercase tracking-wide border-b pb-2">11. Media ({allImages.length})</h3>
                                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            <GalleryImage
                                                src={allImages[selectedImageIdx]}
                                                alt="Product Preview"
                                                className="w-full h-full object-contain"
                                                fallbackClassName="h-12 w-12"
                                            />
                                        </div>
                                        {allImages.length > 1 && (
                                            <div className="flex items-center justify-center gap-4">
                                                <button onClick={() => setSelectedImageIdx(i => Math.max(0, i - 1))} disabled={selectedImageIdx === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronLeft className="h-6 w-6" /></button>
                                                <span className="text-sm font-medium">{selectedImageIdx + 1} / {allImages.length}</span>
                                                <button onClick={() => setSelectedImageIdx(i => Math.min(allImages.length - 1, i + 1))} disabled={selectedImageIdx === allImages.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronRightIcon className="h-6 w-6" /></button>
                                            </div>
                                        )}
                                        <div className="grid grid-cols-4 gap-2">
                                            {allImages.map((img, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setSelectedImageIdx(idx)}
                                                    className={`aspect-square rounded overflow-hidden border-2 transition-all ${selectedImageIdx === idx ? 'border-primary-500 ring-2 ring-primary-100' : 'border-transparent hover:border-gray-300'}`}
                                                >
                                                    <GalleryImage src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                                                </button>
                                            ))}
                                        </div>
                                        {detailModal.productVideo && (
                                            <div className="mt-4">
                                                <span className="text-xs font-semibold text-gray-500 uppercase">Product Video</span>
                                                <a href={detailModal.productVideo} target="_blank" rel="noopener noreferrer" className="block text-sm text-blue-600 hover:underline truncate mt-1">{detailModal.productVideo}</a>
                                            </div>
                                        )}
                                    </div>

                                    {/* 16. Verification (Moved here for visibility) */}
                                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                        <h4 className="font-bold text-sm text-purple-900 mb-3 border-b border-purple-200 pb-2">16. Verification</h4>
                                        <FieldRow label="Quality Check" value={detailModal.qualityCheckConfirmed} type="boolean" />
                                        <FieldRow label="Authenticity" value={detailModal.authenticityConfirmed} type="boolean" />
                                        <FieldRow label="Brand Auth" value={detailModal.brandAuthorizationConfirmed} type="boolean" />
                                        <FieldRow label="Active Status" value={detailModal.isActive} type="boolean" />
                                    </div>
                                </div>

                                {/* Column 2-4: Details - 17 Sections */}
                                <div className="lg:col-span-3 space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                                        {/* 1. Basic Details */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">1. Basic Details</h4>
                                            <FieldRow label="Title" value={detailModal.title} />
                                            <FieldRow label="Subtitle" value={detailModal.subtitle} />
                                            <FieldRow label="Slug" value={detailModal.slug} />
                                            <FieldRow label="Type" value={detailModal.productType} />
                                            <FieldRow label="Condition" value={detailModal.productCondition} />
                                            <FieldRow label="Status" value={detailModal.status || detailModal.approvalStatus} type="status" />
                                            <FieldRow label="Visibility" value={detailModal.visibility} />
                                            <FieldRow label="Sponsored" value={detailModal.isSponsored} type="boolean" />
                                        </div>

                                        {/* 2. Categorization */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">2. Categorization</h4>
                                            <FieldRow label="Category" value={detailModal.category} />
                                            <FieldRow label="Sub-Category" value={detailModal.subCategory} />
                                        </div>

                                        {/* 3. Brand & Manufacturer */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">3. Brand & Manufacturer</h4>
                                            <FieldRow label="Brand ID" value={detailModal.brand} />
                                            <FieldRow label="Brand Name" value={detailModal.brandName} />
                                            <FieldRow label="Manufacturer" value={detailModal.manufacturerName} />
                                            <FieldRow label="Origin Country" value={detailModal.countryOfOrigin} />
                                        </div>

                                        {/* 4. Inventory & Codes */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">4. Inventory & Codes</h4>
                                            <FieldRow label="SKU" value={detailModal.sku} />
                                            <FieldRow label="UPC" value={detailModal.upc} />
                                            <FieldRow label="Model Name" value={detailModal.modelName} />
                                            <FieldRow label="Internal Code" value={detailModal.internalCode} />
                                            <FieldRow label="Batch No." value={detailModal.batchNumber} />
                                            <FieldRow label="Serial Req." value={detailModal.serialNumberRequired} type="boolean" />
                                        </div>

                                        {/* 5. Pricing (Retail) */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">5. Pricing (Retail)</h4>
                                            <FieldRow label="Selling Price" value={detailModal.price} type="price" />
                                            <FieldRow label="MRP" value={detailModal.mrp} type="price" />
                                            <FieldRow label="Cost Price" value={detailModal.costPrice} type="price" />
                                            <FieldRow label="Tax Inclusive" value={detailModal.taxInclusive} type="boolean" />
                                            <FieldRow label="GST Rate" value={detailModal.gstRate ? `\${detailModal.gstRate}%` : undefined} />
                                        </div>

                                        {/* 6. Pricing (B2B/Wholesale) */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">6. Pricing (B2B)</h4>
                                            <FieldRow label="Wholesale Price" value={detailModal.wholesalePrice} type="price" />
                                            <FieldRow label="Min Wholesale Qty" value={detailModal.minWholesaleQty} />
                                            <FieldRow label="Bulk Discount" value={detailModal.bulkDiscountEnabled} type="boolean" />
                                            <FieldRow label="Tiered Pricing" value={detailModal.tieredPricing} type="boolean" />
                                            <FieldRow label="B2B Only" value={detailModal.businessOnlyVisibility} type="boolean" />
                                        </div>

                                        {/* 7. Stock */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">7. Stock Information</h4>
                                            <FieldRow label="Stock Qty" value={detailModal.stock} />
                                            <FieldRow label="Low Stock Alert" value={detailModal.lowStockThreshold} />
                                            <FieldRow label="Min Order Qty" value={detailModal.minOrderQty} />
                                            <FieldRow label="Max Order Qty" value={detailModal.maxOrderQty} />
                                            <FieldRow label="Inv. Type" value={detailModal.inventoryType} />
                                            <FieldRow label="Warehouse Loc" value={detailModal.warehouseLocation} />
                                        </div>

                                        {/* 8. Shipping & Logistics */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">8. Shipping & Logistics</h4>
                                            <FieldRow label="Weight (g)" value={detailModal.weight} />
                                            <FieldRow label="Net Weight" value={detailModal.netWeight} />
                                            <FieldRow label="Gross Weight" value={detailModal.grossWeight} />
                                            <FieldRow label="Dims (LxBxH)" value={detailModal.dimensions ? `\${detailModal.dimensions.length}x\${detailModal.dimensions.breadth}x\${detailModal.dimensions.height}` : undefined} />
                                            <FieldRow label="Shipping Charge" value={detailModal.shippingCharges} type="price" />
                                            <FieldRow label="Shipping Class" value={detailModal.shippingClass} />
                                            <FieldRow label="Processing" value={detailModal.processingTime ? `\${detailModal.processingTime.value} \${detailModal.processingTime.unit}` : undefined} />
                                            <FieldRow label="Pickup Loc" value={detailModal.pickupLocation} />
                                            <FieldRow label="Intl Shipping" value={detailModal.internationalShipping} type="boolean" />
                                            <FieldRow label="Fragile" value={detailModal.fragile} type="boolean" />
                                            <FieldRow label="Liquid" value={detailModal.liquid} type="boolean" />
                                            <FieldRow label="Hazardous" value={detailModal.hazardous} type="boolean" />
                                        </div>

                                        {/* 9. Returns & Warranty */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">9. Returns & Warranty</h4>
                                            <FieldRow label="Returnable" value={detailModal.returnable} type="boolean" />
                                            <FieldRow label="Return Window" value={detailModal.returnWindow ? `\${detailModal.returnWindow} days` : undefined} />
                                            <FieldRow label="Warranty Details" value={detailModal.warrantyDetails} />
                                            <FieldRow label="Warranty Duration" value={detailModal.warrantyDuration} />
                                        </div>

                                        {/* 13. Compliance */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">13. Compliance</h4>
                                            <FieldRow label="HSN Code" value={detailModal.hsnCode} />
                                            <FieldRow label="FSSAI No." value={detailModal.fssaiNumber} />
                                            <FieldRow label="Drug License" value={detailModal.drugLicenseNumber} />
                                            <FieldRow label="BIS Cert" value={detailModal.bisCertification} />
                                            <FieldRow label="GST Invoice" value={detailModal.gstInvoiceMandatory} type="boolean" />
                                            <div className="mt-2">
                                                <span className="text-xs text-gray-500">Safety Disclaimer</span>
                                                <p className="text-xs text-gray-700 bg-white p-1 rounded border border-gray-200">{detailModal.safetyDisclaimer || '-'}</p>
                                            </div>
                                            <div className="mt-2">
                                                <span className="text-xs text-gray-500">Legal Disclaimer</span>
                                                <p className="text-xs text-gray-700 bg-white p-1 rounded border border-gray-200">{detailModal.legalDisclaimer || '-'}</p>
                                            </div>
                                        </div>

                                        {/* 14. Dates */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">14. Important Dates</h4>
                                            <FieldRow label="Mfg Date" value={detailModal.manufacturingDate} type="date" />
                                            <FieldRow label="Expiry Date" value={detailModal.expiryDate} type="date" />
                                            <FieldRow label="Expiry Req" value={detailModal.expiryDateRequired} type="boolean" />
                                            <FieldRow label="Sale Start" value={detailModal.saleStartDate} type="date" />
                                            <FieldRow label="Sale End" value={detailModal.saleEndDate} type="date" />
                                            <FieldRow label="Created At" value={detailModal.createdAt} type="date" />
                                        </div>
                                    </div>

                                    {/* Full Width Sections */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* 10. Description & Content */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">10. Description & Content</h4>
                                            <div className="space-y-3">
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase">Short Description</span>
                                                    <p className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200 mt-1 whitespace-pre-wrap">{detailModal.shortDescription || '-'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-semibold text-gray-500 uppercase">Full Description</span>
                                                    <div className="text-sm text-gray-700 bg-white p-2 rounded border border-gray-200 mt-1 whitespace-pre-wrap">{detailModal.description || '-'}</div>
                                                </div>
                                                <FieldRow label="Box Contents" value={detailModal.boxContents} />
                                                <FieldRow label="Key Features" value={detailModal.keyFeatures} type="array" />
                                                <FieldRow label="Usage Instr." value={detailModal.usageInstructions} />
                                                <FieldRow label="Care Instr." value={detailModal.careInstructions} />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {/* 12. Offers */}
                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">12. Offers & Deals</h4>
                                                <FieldRow label="Flash Sale" value={detailModal.flashSaleEligible} type="boolean" />
                                                <FieldRow label="Deal of Day" value={detailModal.dealOfDayEligible} type="boolean" />
                                                <FieldRow label="Bank Offers" value={detailModal.bankOfferEnabled} type="boolean" />
                                                <FieldRow label="Eligible for Offers" value={detailModal.eligibleForOffers} type="boolean" />
                                                <div className="mt-2">
                                                    <span className="text-xs text-gray-500">Active Offers</span>
                                                    <pre className="text-xs text-gray-700 bg-white p-2 rounded border border-gray-200 mt-1 overflow-auto">{JSON.stringify(detailModal.offers || [], null, 2)}</pre>
                                                </div>
                                            </div>

                                            {/* 15. SEO */}
                                            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                <h4 className="font-bold text-sm text-gray-900 mb-3 border-b border-gray-200 pb-2">15. SEO & Metadata</h4>
                                                <FieldRow label="Meta Title" value={detailModal.metaTitle} />
                                                <FieldRow label="Meta Desc" value={detailModal.metaDescription} />
                                                <FieldRow label="Meta Keys" value={detailModal.metaKeywords} type="array" />
                                                <FieldRow label="SEO Keys" value={detailModal.seoKeywords} />
                                                <FieldRow label="Search Keys" value={detailModal.searchKeywords} />
                                                <FieldRow label="URL Slug" value={detailModal.urlSlug} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* Commission Management Section */}
                            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <div className="flex items-center gap-2 mb-4 border-b border-blue-200 pb-2">
                                    <Calculator className="h-5 w-5 text-blue-600" />
                                    <h4 className="font-bold text-sm text-blue-900">6. Commission Management</h4>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Product Selling Price</div>
                                            <div className="text-2xl font-bold text-gray-900 mt-1">₹{detailModal.price}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Platform Commission (%)
                                                <span className="text-xs text-gray-500 ml-1">(Charged from Seller)</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={platformCommission}
                                                    onChange={(e) => setPlatformCommission(Number(e.target.value))}
                                                    className="w-full pl-3 pr-8 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900"
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Influencer Commission (%)
                                                <span className="text-xs text-gray-500 ml-1">(Deducted from Platform share)</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={influencerCommission}
                                                    onChange={(e) => setInfluencerCommission(Number(e.target.value))}
                                                    className={`w-full pl-3 pr-8 py-2 border rounded-lg focus:ring-2 focus:outline-none text-gray-900 ${influencerCommission > platformCommission ? 'border-red-300 ring-red-200 bg-red-50' : 'border-blue-300 focus:ring-blue-500'}`}
                                                />
                                                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                                            </div>
                                            {influencerCommission > platformCommission && (
                                                <p className="text-xs text-red-600 mt-1">Cannot exceed Platform Commission ({platformCommission}%)</p>
                                            )}
                                        </div>

                                        <button
                                            onClick={handleSaveCommissions}
                                            disabled={savingCommissions || influencerCommission > platformCommission}
                                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                                        >
                                            {savingCommissions ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : <Save className="h-4 w-4" />}
                                            Save Commissions
                                        </button>
                                    </div>

                                    <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm">
                                        <h5 className="font-semibold text-gray-900 mb-3 text-sm">Estimated Breakdown (Per Unit)</h5>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Product Price:</span>
                                                <span className="font-medium text-gray-900">₹{detailModal.price}</span>
                                            </div>
                                            <div className="h-px bg-gray-100 my-1"></div>
                                            <div className="flex justify-between text-red-600">
                                                <span>Platform Charge ({platformCommission}%):</span>
                                                <span>- ₹{((detailModal.price * platformCommission) / 100).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between pl-4 text-gray-500 text-xs">
                                                <span>↳ Influencer Share ({influencerCommission}%):</span>
                                                <span>₹{((detailModal.price * influencerCommission) / 100).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between pl-4 text-gray-500 text-xs">
                                                <span>↳ Net Platform Revenue:</span>
                                                <span>₹{((detailModal.price * (platformCommission - influencerCommission)) / 100).toFixed(2)}</span>
                                            </div>
                                            <div className="h-px bg-gray-200 my-2"></div>
                                            <div className="flex justify-between text-green-700 font-bold text-base">
                                                <span>Seller Earnings:</span>
                                                <span>₹{(detailModal.price - (detailModal.price * platformCommission) / 100).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                            <button onClick={() => setDetailModal(null)} className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors">Close</button>
                            {detailModal.status !== 'REJECTED' && (
                                <button onClick={() => setRejectModal({ product: detailModal })} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors">
                                    <X className="h-4 w-4" /> Reject
                                </button>
                            )}
                            {detailModal.status !== 'APPROVED' && (
                                <button onClick={() => handleApprove(detailModal._id)} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors">
                                    <Check className="h-4 w-4" /> Approve
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <div className="flex items-center gap-3 mb-4 text-red-600">
                            <AlertCircle className="h-6 w-6" />
                            <h3 className="text-lg font-bold text-gray-900">Reject Product</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">You are about to reject <strong>{rejectModal.product.title}</strong>. Please provide a reason.</p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="E.g., Low quality images, Incorrect categorization..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none text-gray-900"
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setRejectModal(null); setRejectReason(""); }} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                            <button onClick={handleReject} disabled={!rejectReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-medium">Reject Product</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
