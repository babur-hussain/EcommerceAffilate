import Link from 'next/link';
import { cookies } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

async function getSummary() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const res = await fetch(`${API_BASE}/influencer/summary`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function InfluencerHomePage() {
  const data = await getSummary();
  const counts = data?.counts || { pending: 0, approved: 0, paid: 0, rejected: 0 };
  const earnings = data?.earnings || { approved: 0, paid: 0 };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Influencer Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of your commissions and performance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-sm text-gray-600">Approved Earnings</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">₹{earnings.approved.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-sm text-gray-600">Paid Out</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">₹{earnings.paid.toFixed(2)}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-sm text-gray-600">Pending Payouts</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{counts.pending}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/influencer/links" className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition">
            <div className="text-lg font-semibold text-gray-900">Affiliate Links</div>
            <div className="text-sm text-gray-600 mt-1">Create and copy your referral links</div>
          </Link>
          <Link href="/influencer/earnings" className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition">
            <div className="text-lg font-semibold text-gray-900">Earnings</div>
            <div className="text-sm text-gray-600 mt-1">Pending, approved, and paid commissions</div>
          </Link>
          <Link href="/influencer/performance" className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-sm transition">
            <div className="text-lg font-semibold text-gray-900">Performance</div>
            <div className="text-sm text-gray-600 mt-1">Orders, conversion, and earnings</div>
          </Link>
        </div>
      </main>
    </div>
  );
}
