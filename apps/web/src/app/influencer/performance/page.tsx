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

export default async function InfluencerPerformancePage() {
  const data = await getSummary();
  const counts = data?.counts || { pending: 0, approved: 0, paid: 0, rejected: 0 };
  const earnings = data?.earnings || { approved: 0, paid: 0 };

  const orders = counts.pending + counts.approved + counts.paid; // excludes rejected
  const clicks = null; // not tracked per-influencer yet
  const conversion = clicks && clicks > 0 ? `${((orders / clicks) * 100).toFixed(2)}%` : 'N/A';

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Performance</h1>
          <p className="text-gray-600 mt-1">Orders, conversion rate, and earnings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-sm text-gray-600">Clicks</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{clicks ?? '—'}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-sm text-gray-600">Orders</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{orders}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-sm text-gray-600">Conversion</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">{conversion}</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="text-sm text-gray-600">Approved Earnings</div>
            <div className="mt-1 text-2xl font-bold text-gray-900">₹{earnings.approved.toFixed(2)}</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-gray-900">Status Breakdown</div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
            <div>
              <div className="text-sm text-gray-600">Pending</div>
              <div className="text-lg font-semibold text-gray-900">{counts.pending}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Approved</div>
              <div className="text-lg font-semibold text-gray-900">{counts.approved}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Paid</div>
              <div className="text-lg font-semibold text-gray-900">{counts.paid}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Rejected</div>
              <div className="text-lg font-semibold text-gray-900">{counts.rejected}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
