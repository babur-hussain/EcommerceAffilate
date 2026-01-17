"use client";

import React, { useState, useEffect } from "react";
import api from "@/lib/api";
import { toast } from "react-hot-toast";
import {
    Plus,
    Loader2,
    Calendar,
    Tag,
    Trash2,
    Pencil
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Offer {
    _id: string;
    title: string;
    type: string;
    productId: {
        _id: string;
        title: string;
        price: number;
        image: string;
    };
    businessId: {
        _id: string;
        businessIdentity: {
            tradeName: string;
        };
    };
    minSpendAmount: number;
    dealPrice: number;
    isActive: boolean;
    startDate: string;
    endDate: string;
    order: number;
}

export default function OffersPage() {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchOffers();
    }, [page]);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/offers?page=${page}&limit=20`);
            setOffers(response.data.data);
            setTotalPages(response.data.pagination.pages);
        } catch (error) {
            console.error("Error fetching offers:", error);
            toast.error("Failed to load offers");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this offer?")) return;
        // Logic to delete offer would go here (need endpoint)
        // For now just show toast as I didn't add DELETE endpoint in plan/implementation yet
        toast.error("Delete functionality not implemented yet");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Steal Deals</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage exclusive product offers
                    </p>
                </div>
                <Link
                    href="/admin/offers/create"
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Create Offer
                </Link>
            </div>

            {/* Offers Table */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Offer</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Product</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Seller</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Condition</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Duration</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Order</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Status</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center">
                                        <div className="flex justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
                                        </div>
                                    </td>
                                </tr>
                            ) : offers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        No active steal deals found
                                    </td>
                                </tr>
                            ) : (
                                offers.map((offer) => (
                                    <tr key={offer._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {offer.title}
                                            <div className="text-xs text-green-600 font-bold mt-1">
                                                Deal Price: ₹{offer.dealPrice}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={offer.productId?.image}
                                                    alt={offer.productId?.title}
                                                    className="w-10 h-10 rounded-md object-cover bg-gray-100"
                                                />
                                                <div className="max-w-[150px] truncate" title={offer.productId?.title}>
                                                    {offer.productId?.title}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {offer.businessId?.businessIdentity?.tradeName}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-600">
                                                <Tag className="h-3 w-3" />
                                                Min Spend: ₹{offer.minSpendAmount}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col text-xs text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    Start: {new Date(offer.startDate).toLocaleDateString()}
                                                </span>
                                                <span className="flex items-center gap-1 mt-0.5">
                                                    End: {new Date(offer.endDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-700">
                                            {offer.order || 0}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${offer.isActive
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {offer.isActive ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/offers/${offer._id}`}
                                                    className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit Offer"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(offer._id)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Offer"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
