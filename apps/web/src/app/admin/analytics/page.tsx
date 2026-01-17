const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';

interface ProductItem {
  _id: string;
  title: string;
}

interface ProductStats {
  views: number;
  clicks: number;
  popularityScore: number;
}

async function getProducts(): Promise<ProductItem[]> {
  const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
  if (!res.ok) return [];
  const items: any[] = await res.json();
  return items.map((p) => ({ _id: p._id, title: p.title }));
}

async function getProductStats(id: string, token: string | undefined): Promise<ProductStats | null> {
  if (!token) return null;
  const res = await fetch(`${API_BASE}/admin/analytics/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

import { cookies } from 'next/headers';
export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  const products = (await getProducts()).slice(0, 20);
  const stats = await Promise.all(products.map((p) => getProductStats(p._id, token)));

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Per-product stats (first 20 products).</p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-600">
            No products found or failed to load.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popularity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((p, idx) => (
                    <tr key={p._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{p.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{stats[idx]?.views ?? '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{stats[idx]?.clicks ?? '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{stats[idx]?.popularityScore ?? '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
