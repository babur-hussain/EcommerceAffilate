import { cookies } from 'next/headers';
import { AuditFilters } from '@/components/admin/AuditFilters';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

async function fetchLogs(token: string, searchParams: Record<string, string | string[] | undefined>) {
  const query = new URLSearchParams();
  ['page', 'limit', 'entityType', 'action', 'startDate', 'endDate'].forEach((key) => {
    const value = searchParams[key];
    if (typeof value === 'string' && value) query.set(key, value);
  });
  const qs = query.toString();
  const res = await fetch(`${API_BASE}/admin/audit-logs${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return { data: [], total: 0, page: 1, limit: 20 };
  return res.json();
}

export default async function AdminAuditLogsPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-6xl mx-auto px-6 py-10">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Audit Logs</h1>
          <div className="text-gray-600">Admin access required.</div>
        </main>
      </div>
    );
  }

  const logs = await fetchLogs(token, searchParams);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
            <p className="text-gray-600 mt-1">Platform activity with filters.</p>
          </div>
        </div>

        <AuditFilters />

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-3 border-b font-semibold text-gray-900">Logs</div>
          {(logs?.data?.length ?? 0) === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-600">No logs found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">When</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.data.map((log: any) => (
                    <tr key={log._id}>
                      <td className="px-4 py-3 text-sm text-gray-900">{new Date(log.createdAt).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{log.action}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{log.entityType}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{log.userId || '-'}</td>
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
