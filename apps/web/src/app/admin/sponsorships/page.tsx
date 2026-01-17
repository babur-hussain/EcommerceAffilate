import { cookies } from 'next/headers';
import { SponsorshipActions } from '@/components/admin/AdminSponsorshipControls';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

async function fetchSponsorships(token: string) {
  const res = await fetch(`${API_BASE}/admin/sponsorships?status=PENDING`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    PAUSED: 'bg-gray-100 text-gray-700',
    REJECTED: 'bg-red-100 text-red-800',
  };
  const cls = map[status] || 'bg-gray-100 text-gray-700';
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
}

export default async function AdminSponsorshipsPage() {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Sponsorships</h1>
          <div className="text-gray-600">Admin access required.</div>
        </main>
      </div>
    );
  }

  const sponsorships = await fetchSponsorships(token);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sponsorship Moderation</h1>
          <p className="text-gray-600 mt-1">Approve, pause, or reject pending sponsorships.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-gray-900">Pending Sponsorships</div>
          {(!sponsorships || sponsorships.length === 0) ? (
            <div className="px-4 py-6 text-sm text-gray-600">No pending sponsorships.</div>
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
                  {sponsorships.map((s: any) => (
                    <tr key={s._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{s.productId?.title || 'Product'}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{s.productId?.brand || '-'}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">₹{Number(s.budget).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900">₹{Number(s.dailyBudget).toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm"><StatusBadge status={s.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <SponsorshipActions id={s._id} onChange={() => window.location.reload()} />
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
