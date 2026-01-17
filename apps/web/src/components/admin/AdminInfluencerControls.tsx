"use client";
import { useState } from 'react';
import { apiGet, apiPatch } from '@/utils/api';

type Influencer = { _id: string; email: string; isActive: boolean };

export function InfluencerStatusToggle({ influencer, onChange }: { influencer: Influencer; onChange?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiPatch(`/admin/influencers/${influencer._id}/status`, { isActive: !influencer.isActive });
      onChange?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={toggle} disabled={loading} className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
        {loading ? 'Saving...' : influencer.isActive ? 'Suspend' : 'Approve'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

export function InfluencerSummary({ influencerId }: { influencerId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<{ pending?: number; approved?: number; paid?: number; rejected?: number } | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<{ pending: number; approved: number; paid: number; rejected: number }>(`/admin/influencers/${influencerId}/summary`);
      setData(res);
    } catch (err: any) {
      setError(err?.message || 'Failed to load summary');
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && !data && !loading) {
      void load();
    }
  };

  return (
    <div className="mt-1 text-sm">
      <button onClick={toggle} className="text-gray-700 underline">{open ? 'Hide earnings' : 'View earnings'}</button>
      {open && (
        <div className="mt-1">
          {loading && <div className="text-gray-600">Loading...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {data && (
            <div className="text-gray-800 space-y-1">
              <div>Pending: ₹{data.pending?.toFixed(2) ?? '0.00'}</div>
              <div>Approved: ₹{data.approved?.toFixed(2) ?? '0.00'}</div>
              <div>Paid: ₹{data.paid?.toFixed(2) ?? '0.00'}</div>
              <div>Rejected: ₹{data.rejected?.toFixed(2) ?? '0.00'}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
