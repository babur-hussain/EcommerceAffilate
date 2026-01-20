'use client';

import { useState, useEffect } from 'react';

interface OrderDetailClientProps {
    initialOrder: any; // We can refine the type if needed, but 'any' allows flexibility for now matching the page usage
    apiBase: string;
    token: string;
}

export default function OrderDetailClient({ initialOrder, apiBase, token }: OrderDetailClientProps) {
    const [order, setOrder] = useState(initialOrder);

    useEffect(() => {
        // Don't poll if order is already completed
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
        }, 5000); // Poll every 5 seconds for snappier updates

        return () => clearInterval(intervalId);
    }, [order, apiBase, token]);

    const getStatusStyles = (status: string) => {
        const s = status?.toUpperCase() || '';
        switch (s) {
            case 'DELIVERED':
                return { bg: 'bg-green-100', text: 'text-green-700', label: 'Delivered' };
            case 'PROCESSING':
                return { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Processing' };
            case 'SHIPPED':
                return { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Shipped' };
            case 'CANCELLED':
                return { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancelled' };
            case 'CREATED':
                return { bg: 'bg-neutral-100', text: 'text-neutral-700', label: 'Ordered' };
            case 'CREATED':
                return { bg: 'bg-neutral-100', text: 'text-neutral-700', label: 'Ordered' };
            default:
                return { bg: 'bg-neutral-100', text: 'text-neutral-700', label: status || 'Ordered' };
        }
    };

    const { bg, text, label } = getStatusStyles(order.status);
    const isDelivered = order.status === 'DELIVERED';
    const isShipped = order.status === 'SHIPPED';
    const isProcessing = order.status === 'PROCESSING';
    const isCreated = order.status === 'CREATED';

    // Calculate progress width
    let progressWidth = '5%'; // Default for CREATED
    if (isDelivered) progressWidth = '100%';
    else if (isShipped) progressWidth = '75%';
    else if (isProcessing) progressWidth = '40%';

    // Helper to check if a step is active or completed
    const isStepActive = (step: string) => {
        const steps = ['CREATED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];
        const currentStepIndex = steps.indexOf(order.status) === -1 ? 0 : steps.indexOf(order.status);
        const targetStepIndex = steps.indexOf(step);
        return currentStepIndex >= targetStepIndex;
    };

    return (
        <>
            {/* Header Status Badge - Updates dynamically */}
            <div className={`absolute top-0 right-0 lg:static lg:ml-auto ${bg} ${text} px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border border-transparent self-start lg:self-end`}>
                {label}
            </div>

            {/* Tracking Status Section - Updates dynamically */}
            <div className="bg-white p-8 rounded-xl border border-[#e8f0f2] shadow-sm w-full mt-8">
                <div className="relative mb-4">
                    <div className="flex justify-between mb-2">
                        <span className="text-xs font-bold text-[#22a8c3]">Confirmed</span>
                        <span className={`text-xs font-bold ${isStepActive('PROCESSING') ? 'text-[#22a8c3]' : 'text-[#538893]'}`}>Preparing</span>
                        <span className={`text-xs font-bold ${isStepActive('SHIPPED') ? 'text-[#22a8c3]' : 'text-[#538893]'}`}>Shipped</span>
                        <span className={`text-xs font-bold ${isStepActive('DELIVERED') ? 'text-[#22a8c3]' : 'text-[#538893]'}`}>Delivered</span>
                    </div>
                    <div className="h-3 w-full bg-[#e8f0f2] rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#22a8c3] rounded-full relative transition-all duration-1000 ease-in-out"
                            style={{ width: progressWidth }}
                        >
                            <div className="absolute right-0 top-0 h-full w-2 bg-white/30 animate-pulse"></div>
                        </div>
                    </div>
                </div>
                <p className="text-sm text-[#538893] text-center">
                    {isDelivered
                        ? "Your package has been delivered."
                        : isShipped
                            ? "Your order is on the way."
                            : "We are preparing your order."}
                </p>
            </div>
        </>
    );
}
