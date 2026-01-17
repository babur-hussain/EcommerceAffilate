import { cookies } from 'next/headers';
import { BusinessStatusToggle, BusinessDetails } from '@/components/admin/AdminBusinessControls';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

async function fetchBusinesses(token: string) {
  const res = await fetch(`${API_BASE}/admin/businesses`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminBusinessesPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Businesses</h1>
          <div className="text-gray-600">Admin access required.</div>
        </main>
      </div>
    );
  }

  const businesses = await fetchBusinesses(token);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Businesses</h1>
            <p className="text-gray-600 mt-1">Manage business activation and view catalog.</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-gray-900">All Businesses</div>
          {(!businesses || businesses.length === 0) ? (
            <div className="px-4 py-6 text-sm text-gray-600">No businesses found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Legal</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {businesses.map((b: any) => (
                    <tr key={b._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{b.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{b.legalName}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${b.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                          {b.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <BusinessStatusToggle business={b} onChange={() => window.location.reload()} />
                        <BusinessDetails businessId={b._id} />
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
