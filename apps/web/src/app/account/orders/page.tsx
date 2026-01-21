import { cookies } from 'next/headers';
import Link from 'next/link';
import ActiveOrderTracker from '@/components/order/ActiveOrderTracker';

export const dynamic = 'force-dynamic';

// Server-side fetch needs full backend URL
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:4000';
const AUTH_COOKIE_NAME = 'auth_token';

interface OrderItem {
  _id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: any[];
}

async function getMyOrders(): Promise<OrderItem[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return [];
  const res = await fetch(`${BACKEND_URL}/api/orders/mine`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

/** 
 * Helper to determine status color based on order status 
 */
function getStatusStyles(status: string) {
  const s = status.toUpperCase();
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
      return { bg: 'bg-neutral-100', text: 'text-neutral-700', label: status };
  }
}

export default async function AccountOrdersPage() {
  const orders = await getMyOrders();
  const activeOrder = orders.length > 0 ? orders[0] : null;
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value || '';

  return (
    <div className="min-h-screen bg-[#f6f8f8] text-[#0f181a] font-sans pb-20">
      <main className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8 p-6 lg:p-10">

        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 flex flex-col gap-8 shrink-0">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-[#e8f0f2]">
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
              <Link href="/account/payments" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#f6f8f8] text-[#538893] transition-all">
                <span className="material-symbols-outlined">credit_card</span>
                <span>Payments</span>
              </Link>
            </nav>
          </div>

          {/* Promotion Card */}
          <div className="bg-[#22a8c3]/10 rounded-xl p-6 border border-[#22a8c3]/20 relative overflow-hidden">
            <div className="relative z-10">
              <p className="text-[#22a8c3] font-bold text-sm mb-1">Upgrade to Gold</p>
              <p className="text-sm mb-4 text-neutral-600">Get unlimited free deliveries on all orders above ₹200.</p>
              <button className="bg-[#22a8c3] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#1b8fa6] transition-colors">
                Learn More
              </button>
            </div>
            <span className="material-symbols-outlined absolute -bottom-4 -right-4 text-[#22a8c3]/10 text-8xl rotate-12 select-none">loyalty</span>
          </div>
        </aside>

        {/* Main Content */}
        <section className="flex-1 flex flex-col gap-8 min-w-0">

          {/* Page Heading & Breadcrumbs */}
          <div className="flex flex-col gap-2">
            <nav className="flex items-center gap-2 text-xs font-medium text-[#538893]">
              <Link href="/" className="hover:text-[#22a8c3]">Home</Link>
              <span className="material-symbols-outlined text-[10px]">chevron_right</span>
              <span className="text-[#0f181a]">Active Orders</span>
            </nav>
            <div className="flex flex-wrap justify-between items-end gap-4">
              <div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight text-[#0f181a]">Active Orders</h1>
                <p className="text-[#538893] mt-1">Real-time status of your current deliveries</p>
              </div>
            </div>
          </div>

          {/* Active Order Tracker (Client Component) */}
          <ActiveOrderTracker
            initialOrder={activeOrder}
            apiBase="/api"
            token={token}
          />

          {/* Past Orders Grid */}
          <div className="bg-white p-6 rounded-xl border border-[#e8f0f2] shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-neutral-900">Past Orders</h3>
            </div>
            <div className="space-y-4">
              {orders.slice(1).map(order => (
                <div key={order._id} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl hover:bg-[#f6f8f8] transition-colors border border-transparent hover:border-[#e8f0f2]">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="size-14 bg-[#f8fbfb] rounded-lg p-3 flex items-center justify-center border border-[#e8f0f2]">
                      <span className="material-symbols-outlined text-neutral-400">inventory_2</span>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-neutral-900">Order #{order._id.slice(-6).toUpperCase()}</p>
                      <p className="text-xs text-[#538893]">{new Date(order.createdAt).toLocaleDateString()} • ₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyles(order.status).bg} ${getStatusStyles(order.status).text}`}>
                      {getStatusStyles(order.status).label}
                    </span>
                    <Link href={`/account/orders/${order._id}`} className="bg-[#e8f0f2] text-[#22a8c3] p-2 rounded-lg hover:bg-[#22a8c3] hover:text-white transition-all">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              ))}
              {orders.length <= 1 && (
                <p className="text-sm text-neutral-400 text-center py-4">No past orders to show.</p>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
