'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
    _id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: any[];
}

interface ActiveOrderTrackerProps {
    initialOrder: OrderItem | null;
    apiBase: string; // Pass env var from server
    token: string;
}

export default function ActiveOrderTracker({ initialOrder, apiBase, token }: ActiveOrderTrackerProps) {
    const [activeOrder, setActiveOrder] = useState<OrderItem | null>(initialOrder);
    const [loading, setLoading] = useState(false);

    // Poll for updates every 10 seconds if there is an active order
    useEffect(() => {
        if (!activeOrder || ['DELIVERED', 'CANCELLED'].includes(activeOrder.status)) return;

        const fetchOrder = async () => {
            try {
                const res = await fetch(`${apiBase}/orders/${initialOrder!._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (res.ok) {
                    const updatedOrder = await res.json();
                    // Only update if status changed to avoid unnecessary re-renders/flickers
                    setActiveOrder(prev => (prev?.status !== updatedOrder.status ? updatedOrder : prev));
                }
            } catch (err) {
                console.error("Failed to poll order status", err);
            }
        };

        const intervalId = setInterval(fetchOrder, 10000); // 10 seconds
        return () => clearInterval(intervalId);
    }, [activeOrder, apiBase, initialOrder, token]);

    if (!activeOrder) {
        return (
            <div className="bg-white rounded-xl border border-[#e8f0f2] p-12 text-center shadow-sm">
                <div className="inline-flex items-center justify-center size-20 rounded-full bg-neutral-50 mb-6">
                    <span className="material-symbols-outlined text-4xl text-neutral-300">shopping_bag</span>
                </div>
                <h3 className="text-lg font-bold mb-2 text-neutral-900">No active orders</h3>
                <p className="text-neutral-500 mb-8 max-w-sm mx-auto">You don't have any ongoing orders at the moment.</p>
                <Link href="/" className="inline-flex items-center justify-center h-12 px-8 bg-[#22a8c3] text-white font-bold rounded-xl shadow-lg shadow-[#22a8c3]/20 hover:bg-[#1b8fa6] transition-all">
                    Start Cloud Shopping
                </Link>
            </div>
        );
    }

    const getStatusStyles = (status: string) => {
        const s = status.toUpperCase();
        switch (s) {
            case 'DELIVERED': return { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' };
            case 'PROCESSING': return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Processing' };
            case 'SHIPPED': return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Shipped' };
            case 'CANCELLED': return { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' };
            default: return { bg: 'bg-neutral-100', text: 'text-neutral-700', label: status };
        }
    };

    const statusStyles = getStatusStyles(activeOrder.status);
    const isDelivered = activeOrder.status === 'DELIVERED';
    const isShipped = activeOrder.status === 'SHIPPED';
    const percentage = isDelivered ? '100%' : isShipped ? '75%' : '25%';

    return (
        <div className="bg-white rounded-xl shadow-lg border border-[#e8f0f2] overflow-hidden transition-all duration-500">
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                <div className="flex-1 space-y-8">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="relative flex h-2 w-2">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isDelivered ? 'bg-green-400' : 'bg-[#22a8c3]'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2 w-2 ${isDelivered ? 'bg-green-500' : 'bg-[#22a8c3]'}`}></span>
                                </span>
                                <p className="text-xs font-bold text-[#22a8c3] uppercase tracking-widest">Live Status</p>
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-900">{isDelivered ? 'Arrived safely' : 'Arriving soon'}</h2>
                            <p className="text-[#538893] text-sm">Order #{activeOrder._id.slice(-6).toUpperCase()} • {activeOrder.items?.length || 0} items</p>
                        </div>
                        <div className={`${statusStyles.bg} ${statusStyles.text} px-3 py-1 rounded-full text-xs font-bold`}>
                            {statusStyles.label}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                        <div className="flex justify-between mb-2">
                            <span className="text-xs font-bold text-[#22a8c3]">Confirmed</span>
                            <span className={`text-xs font-bold ${activeOrder.status !== 'PROCESSING' ? 'text-[#22a8c3]' : 'text-[#538893]'}`}>Preparing</span>
                            <span className={`text-xs font-bold ${['SHIPPED', 'DELIVERED'].includes(activeOrder.status) ? 'text-[#22a8c3]' : 'text-[#538893]'}`}>Shipped</span>
                            <span className={`text-xs font-bold ${activeOrder.status === 'DELIVERED' ? 'text-[#22a8c3]' : 'text-[#538893]'}`}>Delivered</span>
                        </div>
                        <div className="h-2 w-full bg-[#e8f0f2] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#22a8c3] rounded-full relative transition-all duration-1000 ease-in-out"
                                style={{ width: percentage }}
                            >
                                <div className="absolute right-0 top-0 h-full w-2 bg-white/30 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-6">
                            <div className="flex items-center gap-3">
                                <div className="size-10 rounded-full bg-neutral-100 flex items-center justify-center text-xl border border-neutral-200">
                                    🚚
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-neutral-900">Delivery Partner</p>
                                    <p className="text-[10px] text-[#538893]">Assigned automatically</p>
                                </div>
                            </div>
                            <Link href={`/account/orders/${activeOrder._id}`} className="flex items-center gap-2 bg-[#22a8c3] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md shadow-[#22a8c3]/20 hover:scale-[1.02] transition-transform">
                                <span className="material-symbols-outlined text-sm">visibility</span>
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Mini Map Placeholder */}
                <div className="w-full md:w-80 h-48 md:h-auto rounded-xl relative overflow-hidden border border-[#e8f0f2] bg-[#f8fbfb] flex items-center justify-center group">
                    <span className="material-symbols-outlined text-4xl text-[#22a8c3]/20 group-hover:scale-110 transition-transform duration-300">map</span>
                    {/* Map Background Pattern */}
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#22a8c3 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="bg-[#22a8c3] text-white p-2 rounded-full shadow-lg relative z-10 border-2 border-white ring-4 ring-[#22a8c3]/10">
                            <span className="material-symbols-outlined text-xl">local_shipping</span>
                        </div>
                        <div className="w-4 h-4 bg-[#22a8c3]/40 rounded-full blur-sm -mt-2 animate-ping"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}
