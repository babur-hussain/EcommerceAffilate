"use client";
import { useState } from 'react';
import { apiPatch, apiPost } from '@/utils/api';

type Role = 'BUSINESS_OWNER' | 'BUSINESS_MANAGER' | 'BUSINESS_STAFF' | 'ADMIN' | string;

export function CreateBrand({ role, onCreated }: { role: Role; onCreated?: () => void }) {
  const canManage = role === 'BUSINESS_OWNER' || role === 'BUSINESS_MANAGER';
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canManage) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await apiPost('/brands', { name: name.trim() });
      setName('');
      onCreated?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to create brand');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New brand name"
        className="border rounded px-3 py-2 text-sm w-64"
      />
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="inline-flex items-center px-3 py-2 rounded bg-gray-900 text-white text-sm disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Brand'}
      </button>
      {error && <span className="text-sm text-red-600">{error}</span>}
    </form>
  );
}

export function BrandStatusButton({ id, isActive, role, onChanged }: { id: string; isActive: boolean; role: Role; onChanged?: () => void }) {
  const canManage = role === 'BUSINESS_OWNER' || role === 'BUSINESS_MANAGER';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = async () => {
    if (!canManage) return;
    setLoading(true);
    setError(null);
    try {
      await apiPatch(`/brands/${id}/status`, { isActive: !isActive });
      onChanged?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={!canManage || loading}
        className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? 'Saving...' : isActive ? 'Deactivate' : 'Activate'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
