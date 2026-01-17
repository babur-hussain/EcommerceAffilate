import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

type SponsorshipStatus = 'PENDING' | 'ACTIVE' | 'PAUSED' | 'EXPIRED';

interface SponsorshipProduct {
  _id: string;
  title: string;
}

interface BrandSponsorship {
  _id: string;
  productId: string | SponsorshipProduct; // populated on backend
  budget: number; // remaining budget
  initialBudget?: number;
  dailyBudget: number;
  startDate: string;
  endDate: string;
  status: 'PENDING' | 'ACTIVE' | 'PAUSED';
}

function computeStatus(s: BrandSponsorship): SponsorshipStatus {
  const now = Date.now();
  const ended = new Date(s.endDate).getTime() < now;
  if (ended) return 'EXPIRED';
  return s.status;
}

async function getBrandSponsorships(): Promise<BrandSponsorship[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return [];
  const res = await fetch(`${API_BASE}/brand/sponsorships`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function BrandSponsorshipsPage() {
  let sponsorships: BrandSponsorship[] = [];
  try {
    sponsorships = await getBrandSponsorships();
  } catch (e) {}

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sponsorships</h1>
          <p className="text-gray-600 mt-1">Budgets and current statuses.</p>
        </div>

        {sponsorships.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-600">
            No sponsorships found or failed to load.
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget Remaining</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Daily Budget</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sponsorships.map((s) => {
                    const productTitle = typeof s.productId === 'string' ? s.productId : s.productId?.title;
                    const status = computeStatus(s);
                    return (
                      <tr key={s._id}>
                        <td className="px-4 py-3 text-sm text-gray-900">{productTitle || 'Unknown Product'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">${'{'}(s.budget ?? 0).toFixed(2){'}'}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">${'{'}(s.dailyBudget ?? 0).toFixed(2){'}'}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={
                            status === 'ACTIVE'
                              ? 'text-green-700'
                              : status === 'PAUSED'
                              ? 'text-yellow-700'
                              : status === 'PENDING'
                              ? 'text-gray-700'
                              : 'text-red-700'
                          }>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
