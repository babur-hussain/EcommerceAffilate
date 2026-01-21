import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import OrderDetailClient from '@/components/order/OrderDetailClient';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

interface OrderItem {
    _id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
    items: Array<{
        productId: {
            _id: string;
            title: string;
            images: string[];
            price: number;
        };
        quantity: number;
        price: number;
    }>;
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    paymentMethod: string;
    deliveryEstimate?: string;
    subtotal: number;
    tax: number;
    shippingCost: number;
}

async function getOrder(id: string): Promise<OrderItem | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || '';
    const url = `${API_BASE}/orders/${id}`;

    console.log(`[OrderDetails] Fetching order: ${url}`);
    console.log(`[OrderDetails] Token present: ${!!token}, Token length: ${token.length}`);

    try {
        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        console.log(`[OrderDetails] Response status: ${res.status}`);

        if (!res.ok) {
            const text = await res.text();
            console.log(`[OrderDetails] Error body: ${text}`);
            return null;
        }
        return res.json();
    } catch (error) {
        console.error(`[OrderDetails] Fetch error:`, error);
        return null;
    }
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function OrderDetailsPage(props: PageProps) {
    const params = await props.params;
    const order = await getOrder(params.id);

    if (!order) {
        notFound();
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || '';

    return (
        <div className="min-h-screen bg-[#f6f8f8] text-[#0f181a] font-['Manrope'] pb-20">
            {/* Header / Breadcrumb */}
            <div className="bg-white border-b border-neutral-100 sticky top-0 z-30">
                <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center gap-4">
                    <Link href="/account/orders" className="p-2 rounded-lg hover:bg-neutral-50 text-neutral-500 hover:text-[#2c7b7d] transition-colors">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-[#141e1e]">Order #{order._id.slice(-8).toUpperCase()}</h1>
                        <p className="text-xs text-neutral-500 font-medium">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>
            </div>

            <main className="max-w-[1440px] mx-auto p-6 md:p-10 space-y-8">

                {/* 1. Order Status Tracker */}
                <OrderDetailClient initialOrder={order} apiBase={API_BASE} token={token} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Items */}
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
                            <div className="px-8 py-6 border-b border-neutral-100 bg-neutral-50/50 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-[#141e1e]">Items ({order.items.length})</h2>
                                {order.status === 'DELIVERED' && (
                                    <Link
                                        href={`/account/orders/${order._id}/return`}
                                        className="text-sm font-bold text-[#22a8c3] hover:text-[#1b8fa6] flex items-center gap-1 transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-lg">assignment_return</span>
                                        Return Items
                                    </Link>
                                )}
                            </div>
                            <div className="divide-y divide-neutral-100">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="p-6 hover:bg-[#f8fbfb] transition-colors group">
                                        <div className="flex gap-6">
                                            {/* Product Image */}
                                            <div className="size-24 md:size-32 bg-white rounded-xl border border-neutral-100 p-2 flex items-center justify-center shrink-0 overflow-hidden relative shadow-sm">
                                                {item.productId?.images && item.productId.images.length > 0 ? (
                                                    <img src={item.productId.images[0]} alt={item.productId.title} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-4xl text-neutral-200">image_not_supported</span>
                                                )}
                                            </div>

                                            {/* Details */}
                                            <div className="flex-1 flex flex-col justify-between py-1">
                                                <div>
                                                    {item.productId ? (
                                                        <Link href={`/product/${item.productId._id}`}>
                                                            <h3 className="font-bold text-[#141e1e] text-lg leading-tight mb-2 hover:text-[#22a8c3] transition-colors line-clamp-2">
                                                                {item.productId.title}
                                                            </h3>
                                                        </Link>
                                                    ) : (
                                                        <span className="font-bold text-gray-400">Product Unavailable</span>
                                                    )}
                                                    <div className="flex items-center gap-4 text-sm text-[#538893]">
                                                        <span className="bg-neutral-100 px-2 py-1 rounded text-xs font-bold text-neutral-600">Qty: {item.quantity}</span>
                                                        {/* Optional attributes could go here */}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-end mt-4">
                                                    <div>
                                                        <p className="text-xl font-bold text-[#141e1e]">₹{item.price.toFixed(2)}</p>
                                                    </div>

                                                    {/* Review Button Placeholder */}
                                                    {order.status === 'DELIVERED' && item.productId && (
                                                        <Link
                                                            href={`/product/${item.productId._id}#reviews`}
                                                            className="text-xs font-bold text-[#22a8c3] border border-[#22a8c3] px-3 py-1.5 rounded-lg hover:bg-[#22a8c3] hover:text-white transition-all"
                                                        >
                                                            Write Review
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Details & Summary */}
                    <div className="space-y-8">

                        {/* Delivery Address */}
                        <section className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                    <span className="material-symbols-outlined">location_on</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#141e1e]">Delivery Address</h3>
                            </div>
                            <address className="not-italic text-[#538893] leading-relaxed pl-[52px]">
                                {order.shippingAddress ? (
                                    <>
                                        <p className="font-bold text-[#141e1e] mb-1">Shipping Details</p>
                                        <p>{order.shippingAddress.street}</p>
                                        <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                        <p>{order.shippingAddress.country}</p>
                                        <p className="mt-2 text-sm">Create at: {order.shippingAddress.zip}</p>
                                    </>
                                ) : (
                                    <p className="italic text-neutral-400">No address provided</p>
                                )}
                            </address>
                        </section>

                        {/* Order Summary */}
                        <section className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="size-10 rounded-full bg-[#22a8c3]/10 flex items-center justify-center text-[#22a8c3]">
                                    <span className="material-symbols-outlined">receipt_long</span>
                                </div>
                                <h3 className="text-lg font-bold text-[#141e1e]">Order Summary</h3>
                            </div>

                            <div className="space-y-4 pl-[52px]">
                                <div className="flex justify-between text-[#538893]">
                                    <span>Subtotal</span>
                                    <span className="font-medium">₹{order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[#538893]">
                                    <span>Shipping</span>
                                    <span className="font-medium text-green-600">{order.shippingCost ? `₹${order.shippingCost}` : 'Free'}</span>
                                </div>
                                <div className="flex justify-between text-[#538893]">
                                    <span>Tax</span>
                                    <span className="font-medium">₹{order.tax ? order.tax.toFixed(2) : '0.00'}</span>
                                </div>
                                <div className="my-4 border-t border-neutral-100"></div>
                                <div className="flex justify-between items-baseline">
                                    <span className="font-bold text-lg text-[#141e1e]">Total Amount</span>
                                    <span className="font-black text-2xl text-[#22a8c3]">₹{order.totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="text-xs text-neutral-400 text-right mt-1">
                                    Paid via {order.paymentMethod || 'Online'}
                                </div>
                            </div>
                        </section>

                        {/* Help Box */}
                        <div className="bg-[#141e1e] rounded-2xl p-6 text-white relative overflow-hidden">
                            <div className="relative z-10">
                                <h4 className="font-bold mb-2">Need help with this order?</h4>
                                <p className="text-white/60 text-sm mb-4">Issues with delivery or items? Our support team is here.</p>
                                <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-lg font-bold text-sm transition-colors border border-white/20">
                                    Contact Support
                                </button>
                            </div>
                            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-8xl text-white/5 rotate-12">support_agent</span>
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
