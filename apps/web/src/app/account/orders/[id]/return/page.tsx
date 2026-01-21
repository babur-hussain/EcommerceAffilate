import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import RequestReturnForm from '@/components/order/RequestReturnForm';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

// Reusing interfaces matching the form component
interface OrderItem {
    _id: string; // Order item subdocument ID? or just used for key
    productId: {
        _id: string;
        title: string;
        images: string[];
        price: number;
    };
    quantity: number;
    price: number;
}

interface Order {
    _id: string;
    items: OrderItem[];
    createdAt: string;
    status: string;
}

async function getOrder(id: string): Promise<Order | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || '';

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

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ReturnRequestPage(props: PageProps) {
    const params = await props.params;
    const order = await getOrder(params.id);

    if (!order) {
        notFound();
    }

    if (order.status !== 'DELIVERED') {
        return (
            <div className="min-h-screen bg-[#f6f8f8] flex items-center justify-center p-6">
                <div className="bg-white p-8 rounded-xl border border-neutral-100 shadow-sm text-center max-w-md">
                    <div className="size-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-3xl">info</span>
                    </div>
                    <h1 className="text-xl font-bold text-[#141e1e] mb-2">Return Unavailable</h1>
                    <p className="text-neutral-500 mb-6">Returns are only available for delivered orders.</p>
                    <Link href="/account/orders" className="block w-full py-3 bg-[#2c7b7d] text-white font-bold rounded-lg hover:bg-[#25696a]">
                        Back to Orders
                    </Link>
                </div>
            </div>
        );
    }

    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || '';

    return (
        <div className="min-h-screen bg-[#f6f8f8] text-[#0f181a] font-sans pb-20">
            <main className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 p-6 lg:p-10">

                {/* Sidebar Navigation (Consistent with specific order page) */}
                <aside className="w-full lg:w-72 flex flex-col gap-8 shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e8f0f2]">
                        <Link href={`/account/orders/${order._id}`} className="flex items-center gap-2 text-[#538893] hover:text-[#22a8c3] mb-6 font-medium text-sm transition-colors">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Order Details
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
                            <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                                <span className="material-symbols-outlined">package_2</span>
                                <span>Orders</span>
                            </Link>
                            <Link href="/account/returns" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                                <span className="material-symbols-outlined">assignment_return</span>
                                <span>My Returns</span>
                            </Link>
                            <Link href="/account/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                                <span className="material-symbols-outlined">person</span>
                                <span>Profile</span>
                            </Link>
                            <Link href="/account/addresses" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                                <span className="material-symbols-outlined">location_on</span>
                                <span>Addresses</span>
                            </Link>
                        </nav>
                    </div>
                </aside>

                {/* Main Content */}
                <section className="flex-1 flex flex-col gap-8 min-w-0">
                    <div className="flex flex-col gap-2">
                        <nav className="flex items-center gap-2 text-xs font-medium text-[#538893]">
                            <Link href="/" className="hover:text-[#22a8c3]">Home</Link>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <Link href="/account/orders" className="hover:text-[#22a8c3]">Orders</Link>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <span className="text-[#0f181a]">Request Return</span>
                        </nav>
                        <div className="flex flex-wrap justify-between items-end gap-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-[#0f181a]">Request Return</h1>
                                <p className="text-[#538893] mt-1">Select items and reason for your return</p>
                            </div>
                        </div>
                    </div>

                    <RequestReturnForm
                        order={order}
                        apiBase={API_BASE}
                        token={token}
                    />
                </section>
            </main>
        </div>
    );
}
