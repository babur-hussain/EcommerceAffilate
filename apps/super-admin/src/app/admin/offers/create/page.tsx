"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Search,
    Loader2,
    Calendar,
    IndianRupee,
    ShoppingCart,
    Check
} from "lucide-react";
import Link from "next/link";

interface Product {
    _id: string;
    title: string;
    image: string;
    price: number;
    businessId: string;
}

export default function CreateOfferPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);

    // Step 1: Product Selection
    const [searchQuery, setSearchQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Step 2: Offer Details
    const [formData, setFormData] = useState({
        minSpendAmount: 599,
        dealPrice: 1,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        title: "Steal Deal - Pick any one!",
        businessId: "",
        order: 0
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length > 2) {
                searchProducts();
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    const searchProducts = async () => {
        try {
            setLoadingProducts(true);
            const response = await api.get(`/api/products?search=${searchQuery}&limit=10`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error searching products:", error);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedProduct) return;

        setSubmitting(true);
        try {
            await api.post("/api/offers", {
                productId: selectedProduct._id,
                ...formData
            });
            toast.success("Offer created successfully!");
            router.push("/admin/offers");
        } catch (error: any) {
            console.error("Error creating offer:", error);
            toast.error(error.response?.data?.error || "Failed to create offer");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/offers"
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ChevronLeft className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Steal Deal</h1>
                    <p className="text-sm text-gray-500">Configure a new exclusive product offer</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Step 1: Select Product */}
                <div className={`p-6 border-b border-gray-100 ${selectedProduct ? 'bg-gray-50' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold">1</span>
                            Select Product
                        </h2>
                        {selectedProduct && (
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                            >
                                Change
                            </button>
                        )}
                    </div>

                    {!selectedProduct ? (
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search products by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                />
                            </div>

                            {loadingProducts ? (
                                <div className="py-8 flex justify-center text-gray-500">
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                </div>
                            ) : searchQuery.length > 2 && products.length > 0 ? (
                                <div className="border border-gray-200 rounded-lg divide-y divide-gray-100 max-h-60 overflow-y-auto">
                                    {products.map(product => (
                                        <button
                                            key={product._id}
                                            onClick={() => {
                                                setSelectedProduct(product);
                                                setFormData(prev => ({ ...prev, businessId: product.businessId }));
                                            }}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <img
                                                src={product.image}
                                                alt={product.title}
                                                className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900 line-clamp-1">{product.title}</div>
                                                <div className="text-sm text-gray-500">₹{product.price}</div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            ) : searchQuery.length > 2 ? (
                                <div className="py-4 text-center text-gray-500 text-sm">
                                    No products found
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200">
                            <img
                                src={selectedProduct.image}
                                alt={selectedProduct.title}
                                className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                            />
                            <div>
                                <div className="font-semibold text-gray-900">{selectedProduct.title}</div>
                                <div className="text-sm text-gray-500">Original Price: ₹{selectedProduct.price}</div>
                            </div>
                            <div className="ml-auto">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                    <Check className="h-4 w-4" /> Selected
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Step 2: Configuration */}
                {selectedProduct && (
                    <div className="p-6 animate-in slide-in-from-top-4 duration-300">
                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-6">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-600 text-xs font-bold">2</span>
                            Offer Configuration
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Minimum Spend Amount (₹)
                                    </label>
                                    <div className="relative">
                                        <ShoppingCart className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.minSpendAmount}
                                            onChange={(e) => setFormData({ ...formData, minSpendAmount: Number(e.target.value) })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                        />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Customer must spend this amount at this seller.</p>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Seller ID (Business ID)
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.businessId}
                                        onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900 font-mono text-sm"
                                        placeholder="Override Seller ID"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Defaults to the product's seller. Change only if you want to assign this deal to a different seller account.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Deal Price (₹)
                                    </label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={formData.dealPrice}
                                            onChange={(e) => setFormData({ ...formData, dealPrice: Number(e.target.value) })}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-green-50 border-green-200 text-green-700 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Display Order
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.order}
                                        onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Higher numbers appear first (or sort by preference)
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Start Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        End Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-gray-900"
                                    placeholder="e.g. Steal Deal - Pick any one!"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-primary-500/30"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Creating Offer...
                                    </>
                                ) : (
                                    <>
                                        Create Steal Deal
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                )
                }
            </div >
        </div >
    );
}
