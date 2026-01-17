import { cookies } from 'next/headers';
import { CreateSponsorship, PauseSponsorshipButton } from '@/components/business/SponsorshipActions';

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

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    PAUSED: 'bg-gray-100 text-gray-700',
    EXPIRED: 'bg-gray-100 text-gray-700',
    REJECTED: 'bg-red-100 text-red-800',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-700';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
}

export default async function BusinessSponsorshipsPage() {
  const token = await getToken();
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sponsorships</h1>
          <div className="text-gray-600">Please login to view your sponsorships.</div>
        </main>
      </div>
    );
  }

  const [me, sponsorships] = await Promise.all([
    api('/me', token),
    api('/sponsorships/mine', token),
  ]);
  const role = me?.role || 'BUSINESS_STAFF';
  const items: any[] = Array.isArray(sponsorships) ? sponsorships : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sponsorships</h1>
            <p className="text-gray-600 mt-1">Manage your product sponsorships.</p>
          </div>
          <CreateSponsorship role={role} onCreated={() => window.location.reload()} />
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-gray-900">All Sponsorships</div>
          {items.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-600">No sponsorships yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Budget</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Daily</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {items.map((s: any) => {
                    const p: any = s.productId || {};
                    return (
                      <tr key={s._id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{p?.title || 'Product'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{p?.brand || '-'}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">₹{Number(s.budget).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-right text-gray-900">₹{Number(s.dailyBudget).toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm"><StatusBadge status={s.status} /></td>
                        <td className="px-4 py-3 text-right">
                          {(s.status === 'ACTIVE') && (
                            <PauseSponsorshipButton id={s._id} role={role} onPaused={() => window.location.reload()} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
