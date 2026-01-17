"use client";
import { useEffect, useState } from 'react';
import { apiGet, apiPatch, apiPost } from '@/utils/api';

type Role = 'BUSINESS_OWNER' | 'BUSINESS_MANAGER' | 'BUSINESS_STAFF' | 'ADMIN' | string;

export function CreateSponsorship({ role, onCreated }: { role: Role; onCreated?: () => void }) {
  const canManage = role === 'BUSINESS_OWNER' || role === 'BUSINESS_MANAGER';
  const [products, setProducts] = useState<Array<{ _id: string; title: string }>>([]);
  const [productId, setProductId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [dailyBudget, setDailyBudget] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!canManage) return;
    apiGet<any[]>('/brand/products')
      .then((list) => {
        const items = Array.isArray(list) ? list : [];
        setProducts(items.map((p: any) => ({ _id: p._id, title: p.title })));
        setProductId(items[0]?._id || '');
      })
      .catch(() => {});
  }, [canManage]);

  if (!canManage) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiPost('/sponsorships', {
        productId,
        startDate,
        endDate,
        budget: typeof budget === 'number' ? budget : Number(budget),
        dailyBudget: typeof dailyBudget === 'number' ? dailyBudget : Number(dailyBudget),
      });
      setProductId(products[0]?._id || '');
      setStartDate(''); setEndDate(''); setBudget(''); setDailyBudget('');
      onCreated?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to create sponsorship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <select value={productId} onChange={(e) => setProductId(e.target.value)} className="border rounded px-3 py-2 text-sm min-w-56">
          {products.map((p) => (
            <option key={p._id} value={p._id}>{p.title}</option>
          ))}
        </select>
        <input type="date" className="border rounded px-3 py-2 text-sm" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <input type="date" className="border rounded px-3 py-2 text-sm" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <input type="number" className="border rounded px-3 py-2 text-sm w-36" placeholder="Budget" value={budget} onChange={(e) => setBudget(e.target.value === '' ? '' : Number(e.target.value))} />
        <input type="number" className="border rounded px-3 py-2 text-sm w-36" placeholder="Daily Budget" value={dailyBudget} onChange={(e) => setDailyBudget(e.target.value === '' ? '' : Number(e.target.value))} />
        <button type="submit" disabled={loading || !productId || !startDate || !endDate || !budget || !dailyBudget}
          className="inline-flex items-center px-3 py-2 rounded bg-gray-900 text-white text-sm disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Sponsorship'}
        </button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </form>
  );
}

export function PauseSponsorshipButton({ id, role, onPaused }: { id: string; role: Role; onPaused?: () => void }) {
  const canManage = role === 'BUSINESS_OWNER' || role === 'BUSINESS_MANAGER';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pause = async () => {
    if (!canManage) return;
    setLoading(true);
    setError(null);
    try {
      await apiPatch(`/sponsorships/${id}/pause`, {});
      onPaused?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to pause');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="inline-flex items-center gap-2">
      <button onClick={pause} disabled={!canManage || loading} className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50">{loading ? 'Pausing...' : 'Pause'}</button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
