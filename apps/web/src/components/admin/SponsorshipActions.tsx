'use client';

import { useState } from 'react';

export default function SponsorshipActions({ sponsorshipId }: { sponsorshipId: string }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const call = async (action: 'approve' | 'pause') => {
    setLoading(action);
    setError(null);
    setOk(null);
    try {
      const res = await fetch(`/api/admin/sponsorships/${sponsorshipId}/${action}`, { method: 'POST' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || `Failed to ${action}`);
      } else {
        setOk(action);
      }
    } catch (e) {
      setError(`Failed to ${action}`);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <button
        onClick={() => call('approve')}
        disabled={loading !== null}
        className="inline-flex items-center px-3 py-1.5 rounded border text-sm border-green-600 text-green-700 hover:bg-green-50 disabled:opacity-60"
      >
        {loading === 'approve' ? 'Approving...' : 'Approve'}
      </button>
      <button
        onClick={() => call('pause')}
        disabled={loading !== null}
        className="inline-flex items-center px-3 py-1.5 rounded border text-sm border-yellow-600 text-yellow-700 hover:bg-yellow-50 disabled:opacity-60"
      >
        {loading === 'pause' ? 'Pausing...' : 'Pause'}
      </button>
      {ok && <span className="text-xs text-green-700 capitalize">{ok}d</span>}
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  );
}
