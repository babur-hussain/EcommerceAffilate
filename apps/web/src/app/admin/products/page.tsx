import { cookies } from 'next/headers';
import SponsoredScoreEditor from '@/components/admin/SponsoredScoreEditor';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';

interface ProductItem {
  _id: string;
  title: string;
  price: number;
  sponsoredScore?: number;
  popularityScore?: number;
}

async function getProducts(): Promise<ProductItem[]> {
  const res = await fetch(`${API_BASE}/products`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Products Control</h1>
          <p className="text-gray-600 mt-1">Update sponsored score; popularity is read-only.</p>
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sponsored Score</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Popularity</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{p.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">₹{p.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.sponsoredScore ?? 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.popularityScore ?? 0}</td>
                      <td className="px-4 py-3 text-sm">
                        <SponsoredScoreEditor productId={p._id} initialScore={p.sponsoredScore ?? 0} />
                      </td>
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
