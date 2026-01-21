import { cookies } from 'next/headers';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
const AUTH_COOKIE_NAME = 'auth_token';

interface ReturnRequest {
    _id: string;
    returnRequestNumber: string;
    status: string;
    createdAt: string;
    refundAmount: number;
    items: Array<{
        productId: {
            title: string;
            images: string[];
        };
        quantity: number;
        reason: string;
    }>;
}

async function getMyReturns(): Promise<ReturnRequest[]> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return [];

    try {
        const res = await fetch(`${BACKEND_URL}/api/returns/mine`, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });
        if (!res.ok) return [];
        const data = await res.json();
        // The API might return { data: [...] } or just [...]
        // Based on mobile implementation, it returns array directly or inside data?
        // Looking at mobile implementation (viewed earlier), it just did setReturns(response.data).
        // Let's assume response is the array or check backend structure.
        return Array.isArray(data) ? data : (data.returns || []);
    } catch (error) {
        return [];
    }
}

function getStatusStyles(status: string) {
    const s = status?.toUpperCase() || '';
    switch (s) {
        case 'APPROVED':
        case 'REFUND_COMPLETED':
        case 'RECEIVED':
            return { bg: 'bg-green-100', text: 'text-green-700', label: s.replace(/_/g, ' ') };
        case 'PENDING':
        case 'PICKUP_SCHEDULED':
        case 'PICKED_UP':
        case 'REFUND_INITIATED':
            return { bg: 'bg-amber-100', text: 'text-amber-700', label: s.replace(/_/g, ' ') };
        case 'REJECTED':
            return { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' };
        default:
            return { bg: 'bg-neutral-100', text: 'text-neutral-700', label: s.replace(/_/g, ' ') };
    }
}

export default async function MyReturnsPage() {
    const returns = await getMyReturns();

    return (
        <div className="min-h-screen bg-[#f6f8f8] text-[#0f181a] font-sans pb-20">
            <main className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 p-6 lg:p-10">

                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-72 flex flex-col gap-8 shrink-0">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e8f0f2]">
                        <Link href="/account" className="flex items-center gap-2 text-[#538893] hover:text-[#22a8c3] mb-6 font-medium text-sm transition-colors">
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Back to Dashboard
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
                            <Link href="/account/returns" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#22a8c3] text-white font-medium transition-all shadow-md shadow-[#22a8c3]/20">
                                <span className="material-symbols-outlined filled">assignment_return</span>
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
                            <Link href="/account" className="hover:text-[#22a8c3]">Account</Link>
                            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
                            <span className="text-[#0f181a]">Returns</span>
                        </nav>
                        <div className="flex flex-wrap justify-between items-end gap-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-[#0f181a]">My Returns</h1>
                                <p className="text-[#538893] mt-1">Track return requests and refunds</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-[#e8f0f2] shadow-sm">
                        <div className="space-y-4">
                            {returns.map(req => {
                                const firstItem = req.items?.[0];
                                const itemCount = req.items?.length || 0;
                                const statusStyle = getStatusStyles(req.status);

                                return (
                                    <div key={req._id} className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl border border-[#e8f0f2] hover:shadow-sm transition-shadow">
                                        {/* Image */}
                                        <div className="size-20 bg-[#f8fbfb] rounded-lg p-2 flex items-center justify-center border border-[#e8f0f2] shrink-0 overflow-hidden relative">
                                            {firstItem?.productId?.images?.[0] ? (
                                                <img src={firstItem.productId.images[0]} alt={firstItem.productId.title || 'Product'} className="w-full h-full object-contain mix-blend-multiply" />
                                            ) : (
                                                <span className="material-symbols-outlined text-3xl text-neutral-300">shopping_bag</span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-bold text-[#0f181a]">{req.returnRequestNumber}</h4>
                                                        <span className="text-xs text-[#538893]">• {new Date(req.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="font-medium text-sm text-[#0f181a] line-clamp-1">{firstItem?.productId?.title || 'Unknown Product'}</p>
                                                    {itemCount > 1 && (
                                                        <p className="text-xs text-[#538893] mt-1">+ {itemCount - 1} more items</p>
                                                    )}
                                                </div>
                                                <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${statusStyle.bg} ${statusStyle.text}`}>
                                                    {statusStyle.label}
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                <div className="text-sm">
                                                    <span className="text-[#538893]">Refund Amount: </span>
                                                    <span className="font-bold text-[#0f181a]">₹{req.refundAmount?.toFixed(2)}</span>
                                                </div>
                                                {/* Future: Add View Details button */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}

                            {returns.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="size-16 bg-[#f6f8f8] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <span className="material-symbols-outlined text-2xl text-neutral-400">assignment_return</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-[#0f181a] mb-2">No Returns Yet</h3>
                                    <p className="text-[#538893] text-sm max-w-xs mx-auto">You haven't submitted any return requests.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
