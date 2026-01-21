'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';

interface WishlistDoc {
  _id: string;
  productIds: string[];
}

interface ProductItem {
  _id: string;
  title: string;
  price: number;
  image?: string;
  description?: string;
}

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse text-primary font-bold">Loading your collection...</div>
      </div>
    );
  }

  const productMap = new Map(products.map((p) => [p._id, p]));
  const items = (wishlist?.productIds || []).map((id) => productMap.get(id)).filter(Boolean) as ProductItem[];

  return (
    <div className="bg-white font-display text-slate-900 transition-colors duration-300 min-h-screen">
      <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          <main className="flex-1 flex flex-col items-center">
            <div className="w-full max-w-[960px] px-4 py-8 md:py-12">
              {/* Page Heading */}
              <div className="flex flex-col gap-4 mb-10 text-center md:text-left">
                <h1 className="text-slate-900 text-4xl md:text-5xl font-black leading-tight tracking-[-0.033em]">
                  Your Collection
                </h1>
                <p className="text-slate-500 text-lg font-medium max-w-xl">
                  Curated treasures and daily essentials, ready for your next moment.
                </p>
              </div>

              {/* Boards Navigation (Chips) */}
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-slate-900 text-sm font-bold uppercase tracking-widest">Boards</h3>
                </div>
                <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                  <div className="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-primary text-white px-6 shadow-lg shadow-primary/20 cursor-pointer">
                    <span className="text-sm font-bold leading-normal">All Items</span>
                  </div>
                  {['Weekly Grocery', 'Summer Tech', 'Home Decor', 'Gifts'].map((board) => (
                    <div key={board} className="flex h-11 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 px-6 transition-all cursor-pointer">
                      <span className="text-sm font-bold leading-normal">{board}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Grid */}
              {items.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl">
                  <p className="text-slate-400 text-lg">Your collection is empty.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12">
                  {items.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              )}

              {/* Actions Bar (Bottom Floating) */}
              <div className="mt-20 flex justify-center sticky bottom-8 z-40">
                <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-full px-8 py-4 shadow-2xl flex gap-12 items-center">
                  <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="rounded-full bg-slate-100 p-3 group-hover:bg-primary transition-colors">
                      <span className="material-symbols-outlined text-slate-600 group-hover:text-white">favorite</span>
                    </div>
                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest group-hover:text-primary">Wishlist</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="rounded-full bg-slate-100 p-3 group-hover:bg-primary transition-colors">
                      <span className="material-symbols-outlined text-slate-600 group-hover:text-white">add_circle</span>
                    </div>
                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest group-hover:text-primary">New Board</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 cursor-pointer group">
                    <div className="rounded-full bg-slate-100 p-3 group-hover:bg-primary transition-colors">
                      <span className="material-symbols-outlined text-slate-600 group-hover:text-white">share</span>
                    </div>
                    <p className="text-slate-600 text-[10px] font-bold uppercase tracking-widest group-hover:text-primary">Share</p>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          vertical-align: middle;
        }
        .heart-filled {
          font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          color: #19a1e6;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

function ProductCard({ product }: { product: ProductItem }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Random data for visuals if missing
  const deliveryTime = "25 min delivery";
  const imageUrl = product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop";

  const remove = async () => {
    if (!confirm('Remove from wishlist?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/wishlist/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product._id }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group flex flex-col gap-5 relative">
      <div className="relative w-full aspect-4/5 bg-slate-50 rounded-xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-500">
        <div
          className="absolute inset-0 bg-center bg-cover transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        />

        <button
          onClick={remove}
          disabled={loading}
          className="absolute top-4 right-4 bg-white/90 backdrop-blur-md rounded-full p-2.5 shadow-sm active:scale-90 transition-transform hover:bg-white z-10"
        >
          <span className="material-symbols-outlined heart-filled text-xl text-primary">{loading ? 'hourglass_empty' : 'favorite'}</span>
        </button>

        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
            <div className="size-2 rounded-full bg-[#8CC28C]"></div>
            <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">{deliveryTime}</span>
          </div>
        </div>

        <button className="absolute bottom-4 right-4 bg-primary text-white rounded-full p-3 shadow-lg transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <span className="material-symbols-outlined">add_shopping_cart</span>
        </button>
      </div>

      <div className="flex justify-between items-start px-1">
        <div className="flex flex-col gap-1">
          <h3 className="text-slate-900 text-lg font-bold">{product.title}</h3>
          <p className="text-slate-500 text-sm font-medium">{product.description || 'Premium Collection'}</p>
        </div>
        <p className="text-slate-900 text-lg font-black">₹{product.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
