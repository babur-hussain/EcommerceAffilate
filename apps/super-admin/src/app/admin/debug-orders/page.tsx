"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { AlertCircle, RefreshCw, Search } from "lucide-react";

interface DebugOrder {
    _id: string;
    userId: string;
    items: {
        productId: {
            _id: string;
            title: string;
            businessId: string;
        } | null;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: string;
    paymentStatus: string;
    paymentProvider: string;
    createdAt: string;
    businessId?: string; // Some orders might not have this directly on root depending on version
}

export default function DebugOrdersPage() {
    const [orders, setOrders] = useState<DebugOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchDebugOrders = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/super-admin/debug/orders");
            setOrders(res.data);
        } catch (error) {
            console.error("Failed to fetch debug orders:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDebugOrders();
    }, []);

    const filteredOrders = orders.filter(
        (order) =>
            order._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.userId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Debug Orders (Raw Data)
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Inspect raw order data to identify missing orders.
                    </p>
                </div>
                <button
                    onClick={fetchDebugOrders}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-200">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Order ID or User ID..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 text-amber-800 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                    <p className="font-semibold">Why orders might be missing from Seller Dashboard:</p>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                        <li>Payment Status is not <code>PAID</code> or <code>SUCCESS</code> (except for COD).</li>
                        <li>Product is not linked to the correct Business ID.</li>
                        <li>Order does not contain any products for the logged-in business.</li>
                    </ul>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 uppercase font-medium">
                            <tr>
                                <th className="px-4 py-3">Order ID</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Payment</th>
                                <th className="px-4 py-3">Products (Business ID)</th>
                                <th className="px-4 py-3">Created At</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">
                                            {order._id}
                                            <div className="text-xs text-gray-500 mt-1">
                                                User: {order.userId}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                    order.status
                                                )}`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="font-medium">
                                                {order.paymentStatus || "PENDING"}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {order.paymentProvider}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="space-y-1">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="text-xs border-b border-gray-100 pb-1 last:border-0">
                                                        <span className="font-medium block truncate max-w-[200px]" title={item.productId?.title}>
                                                            {item.productId?.title || "Unknown Product"}
                                                        </span>
                                                        <span className="text-gray-500">
                                                            Biz: {item.productId?.businessId || "N/A"}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                                            {formatDate(order.createdAt)}
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
