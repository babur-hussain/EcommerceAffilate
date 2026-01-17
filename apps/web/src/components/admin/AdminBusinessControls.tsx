"use client";
import { useState } from 'react';
import { apiGet, apiPatch } from '@/utils/api';

type Business = { _id: string; name: string; isActive: boolean };

export function BusinessStatusToggle({ business, onChange }: { business: Business; onChange?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggle = async () => {
    setLoading(true);
    setError(null);
    try {
      await apiPatch(`/admin/businesses/${business._id}/status`, { isActive: !business.isActive });
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
        {loading ? 'Saving...' : business.isActive ? 'Deactivate' : 'Activate'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

export function BusinessDetails({ businessId }: { businessId: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, p] = await Promise.all([
        apiGet<any[]>(`/admin/businesses/${businessId}/brands`),
        apiGet<any[]>(`/admin/businesses/${businessId}/products`),
      ]);
      setBrands(Array.isArray(b) ? b : []);
      setProducts(Array.isArray(p) ? p : []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next && brands.length === 0 && products.length === 0) {
      void load();
    }
  };

  return (
    <div className="mt-1">
      <button onClick={toggle} className="text-sm text-gray-700 underline">{open ? 'Hide details' : 'View brands & products'}</button>
      {open && (
        <div className="mt-2 space-y-2 text-sm">
          {loading && <div className="text-gray-600">Loading...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {!loading && !error && (
            <>
              <div>
                <div className="font-semibold text-gray-900">Brands ({brands.length})</div>
                <div className="text-gray-700">{brands.map((b) => b.name).join(', ') || 'None'}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Products ({products.length})</div>
                <div className="text-gray-700 break-words">{products.slice(0, 10).map((p) => p.title).join(', ') || 'None'}{products.length > 10 ? '…' : ''}</div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
