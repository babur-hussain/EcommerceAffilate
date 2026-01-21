'use client';

import { useState, useEffect } from 'react';

interface OrderDetailClientProps {
    initialOrder: any;
    apiBase: string;
    token: string;
}

export default function OrderDetailClient({ initialOrder, apiBase, token }: OrderDetailClientProps) {
    const [order, setOrder] = useState(initialOrder);

    useEffect(() => {
        if (!order || ['DELIVERED', 'CANCELLED', 'RETURNED', 'REFUNDED'].includes(order.status)) return;

        const intervalId = setInterval(async () => {
            try {
                const res = await fetch(`${apiBase}/orders/${order._id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: 'no-store',
                });
                if (res.ok) {
                    const updatedOrder = await res.json();
                    if (updatedOrder.status !== order.status) {
                        setOrder((prev: any) => ({ ...prev, status: updatedOrder.status }));
                    }
                }
            } catch (error) {
                console.error("Failed to poll order update:", error);
            }
        }, 5000);

        return () => clearInterval(intervalId);
    }, [order, apiBase, token]);

    const getStatusInfo = (status: string) => {
        const s = status?.toUpperCase() || '';
        switch (s) {
            case 'DELIVERED': return { color: 'text-green-600', bg: 'bg-green-600', label: 'Delivered', icon: 'check_circle' };
            case 'PROCESSING': return { color: 'text-amber-600', bg: 'bg-amber-600', label: 'Processing', icon: 'inventory_2' };
            case 'SHIPPED': return { color: 'text-blue-600', bg: 'bg-blue-600', label: 'Shipped', icon: 'local_shipping' };
            case 'CANCELLED': return { color: 'text-red-500', bg: 'bg-red-500', label: 'Cancelled', icon: 'cancel' };
            case 'CREATED': return { color: 'text-neutral-600', bg: 'bg-neutral-600', label: 'Ordered', icon: 'shopping_bag' };
            case 'RETURNED': return { color: 'text-purple-600', bg: 'bg-purple-600', label: 'Returned', icon: 'assignment_return' };
            default: return { color: 'text-neutral-600', bg: 'bg-neutral-600', label: status, icon: 'info' };
        }
    };

    const currentStatus = getStatusInfo(order.status);

    // Stepper Logic
    const steps = [
        { key: 'CREATED', label: 'Order Placed', icon: 'shopping_cart' },
        { key: 'PROCESSING', label: 'Processing', icon: 'inventory' },
        { key: 'SHIPPED', label: 'On the Way', icon: 'local_shipping' },
        { key: 'DELIVERED', label: 'Delivered', icon: 'home_pin' }
    ];

    const currentStepIndex = steps.findIndex(s => s.key === order.status) === -1
        ? (order.status === 'CREATED' ? 0 : 0) // Default to 0 if unknown, handle specific cases like RETURNED specially if needed
        : steps.findIndex(s => s.key === order.status);

    // Calculate progress percentage for the bar background
    const progressPercent = Math.min(100, Math.max(0, (currentStepIndex / (steps.length - 1)) * 100));

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden mb-8">
            <div className="p-6 md:p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h2 className="text-2xl font-black text-[#141e1e]">Order Status</h2>
                        <p className="text-[#538893] text-sm font-medium mt-1">Expected Arrival: <span className="text-[#141e1e] font-bold">{order.deliveryEstimate || 'Calculating...'}</span></p>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${currentStatus.bg} bg-opacity-10 ${currentStatus.color}`}>
                        <span className="material-symbols-outlined text-lg">{currentStatus.icon}</span>
                        {currentStatus.label}
                    </div>
                </div>

                {/* Tracking Stepper */}
                <div className="relative px-4">
                    {/* Progress Bar Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-neutral-100 -translate-y-1/2 z-0 rounded-full"></div>

                    {/* Active Progress Bar */}
                    <div
                        className="absolute top-1/2 left-0 h-1 bg-[#22a8c3] -translate-y-1/2 z-0 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    ></div>

                    {/* Steps */}
                    <div className="relative z-10 flex justify-between w-full">
                        {steps.map((step, index) => {
                            const isActive = index <= currentStepIndex;
                            const isCurrent = index === currentStepIndex;

                            return (
                                <div key={step.key} className="flex flex-col items-center gap-3 group cursor-default">
                                    <div
                                        className={`
                                            w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300
                                            ${isActive
                                                ? 'bg-[#22a8c3] border-white shadow-[0_0_0_2px_#22a8c3] text-white'
                                                : 'bg-white border-neutral-200 text-neutral-300'}
                                            ${isCurrent ? 'scale-110 shadow-[0_0_0_4px_rgba(34,168,195,0.2)]' : ''}
                                        `}
                                    >
                                        <span className="material-symbols-outlined text-sm md:text-xl">
                                            {isActive ? 'check' : step.icon}
                                        </span>
                                    </div>
                                    <p className={`text-xs md:text-sm font-bold text-center ${isActive ? 'text-[#141e1e]' : 'text-neutral-400 opacity-60'}`}>
                                        {step.label}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Notification/Message Area */}
            <div className="bg-[#f8fbfb] px-6 py-4 border-t border-neutral-100 flex items-start gap-3">
                <span className="material-symbols-outlined text-[#22a8c3] mt-0.5">info</span>
                <p className="text-sm text-[#538893] leading-relaxed">
                    {order.status === 'DELIVERED'
                        ? "Your package has been successfully delivered. We hope you enjoy your purchase!"
                        : "We'll send you an email update when your order status changes."}
                </p>
            </div>
        </div>
    );
}
