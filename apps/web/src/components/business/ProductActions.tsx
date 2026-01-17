"use client";
import { useState } from 'react';
import { apiPatch, apiPost, apiPut } from '@/utils/api';

type Role = 'BUSINESS_OWNER' | 'BUSINESS_MANAGER' | 'BUSINESS_STAFF' | 'ADMIN' | string;

export function CreateProduct({ role, brands, onCreated }: { role: Role; brands: Array<{ _id: string; name: string }>; onCreated?: () => void }) {
  const canManage = role === 'BUSINESS_OWNER' || role === 'BUSINESS_MANAGER';
  const [brandId, setBrandId] = useState(brands[0]?._id || '');
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');
  const [stock, setStock] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canManage) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiPost('/products', {
        brandId,
        title: title.trim(),
        price: typeof price === 'number' ? price : Number(price),
        category: category.trim(),
        image: image.trim(),
        stock: typeof stock === 'number' ? stock : Number(stock) || 0,
      });
      setTitle(''); setPrice(''); setCategory(''); setImage(''); setStock('');
      onCreated?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex flex-wrap gap-2 items-center">
        <select value={brandId} onChange={(e) => setBrandId(e.target.value)} className="border rounded px-3 py-2 text-sm">
          {brands.map((b) => (
            <option key={b._id} value={b._id}>{b.name}</option>
          ))}
        </select>
        <input className="border rounded px-3 py-2 text-sm w-48" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="number" className="border rounded px-3 py-2 text-sm w-32" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} />
        <input className="border rounded px-3 py-2 text-sm w-40" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <input className="border rounded px-3 py-2 text-sm w-64" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
        <input type="number" className="border rounded px-3 py-2 text-sm w-28" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))} />
        <button type="submit" disabled={loading || !title || !price || !category || !image || !brandId}
          className="inline-flex items-center px-3 py-2 rounded bg-gray-900 text-white text-sm disabled:opacity-50">
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </form>
  );
}

export function EditProduct({ role, product, onUpdated }: { role: Role; product: any; onUpdated?: () => void }) {
  const canManage = role === 'BUSINESS_OWNER' || role === 'BUSINESS_MANAGER';
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(product.title || '');
  const [price, setPrice] = useState<number | ''>(product.price ?? '');
  const [category, setCategory] = useState(product.category || '');
  const [image, setImage] = useState(product.primaryImage || product.image || '');
  const [stock, setStock] = useState<number | ''>(product.stock ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canManage) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiPut(`/products/${product._id}`, {
        title: title.trim(),
        price: typeof price === 'number' ? price : Number(price),
        category: category.trim(),
        image: image.trim(),
        stock: typeof stock === 'number' ? stock : Number(stock) || 0,
      });
      setOpen(false);
      onUpdated?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inline-block">
      <button onClick={() => setOpen((v) => !v)} className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 mr-2">Edit</button>
      {open && (
        <form onSubmit={submit} className="mt-2 p-3 border rounded bg-gray-50 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <input className="border rounded px-2 py-1 text-sm" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="number" className="border rounded px-2 py-1 text-sm" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} />
            <input className="border rounded px-2 py-1 text-sm" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input className="border rounded px-2 py-1 text-sm" placeholder="Image URL" value={image} onChange={(e) => setImage(e.target.value)} />
            <input type="number" className="border rounded px-2 py-1 text-sm" placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))} />
          </div>
          <div className="flex items-center gap-2">
            <button type="submit" disabled={loading} className="px-3 py-1.5 text-sm rounded bg-gray-900 text-white disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" onClick={() => setOpen(false)} className="px-3 py-1.5 text-sm rounded border">Cancel</button>
            {error && <span className="text-sm text-red-600">{error}</span>}
          </div>
        </form>
      )}
    </div>
  );
}

export function ProductStatusButton({ id, isActive, role, onChanged }: { id: string; isActive: boolean; role: Role; onChanged?: () => void }) {
  const canManage = role === 'BUSINESS_OWNER' || role === 'BUSINESS_MANAGER';
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toggle = async () => {
    if (!canManage) return;
    setLoading(true);
    setError(null);
    try {
      await apiPatch(`/products/${id}/status`, { isActive: !isActive });
      onChanged?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="inline-flex items-center gap-2">
      <button onClick={toggle} disabled={!canManage || loading} className="px-2 py-1 text-xs rounded border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
        {loading ? 'Saving...' : isActive ? 'Deactivate' : 'Activate'}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
