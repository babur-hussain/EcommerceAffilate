"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Check, X, Package, ChevronDown, ChevronRight, Clock, AlertCircle, Eye, AlertTriangle, ImageIcon, ChevronLeft, ChevronRight as ChevronRightIcon } from "lucide-react";
import toast from "react-hot-toast";

interface PendingProduct {
    _id: string;
    title: string;
    slug: string;
    subtitle?: string;
    description?: string;
    shortDescription?: string;
    price: number;
    mrp?: number;
    costPrice?: number;
    category: string;
    subCategory?: string;
    brand?: string;
    brandName?: string;
    manufacturerName?: string;
    countryOfOrigin?: string;
    modelName?: string;
    sku?: string;
    hsnCode?: string;
    productType?: string;
    productCondition?: string;
    upc?: string;
    internalCode?: string;
    batchNumber?: string;
    serialNumberRequired?: boolean;
    image: string;
    images?: string[];
    primaryImage: string;
    thumbnailImage?: string;
    productVideo?: string;
    stock: number;
    minOrderQty?: number;
    maxOrderQty?: number;
    lowStockThreshold?: number;
    inventoryType?: string;
    warehouseLocation?: string;
    weight?: number;
    netWeight?: string;
    grossWeight?: string;
    dimensions?: { length: number; breadth: number; height: number };
    fragile?: boolean;
    liquid?: boolean;
    hazardous?: boolean;
    warrantyDetails?: string;
    warrantyDuration?: string;
    shippingCharges?: number;
    shippingClass?: string;
    isCodAvailable?: boolean;
    codAvailable?: boolean;
    processingTime?: { value: number; unit: string };
    pickupLocation?: string;
    internationalShipping?: boolean;
    protectPromiseFee?: number;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    seoKeywords?: string;
    searchKeywords?: string;
    urlSlug?: string;
    saleStartDate?: string;
    saleEndDate?: string;
    offers?: any[];
    lastChanceOffers?: any[];
    fees?: any[];
    trustBadges?: string[];
    keyFeatures?: string[];
    boxContents?: string;
    usageInstructions?: string;
    careInstructions?: string;
    returnable?: boolean;
    returnWindow?: number;
    gstRate?: number;
    taxInclusive?: boolean;
    discountType?: string;
    discountValue?: number;
    fssaiNumber?: string;
    drugLicenseNumber?: string;
    bisCertification?: string;
    expiryDateRequired?: boolean;
    manufacturingDate?: string;
    expiryDate?: string;
    safetyDisclaimer?: string;
    legalDisclaimer?: string;
    eligibleForOffers?: boolean;
    bankOfferEnabled?: boolean;
    flashSaleEligible?: boolean;
    dealOfDayEligible?: boolean;
    bulkDiscountEnabled?: boolean;
    wholesalePrice?: number;
    minWholesaleQty?: number;
    tieredPricing?: boolean;
    businessOnlyVisibility?: boolean;
    gstInvoiceMandatory?: boolean;
    qualityCheckConfirmed?: boolean;
    authenticityConfirmed?: boolean;
    brandAuthorizationConfirmed?: boolean;
    status?: string;
    publishDate?: string;
    visibility?: string;
    variants?: any[];
    attributes?: any[];
    createdAt: string;
}

interface SellerGroup {
    businessId: string;
    businessName: string;
    businessType: string;
    products: PendingProduct[];
}

interface PendingProductsResponse {
    totalPending: number;
    sellers: SellerGroup[];
}

// Helper to display field value or "Not provided" indicator
const FieldValue = ({ value, type = "text", label }: { value: any; type?: string; label?: string }) => {
    const isEmpty = value === undefined || value === null || value === "" ||
        (Array.isArray(value) && value.length === 0);

    if (isEmpty) {
        return <span className="text-orange-500 italic text-xs flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Not provided</span>;
    }

    if (type === "price") return <span className="font-medium">₹{value}</span>;
    if (type === "boolean") return <span className={value ? "text-green-600" : "text-gray-500"}>{value ? "Yes ✓" : "No"}</span>;
    if (type === "date") return <span>{new Date(value).toLocaleDateString()}</span>;
    if (type === "array") return <span>{Array.isArray(value) ? value.join(", ") : value}</span>;
    return <span className="font-medium">{value}</span>;
};

// Field row component for consistent display
const FieldRow = ({ label, value, type = "text" }: { label: string; value: any; type?: string }) => (
    <div className="flex justify-between py-1.5 border-b border-gray-100 last:border-0">
        <span className="text-gray-500 text-sm">{label}</span>
        <FieldValue value={value} type={type} />
    </div>
);

export default function ReviewProductsPage() {
    const [data, setData] = useState<PendingProductsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [expandedSellers, setExpandedSellers] = useState<Set<string>>(new Set());
    const [rejectModal, setRejectModal] = useState<{ product: PendingProduct } | null>(null);
    const [detailModal, setDetailModal] = useState<PendingProduct | null>(null);
    const [rejectReason, setRejectReason] = useState("");
    const [processing, setProcessing] = useState<string | null>(null);
    const [selectedImageIdx, setSelectedImageIdx] = useState(0);

    useEffect(() => {
        fetchPendingProducts();
    }, []);

    useEffect(() => {
        if (detailModal) {
            setSelectedImageIdx(0);
        }
    }, [detailModal]);

    const fetchPendingProducts = async () => {
        try {
            const response = await api.get<PendingProductsResponse>("/api/super-admin/products/pending");
            setData(response.data);
            const allIds = new Set<string>(response.data.sellers.map((s: SellerGroup) => s.businessId));
            setExpandedSellers(allIds);
        } catch (error) {
            console.error("Failed to fetch pending products:", error);
            toast.error("Failed to load pending products");
        } finally {
            setLoading(false);
        }
    };

    const toggleSeller = (businessId: string) => {
        setExpandedSellers((prev) => {
            const next = new Set(prev);
            next.has(businessId) ? next.delete(businessId) : next.add(businessId);
            return next;
        });
    };

    const handleApprove = async (productId: string) => {
        setProcessing(productId);
        try {
            await api.patch(`/api/super-admin/products/${productId}/approve`);
            toast.success("Product approved!");
            setDetailModal(null);
            fetchPendingProducts();
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
            fetchPendingProducts();
        } catch (error) {
            toast.error("Failed to reject product");
        } finally {
            setProcessing(null);
        }
    };

    const allImages = detailModal ? [detailModal.primaryImage || detailModal.image, ...(detailModal.images || [])].filter((img, idx, arr) => img && arr.indexOf(img) === idx) : [];

    if (loading) {
        return <div className="flex items-center justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Review Products</h1>
                    <p className="text-gray-600 mt-1">Review all 17 sections of product details</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg">
                    <Clock className="h-5 w-5" />
                    <span className="font-semibold">{data?.totalPending || 0}</span>
                    <span>pending</span>
                </div>
            </div>

            {(!data || data.sellers.length === 0) && (
                <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending products</h3>
                </div>
            )}

            {data?.sellers.map((seller) => (
                <div key={seller.businessId} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <button onClick={() => toggleSeller(seller.businessId)} className="w-full flex items-center justify-between px-6 py-4 bg-gray-50 hover:bg-gray-100">
                        <div className="flex items-center gap-3">
                            {expandedSellers.has(seller.businessId) ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                            <div className="text-left">
                                <h3 className="font-semibold text-gray-900">{seller.businessName}</h3>
                                <p className="text-sm text-gray-500">{seller.businessType}</p>
                            </div>
                        </div>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">{seller.products.length} products</span>
                    </button>
                    {expandedSellers.has(seller.businessId) && (
                        <div className="divide-y divide-gray-100">
                            {seller.products.map((product) => (
                                <div key={product._id} className="px-6 py-4 flex items-center gap-4">
                                    <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                                        {product.primaryImage || product.image ? <img src={product.primaryImage || product.image} alt={product.title} className="h-full w-full object-cover" /> : <Package className="h-8 w-8 text-gray-400 m-auto" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 truncate">{product.title}</h4>
                                        <div className="text-sm text-gray-500">₹{product.price} • {product.category} • Stock: {product.stock}</div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => setDetailModal(product)} className="flex items-center gap-1 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"><Eye className="h-4 w-4" /> View All Details</button>
                                        <button onClick={() => handleApprove(product._id)} disabled={processing === product._id} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"><Check className="h-4 w-4" /></button>
                                        <button onClick={() => setRejectModal({ product })} disabled={processing === product._id} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"><X className="h-4 w-4" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}

            {/* COMPREHENSIVE PRODUCT DETAIL MODAL - ALL 17 SECTIONS */}
            {detailModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
                        <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-primary-50 to-primary-100">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Complete Product Review</h2>
                                <p className="text-sm text-gray-600">All 17 sections • <span className="text-orange-500">⚠ Orange = Empty field</span></p>
                            </div>
                            <button onClick={() => setDetailModal(null)} className="p-2 hover:bg-gray-200 rounded-lg"><X className="h-5 w-5" /></button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                {/* Column 1: Images */}
                                <div className="lg:col-span-1 space-y-3">
                                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide border-b pb-2">📷 Images ({allImages.length})</h3>
                                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 border">
                                        {allImages[selectedImageIdx] ? <img src={allImages[selectedImageIdx]} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-orange-500"><ImageIcon className="h-12 w-12" /><span className="text-xs ml-2">No image</span></div>}
                                    </div>
                                    {allImages.length > 1 && (
                                        <div className="flex items-center justify-center gap-2">
                                            <button onClick={() => setSelectedImageIdx(i => Math.max(0, i - 1))} className="p-1 bg-gray-200 rounded"><ChevronLeft className="h-4 w-4" /></button>
                                            <span className="text-sm">{selectedImageIdx + 1} / {allImages.length}</span>
                                            <button onClick={() => setSelectedImageIdx(i => Math.min(allImages.length - 1, i + 1))} className="p-1 bg-gray-200 rounded"><ChevronRightIcon className="h-4 w-4" /></button>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-4 gap-1">
                                        {allImages.map((img, idx) => (
                                            <button key={idx} onClick={() => setSelectedImageIdx(idx)} className={`aspect-square rounded overflow-hidden border-2 ${selectedImageIdx === idx ? 'border-primary-500' : 'border-transparent'}`}>
                                                <img src={img} className="w-full h-full object-cover" />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Column 2-4: All Sections */}
                                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {/* 1. Product Basics */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">1️⃣ Product Basics</h4>
                                        <FieldRow label="Title" value={detailModal.title} />
                                        <FieldRow label="Subtitle" value={detailModal.subtitle} />
                                        <FieldRow label="Category" value={detailModal.category} />
                                        <FieldRow label="Sub-Category" value={detailModal.subCategory} />
                                        <FieldRow label="Product Type" value={detailModal.productType} />
                                        <FieldRow label="Brand Name" value={detailModal.brandName || detailModal.brand} />
                                        <FieldRow label="Manufacturer" value={detailModal.manufacturerName} />
                                        <FieldRow label="Country of Origin" value={detailModal.countryOfOrigin} />
                                        <FieldRow label="Model Name" value={detailModal.modelName} />
                                        <FieldRow label="SKU" value={detailModal.sku} />
                                        <FieldRow label="HSN Code" value={detailModal.hsnCode} />
                                        <FieldRow label="Condition" value={detailModal.productCondition} />
                                    </div>

                                    {/* 2. Product Identifiers */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">2️⃣ Product Identifiers</h4>
                                        <FieldRow label="UPC/Barcode" value={detailModal.upc} />
                                        <FieldRow label="Internal Code" value={detailModal.internalCode} />
                                        <FieldRow label="Batch Number" value={detailModal.batchNumber} />
                                        <FieldRow label="Serial Number Required" value={detailModal.serialNumberRequired} type="boolean" />
                                    </div>

                                    {/* 3. Sale Configuration */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">3️⃣ Sale Configuration</h4>
                                        <FieldRow label="Sale Start Date" value={detailModal.saleStartDate} type="date" />
                                        <FieldRow label="Sale End Date" value={detailModal.saleEndDate} type="date" />
                                        <FieldRow label="Protect Promise Fee" value={detailModal.protectPromiseFee} type="price" />
                                    </div>

                                    {/* 4. Pricing & Taxation */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">4️⃣ Pricing & Taxation</h4>
                                        <FieldRow label="MRP" value={detailModal.mrp} type="price" />
                                        <FieldRow label="Selling Price" value={detailModal.price} type="price" />
                                        <FieldRow label="Cost Price" value={detailModal.costPrice} type="price" />
                                        <FieldRow label="Discount Type" value={detailModal.discountType} />
                                        <FieldRow label="Discount Value" value={detailModal.discountValue} />
                                        <FieldRow label="GST Rate" value={detailModal.gstRate ? `${detailModal.gstRate}%` : undefined} />
                                        <FieldRow label="Tax Inclusive" value={detailModal.taxInclusive} type="boolean" />
                                    </div>

                                    {/* 5. Inventory & Stock */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">5️⃣ Inventory & Stock</h4>
                                        <FieldRow label="Stock" value={detailModal.stock} />
                                        <FieldRow label="Min Order Qty" value={detailModal.minOrderQty} />
                                        <FieldRow label="Max Order Qty" value={detailModal.maxOrderQty} />
                                        <FieldRow label="Low Stock Threshold" value={detailModal.lowStockThreshold} />
                                        <FieldRow label="Inventory Type" value={detailModal.inventoryType} />
                                        <FieldRow label="Warehouse Location" value={detailModal.warehouseLocation} />
                                    </div>

                                    {/* 6. Variants */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">6️⃣ Product Variants</h4>
                                        <FieldRow label="Variants Count" value={detailModal.variants?.length || 0} />
                                        {detailModal.variants && detailModal.variants.length > 0 ? (
                                            <div className="text-xs text-green-600">✓ {detailModal.variants.length} variant(s) configured</div>
                                        ) : <FieldValue value={undefined} />}
                                    </div>

                                    {/* 7. Description & Content */}
                                    <div className="bg-gray-50 rounded-lg p-3 md:col-span-2">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">7️⃣ Description & Content</h4>
                                        <div className="space-y-2 text-sm">
                                            <div><span className="text-gray-500">Short Description:</span><div className="bg-white p-2 rounded mt-1 max-h-16 overflow-y-auto">{detailModal.shortDescription || <FieldValue value={undefined} />}</div></div>
                                            <div><span className="text-gray-500">Full Description:</span><div className="bg-white p-2 rounded mt-1 max-h-24 overflow-y-auto whitespace-pre-wrap text-xs">{detailModal.description || <FieldValue value={undefined} />}</div></div>
                                            <FieldRow label="Key Features" value={detailModal.keyFeatures} type="array" />
                                            <FieldRow label="Box Contents" value={detailModal.boxContents} />
                                            <FieldRow label="Usage Instructions" value={detailModal.usageInstructions} />
                                            <FieldRow label="Care Instructions" value={detailModal.careInstructions} />
                                            <FieldRow label="Warranty Duration" value={detailModal.warrantyDuration} />
                                            <FieldRow label="Warranty Details" value={detailModal.warrantyDetails} />
                                            <FieldRow label="Returnable" value={detailModal.returnable} type="boolean" />
                                            <FieldRow label="Return Window" value={detailModal.returnWindow ? `${detailModal.returnWindow} days` : undefined} />
                                        </div>
                                    </div>

                                    {/* 8. Media & Assets */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">8️⃣ Media & Assets</h4>
                                        <FieldRow label="Primary Image" value={detailModal.primaryImage} />
                                        <FieldRow label="Thumbnail" value={detailModal.thumbnailImage} />
                                        <FieldRow label="Images Count" value={detailModal.images?.length || 0} />
                                        <FieldRow label="Product Video" value={detailModal.productVideo} />
                                    </div>

                                    {/* 9. Physical Attributes */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">9️⃣ Physical Attributes</h4>
                                        <FieldRow label="Net Weight" value={detailModal.netWeight || detailModal.weight} />
                                        <FieldRow label="Gross Weight" value={detailModal.grossWeight} />
                                        <FieldRow label="Dimensions (L×W×H)" value={detailModal.dimensions ? `${detailModal.dimensions.length} × ${detailModal.dimensions.breadth} × ${detailModal.dimensions.height} cm` : undefined} />
                                        <FieldRow label="Fragile" value={detailModal.fragile} type="boolean" />
                                        <FieldRow label="Liquid" value={detailModal.liquid} type="boolean" />
                                        <FieldRow label="Hazardous" value={detailModal.hazardous} type="boolean" />
                                    </div>

                                    {/* 10. Shipping & Logistics */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">🔟 Shipping & Logistics</h4>
                                        <FieldRow label="Shipping Class" value={detailModal.shippingClass} />
                                        <FieldRow label="Pickup Location" value={detailModal.pickupLocation} />
                                        <FieldRow label="Processing Time" value={detailModal.processingTime ? `${detailModal.processingTime.value} ${detailModal.processingTime.unit}` : undefined} />
                                        <FieldRow label="Shipping Charges" value={detailModal.shippingCharges === 0 ? "Free" : detailModal.shippingCharges} type={detailModal.shippingCharges === 0 ? "text" : "price"} />
                                        <FieldRow label="COD Available" value={detailModal.isCodAvailable ?? detailModal.codAvailable} type="boolean" />
                                        <FieldRow label="International Shipping" value={detailModal.internationalShipping} type="boolean" />
                                    </div>

                                    {/* 11. Compliance & Legal */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">1️⃣1️⃣ Compliance & Legal</h4>
                                        <FieldRow label="FSSAI Number" value={detailModal.fssaiNumber} />
                                        <FieldRow label="Drug License" value={detailModal.drugLicenseNumber} />
                                        <FieldRow label="BIS Certification" value={detailModal.bisCertification} />
                                        <FieldRow label="Expiry Required" value={detailModal.expiryDateRequired} type="boolean" />
                                        <FieldRow label="Manufacturing Date" value={detailModal.manufacturingDate} type="date" />
                                        <FieldRow label="Expiry Date" value={detailModal.expiryDate} type="date" />
                                        <FieldRow label="Safety Disclaimer" value={detailModal.safetyDisclaimer} />
                                        <FieldRow label="Legal Disclaimer" value={detailModal.legalDisclaimer} />
                                    </div>

                                    {/* 12. SEO & Discoverability */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">1️⃣2️⃣ SEO & Discoverability</h4>
                                        <FieldRow label="SEO Title" value={detailModal.metaTitle} />
                                        <FieldRow label="SEO Description" value={detailModal.metaDescription} />
                                        <FieldRow label="SEO Keywords" value={detailModal.metaKeywords || detailModal.seoKeywords} type="array" />
                                        <FieldRow label="Search Keywords" value={detailModal.searchKeywords} />
                                        <FieldRow label="URL Slug" value={detailModal.urlSlug || detailModal.slug} />
                                    </div>

                                    {/* 13. Offers & Promotions */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">1️⃣3️⃣ Offers & Promotions</h4>
                                        <FieldRow label="Eligible for Offers" value={detailModal.eligibleForOffers} type="boolean" />
                                        <FieldRow label="Bank Offer Enabled" value={detailModal.bankOfferEnabled} type="boolean" />
                                        <FieldRow label="Flash Sale Eligible" value={detailModal.flashSaleEligible} type="boolean" />
                                        <FieldRow label="Deal of Day" value={detailModal.dealOfDayEligible} type="boolean" />
                                        <FieldRow label="Bulk Discount" value={detailModal.bulkDiscountEnabled} type="boolean" />
                                        <FieldRow label="Offers Count" value={detailModal.offers?.length || 0} />
                                        <FieldRow label="Last Chance Offers" value={detailModal.lastChanceOffers?.length || 0} />
                                    </div>

                                    {/* 14. B2B / Wholesale */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">1️⃣4️⃣ B2B / Wholesale</h4>
                                        <FieldRow label="Wholesale Price" value={detailModal.wholesalePrice} type="price" />
                                        <FieldRow label="Min Wholesale Qty" value={detailModal.minWholesaleQty} />
                                        <FieldRow label="Tiered Pricing" value={detailModal.tieredPricing} type="boolean" />
                                        <FieldRow label="Business Only" value={detailModal.businessOnlyVisibility} type="boolean" />
                                        <FieldRow label="GST Invoice Mandatory" value={detailModal.gstInvoiceMandatory} type="boolean" />
                                    </div>

                                    {/* 15. Quality & Moderation */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">1️⃣5️⃣ Quality & Moderation</h4>
                                        <FieldRow label="Quality Check Confirmed" value={detailModal.qualityCheckConfirmed} type="boolean" />
                                        <FieldRow label="Authenticity Confirmed" value={detailModal.authenticityConfirmed} type="boolean" />
                                        <FieldRow label="Brand Authorization" value={detailModal.brandAuthorizationConfirmed} type="boolean" />
                                    </div>

                                    {/* 16. Product Status */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">1️⃣6️⃣ Product Status</h4>
                                        <FieldRow label="Status" value={detailModal.status} />
                                        <FieldRow label="Publish Date" value={detailModal.publishDate} type="date" />
                                        <FieldRow label="Visibility" value={detailModal.visibility} />
                                        <FieldRow label="Created At" value={detailModal.createdAt} type="date" />
                                    </div>

                                    {/* 17. Trust Badges & Attributes */}
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <h4 className="font-bold text-sm text-primary-700 mb-2 border-b pb-1">1️⃣7️⃣ Trust Badges & Attributes</h4>
                                        <FieldRow label="Trust Badges" value={detailModal.trustBadges} type="array" />
                                        <FieldRow label="Attributes Count" value={detailModal.attributes?.length || 0} />
                                        <FieldRow label="Additional Fees" value={detailModal.fees?.length || 0} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t bg-gray-50">
                            <button onClick={() => setDetailModal(null)} className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg">Close</button>
                            <button onClick={() => setRejectModal({ product: detailModal })} className="flex items-center gap-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"><X className="h-4 w-4" /> Reject</button>
                            <button onClick={() => handleApprove(detailModal._id)} className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"><Check className="h-4 w-4" /> Approve</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center"><AlertCircle className="h-5 w-5 text-red-600" /></div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Reject Product</h3>
                                <p className="text-sm text-gray-500 truncate max-w-xs">{rejectModal.product.title}</p>
                            </div>
                        </div>
                        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-sm text-amber-800"><strong>Note:</strong> Reason will be shown to seller. They can fix issues and resubmit.</p>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rejection Reason *</label>
                            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="E.g., Images are low quality, Description is incomplete..." rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500" />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button onClick={() => { setRejectModal(null); setRejectReason(""); }} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                            <button onClick={handleReject} disabled={!rejectReason.trim()} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">Reject Product</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
