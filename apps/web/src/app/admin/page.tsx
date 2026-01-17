import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

interface Metrics {
  totalBusinesses: number;
  totalBrands: number;
  totalProducts: number;
  totalViews: number;
  totalClicks: number;
  totalInfluencers: number;
  totalOrders: number;
  totalRevenue: number;
  activeSponsorships: number;
  totalAdSpend: number;
}

async function getMetrics(): Promise<Metrics | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const res = await fetch(`${API_BASE}/admin/dashboard/metrics`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

export default async function AdminHomePage() {
  const metrics = await getMetrics();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">High-level platform metrics.</p>
        </div>

        {!metrics ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-600">
            Failed to load metrics.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Total Businesses" value={metrics.totalBusinesses} />
            <StatCard label="Total Brands" value={metrics.totalBrands} />
            <StatCard label="Total Products" value={metrics.totalProducts} />
            <StatCard label="Total Influencers" value={metrics.totalInfluencers} />
            <StatCard label="Total Orders" value={metrics.totalOrders} />
            <StatCard label="Total Revenue" value={`₹${metrics.totalRevenue?.toFixed(2) ?? '0.00'}`} />
            <StatCard label="Total Views" value={metrics.totalViews} />
            <StatCard label="Total Clicks" value={metrics.totalClicks} />
            <StatCard label="Active Sponsorships" value={metrics.activeSponsorships} />
            <StatCard label="Total Ad Spend" value={`₹${metrics.totalAdSpend?.toFixed(2) ?? '0.00'}`} />
          </div>
        )}
      </main>
    </div>
  );
}
