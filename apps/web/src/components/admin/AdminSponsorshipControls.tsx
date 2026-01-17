"use client";
import { useState } from 'react';
import { apiPost } from '@/utils/api';

type SAction = 'approve' | 'pause' | 'reject';

export function SponsorshipActions({ id, onChange }: { id: string; onChange?: () => void }) {
  const [loading, setLoading] = useState<SAction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const act = async (action: SAction) => {
    setLoading(action);
    setError(null);
    try {
      await apiPost(`/admin/sponsorships/${id}/${action}`, {});
      onChange?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to update');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => act('approve')} disabled={loading !== null} className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50">{loading === 'approve' ? 'Saving...' : 'Approve'}</button>
      <button onClick={() => act('pause')} disabled={loading !== null} className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50">{loading === 'pause' ? 'Saving...' : 'Pause'}</button>
      <button onClick={() => act('reject')} disabled={loading !== null} className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50">{loading === 'reject' ? 'Saving...' : 'Reject'}</button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
