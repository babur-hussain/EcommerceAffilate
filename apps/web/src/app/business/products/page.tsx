import { cookies } from 'next/headers';
import { CreateProduct, EditProduct, ProductStatusButton } from '@/components/business/ProductActions';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

async function getToken() {
  const store = await cookies();
  return store.get(AUTH_COOKIE_NAME)?.value;
}

async function api(path: string, token: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export default async function BusinessProductsPage() {
  const token = await getToken();
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
          <div className="text-gray-600">Please login to view your products.</div>
        </main>
      </div>
    );
  }

  const [me, brands, products] = await Promise.all([
    api('/me', token),
    api('/brands', token),
    api('/brand/products', token),
  ]);

  const role = me?.role || 'BUSINESS_STAFF';
  const brandList: Array<{ _id: string; name: string }> = Array.isArray(brands) ? brands : [];
  const productList: any[] = Array.isArray(products) ? products : [];

  const byBrand: Record<string, any[]> = {};
  for (const p of productList) {
    const key = p.brandId?.toString?.() || String(p.brandId);
    if (!byBrand[key]) byBrand[key] = [];
    byBrand[key].push(p);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600 mt-1">Manage products grouped by brand.</p>
          </div>
          <div>
            <CreateProduct role={role} brands={brandList} onCreated={() => window.location.reload()} />
          </div>
        </div>

        {brandList.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-sm text-gray-600">No brands found. Create a brand first.</div>
        ) : (
          brandList.map((b) => {
            const items = byBrand[b._id] || [];
            return (
              <div key={b._id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b font-semibold text-gray-900">{b.name}</div>
                {items.length === 0 ? (
                  <div className="px-4 py-6 text-sm text-gray-600">No products under this brand.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Price</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Stock</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Popularity</th>
                          <th className="px-4 py-3"></th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((p: any) => (
                          <tr key={p._id}>
                            <td className="px-4 py-3 text-sm text-gray-900">{p.title}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">₹{Number(p.price).toFixed(2)}</td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{p.stock ?? 0}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-gray-900">{p.popularityScore ?? 0}</td>
                            <td className="px-4 py-3 text-right">
                              <EditProduct role={role} product={p} onUpdated={() => window.location.reload()} />
                              <ProductStatusButton role={role} id={p._id} isActive={!!p.isActive} onChanged={() => window.location.reload()} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
