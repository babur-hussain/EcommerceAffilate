import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

interface BrandProduct {
  _id: string;
  title: string;
  price: number;
  stock: number;
  isActive: boolean;
  sponsoredScore: number;
}

async function getBrandProducts(): Promise<BrandProduct[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return [];
  const res = await fetch(`${API_BASE}/brand/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function BrandProductsPage() {
  let products: BrandProduct[] = [];
  try {
    products = await getBrandProducts();
  } catch (e) {
    // fall through to error UI below
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-600 mt-1">Overview of your active catalog.</p>
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
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sponsored Score</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((p) => (
                    <tr key={p._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{p.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">₹{p.price.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.stock}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={p.isActive ? 'text-green-700' : 'text-gray-500'}>
                          {p.isActive ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.sponsoredScore ?? 0}</td>
                      <td className="px-4 py-3 text-sm text-right space-x-3">
                        <button className="inline-flex items-center px-3 py-1.5 rounded border text-sm border-gray-300 text-gray-700 hover:bg-gray-50" disabled>
                          Edit
                        </button>
                        <button className="inline-flex items-center px-3 py-1.5 rounded border text-sm border-blue-600 text-blue-600 hover:bg-blue-50" disabled>
                          Create Sponsorship
                        </button>
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
