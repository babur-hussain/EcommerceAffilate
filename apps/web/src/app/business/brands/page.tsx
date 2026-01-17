import { cookies } from 'next/headers';
import { CreateBrand, BrandStatusButton } from '@/components/business/BrandActions';

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

export default async function BusinessBrandsPage() {
  const token = await getToken();
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-5xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Brands</h1>
          <div className="text-gray-600">Please login to view your brands.</div>
        </main>
      </div>
    );
  }

  const [me, brands] = await Promise.all([
    api('/me', token),
    api('/brands', token),
  ]);

  const role = me?.role || 'BUSINESS_STAFF';
  const items = Array.isArray(brands) ? brands : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
            <p className="text-gray-600 mt-1">List of brands under your business.</p>
          </div>
          <CreateBrand role={role} onCreated={() => window.location.reload()} />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-gray-900">Brands</div>
          {items.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-600">No brands found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((b: any) => (
                    <tr key={b._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{b.name}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${b.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                          {b.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <BrandStatusButton id={b._id} isActive={!!b.isActive} role={role} onChanged={() => window.location.reload()} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
