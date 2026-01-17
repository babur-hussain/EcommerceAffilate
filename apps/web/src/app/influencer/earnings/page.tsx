import { cookies } from 'next/headers';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

type Attr = {
  _id: string;
  productId?: { title?: string } | string;
  commissionAmount: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';
  createdAt: string;
};

async function getAttributions(status?: string): Promise<Attr[]> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return [];
  const qs = status ? `?status=${encodeURIComponent(status)}` : '';
  const res = await fetch(`${API_BASE}/influencer/attributions${qs}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data?.data ?? [];
}

export default async function InfluencerEarningsPage() {
  const [pending, approved, paid] = await Promise.all([
    getAttributions('PENDING'),
    getAttributions('APPROVED'),
    getAttributions('PAID'),
  ]);

  const Section = ({ title, items }: { title: string; items: Attr[] }) => (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b font-semibold text-gray-900">{title}</div>
      {items.length === 0 ? (
        <div className="px-4 py-6 text-sm text-gray-600">No records.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((a) => (
                <tr key={a._id}>
                  <td className="px-4 py-3 text-sm text-gray-700">{new Date(a.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{typeof a.productId === 'string' ? a.productId : a.productId?.title || 'Product'}</td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">₹{a.commissionAmount.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-6 py-10 space-y-6">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600 mt-1">Pending, approved, and paid commissions.</p>
        </div>

        <Section title="Pending" items={pending} />
        <Section title="Approved" items={approved} />
        <Section title="Paid" items={paid} />

        <div className="text-right">
          <button className="inline-flex items-center px-3 py-1.5 rounded border text-sm border-gray-300 text-gray-700 hover:bg-gray-50" disabled>
            Request Withdrawal (soon)
          </button>
        </div>
      </main>
    </div>
  );
}
