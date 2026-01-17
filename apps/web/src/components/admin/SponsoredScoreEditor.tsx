'use client';

import { useState } from 'react';

export default function SponsoredScoreEditor({ productId, initialScore }: { productId: string; initialScore: number; }) {
  const [score, setScore] = useState<number>(initialScore ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  const onSubmit = async () => {
    setSaving(true);
    setError(null);
    setOk(false);
    try {
      const res = await fetch(`/api/admin/products/${productId}/sponsored-score`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score: Number(score) }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Failed to save');
      } else {
        setOk(true);
      }
    } catch (e) {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center gap-2 justify-end">
      <input
        type="number"
        value={score}
        onChange={(e) => setScore(Number(e.target.value))}
        className="w-24 rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none"
      />
      <button
        onClick={onSubmit}
        disabled={saving}
        className="inline-flex items-center px-3 py-1.5 rounded border text-sm border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save'}
      </button>
      {ok && <span className="text-xs text-green-700">Saved</span>}
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  );
}
