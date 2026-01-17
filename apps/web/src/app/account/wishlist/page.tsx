'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';

interface WishlistDoc {
  _id: string;
  productIds: string[];
}

interface ProductItem { _id: string; title: string; price: number; }

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<WishlistDoc | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [wishlistRes, productsRes] = await Promise.all([
          fetch(`${API_BASE}/wishlist`).then(r => r.ok ? r.json() : null),
          fetch(`${API_BASE}/products`).then(r => r.ok ? r.json() : []),
        ]);
        setWishlist(wishlistRes);
        setProducts(productsRes);
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const productMap = new Map(products.map((p) => [p._id, p]));
  const items = (wishlist?.productIds || []).map((id) => productMap.get(id)).filter(Boolean) as ProductItem[];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Wishlist</h1>
          <p className="text-gray-600 mt-1">Products you saved for later.</p>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center text-gray-600">
            Your wishlist is empty.
          </div>
        ) : (
          <ul className="bg-white border border-gray-200 rounded-lg divide-y">
            {items.map((p) => (
              <li key={p._id} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">{p.title}</div>
                  <div className="text-sm text-gray-700">₹{p.price.toFixed(2)}</div>
                </div>
                <WishlistRemoveButton productId={p._id} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}

function WishlistRemoveButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/wishlist/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Failed to remove');
      } else {
        router.refresh();
      }
    } catch (e) {
      setError('Failed to remove');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={remove}
        disabled={loading}
        className="inline-flex items-center px-3 py-1.5 rounded border text-sm border-red-600 text-red-700 hover:bg-red-50 disabled:opacity-60"
      >
        {loading ? 'Removing...' : 'Remove'}
      </button>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  );
}
