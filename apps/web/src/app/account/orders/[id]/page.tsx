import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

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
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    try {
        const res = await fetch(`${API_BASE}/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

function getStatusStyles(status: string) {
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
        default:
            return { bg: 'bg-neutral-100', text: 'text-neutral-700', label: status || 'Unknown' };
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

    const { bg, text, label } = getStatusStyles(order.status);
    const isDelivered = order.status === 'DELIVERED';
    const isShipped = order.status === 'SHIPPED';
    const progressWidth = isDelivered ? '100%' : isShipped ? '75%' : '25%';

    return (
        <div className="min-h-screen bg-[#f6f8f8] text-[#0f181a] font-sans pb-20">
            <main className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 p-6 lg:p-10">

                {/* Sidebar Navigation (Consistent with Orders Page) */}
                <aside className="w-full lg:w-72 flex flex-col gap-8 shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e8f0f2]">
                        <Link href="/account/orders" className="flex items-center gap-2 text-[#538893] hover:text-[#22a8c3] mb-6 font-medium text-sm transition-colors">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Orders
                        </Link>
                        <div className="flex items-center gap-4 mb-8">
                            <div
                                className="size-12 rounded-full bg-cover bg-center border border-neutral-200"
                                style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=User&background=random')" }}
                            ></div>
                            <div>
                                <h3 className="font-bold text-lg text-neutral-900">My Account</h3>
                                <p className="text-xs text-[#22a8c3] font-bold uppercase tracking-wider">Member</p>
                            </div>
                        </div>
                        <nav className="flex flex-col gap-1">
                            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#22a8c3] text-white font-medium transition-all shadow-md shadow-[#22a8c3]/20">
                                <span className="material-symbols-outlined filled">package_2</span>
                                <span>Orders</span>
                            </Link>
                            <Link href="/account/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                                <span className="material-symbols-outlined">person</span>
                                <span>Profile</span>
                            </Link>
                            <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                                <span className="material-symbols-outlined">location_on</span>
                                <span>Addresses</span>
                            </Link>
                            <Link href="/account/payments" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                                <span className="material-symbols-outlined">credit_card</span>
                                <span>Payments</span>
                            </Link>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <section className="flex-1 flex flex-col gap-8 min-w-0">
                    {/* Header */}
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap justify-between items-end gap-4">
                            <div>
                                <h1 className="text-3xl font-black tracking-tight text-[#0f181a]">Order Details</h1>
                                <p className="text-[#538893] mt-1">Order #{order._id.toUpperCase()} • Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className={`${bg} ${text} px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide border border-transparent`}>
                                {label}
                            </div>
                        </div>
                    </div>

                    {/* Tracking Status */}
                    <div className="bg-white p-8 rounded-xl border border-[#e8f0f2] shadow-sm">
                        <div className="relative mb-4">
                            <div className="flex justify-between mb-2">
                                <span className="text-xs font-bold text-[#22a8c3]">Confirmed</span>
                                <span className={`text-xs font-bold ${order.status !== 'PROCESSING' ? 'text-[#22a8c3]' : 'text-[#538893]'}`}>Preparing</span>
                                <span className={`text-xs font-bold ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'text-[#22a8c3]' : 'text-[#538893]'}`}>Shipped</span>
                                <span className={`text-xs font-bold ${order.status === 'DELIVERED' ? 'text-[#22a8c3]' : 'text-[#538893]'}`}>Delivered</span>
                            </div>
                            <div className="h-3 w-full bg-[#e8f0f2] rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-[#22a8c3] rounded-full relative transition-all duration-1000"
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

                    {/* Order Items & Summary Grid */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* Items List */}
                        <div className="xl:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-xl border border-[#e8f0f2] shadow-sm">
                                <h3 className="text-lg font-bold mb-6 text-neutral-900 border-b border-[#e8f0f2] pb-4">Items in Order</h3>
                                <div className="space-y-6">
                                    {order.items.map((item, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="size-20 bg-[#f8fbfb] rounded-lg p-2 flex items-center justify-center border border-[#e8f0f2] shrink-0 overflow-hidden relative">
                                                {item.productId?.images && item.productId.images.length > 0 ? (
                                                    <img src={item.productId.images[0]} alt={item.productId.title} className="w-full h-full object-contain mix-blend-multiply" />
                                                ) : (
                                                    <span className="material-symbols-outlined text-3xl text-neutral-300">shopping_bag</span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                {item.productId ? (
                                                    <Link href={`/product/${item.productId._id}`} className="font-bold text-[#0f181a] hover:text-[#22a8c3] line-clamp-2">
                                                        {item.productId.title}
                                                    </Link>
                                                ) : (
                                                    <span className="font-bold text-gray-400">Product Unavailable</span>
                                                )}
                                                <p className="text-sm text-[#538893] mt-1">Qty: {item.quantity}</p>
                                                <p className="font-bold text-[#0f181a] mt-2">₹{item.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Address & Summary */}
                        <div className="space-y-6">
                            {/* Shipping Address */}
                            <div className="bg-white p-6 rounded-xl border border-[#e8f0f2] shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-neutral-900">Delivery Address</h3>
                                <address className="not-italic text-sm text-[#538893] leading-relaxed">
                                    <p className="font-bold text-[#0f181a] mb-1">Shipping Details</p>
                                    {order.shippingAddress ? (
                                        <>
                                            <p>{order.shippingAddress.street}</p>
                                            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}</p>
                                            <p>{order.shippingAddress.country}</p>
                                        </>
                                    ) : (
                                        <p>No shipping address provided.</p>
                                    )}
                                </address>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white p-6 rounded-xl border border-[#e8f0f2] shadow-sm">
                                <h3 className="text-lg font-bold mb-4 text-neutral-900">Order Summary</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-[#538893]">
                                        <span>Subtotal</span>
                                        <span>₹{order.items.reduce((acc, i) => acc + (i.price * i.quantity), 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-[#538893]">
                                        <span>Shipping</span>
                                        <span>{order.shippingCost ? `₹${order.shippingCost}` : 'Free'}</span>
                                    </div>
                                    <div className="flex justify-between text-[#538893]">
                                        <span>Tax</span>
                                        <span>{order.tax ? `₹${order.tax}` : '₹0.00'}</span>
                                    </div>
                                    <div className="border-t border-[#e8f0f2] pt-3 flex justify-between font-bold text-lg text-[#0f181a]">
                                        <span>Total</span>
                                        <span className="text-[#22a8c3]">₹{order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
