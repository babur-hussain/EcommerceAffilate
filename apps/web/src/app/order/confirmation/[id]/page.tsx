import Link from 'next/link';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

type OrderItem = {
  productId: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  createdAt: string;
};

type Product = {
  _id: string;
  title: string;
  price: number;
};

async function getOrderAndProducts(orderId: string): Promise<{ order: Order | null; products: Product[] }> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return { order: null, products: [] };

  const [ordersRes, productsRes] = await Promise.all([
    fetch(`${API_BASE}/orders/mine`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' }),
    fetch(`${API_BASE}/products`, { cache: 'no-store' }),
  ]);

  const orders: Order[] = ordersRes.ok ? await ordersRes.json() : [];
  const products: Product[] = productsRes.ok ? await productsRes.json() : [];
  const order = orders.find((o) => o._id === orderId) ?? null;
  return { order, products };
}

function ItemList({ items, products }: { items: OrderItem[]; products: Product[] }) {
  const productMap = new Map(products.map((p) => [p._id, p] as const));
  return (
    <ul className="divide-y divide-gray-200">
      {items.map((it, idx) => {
        const p = productMap.get(it.productId);
        return (
          <li key={idx} className="py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-gray-900">{p?.title ?? 'Product'}</div>
              <div className="text-xs text-gray-500">Qty: {it.quantity}</div>
            </div>
            <div className="text-sm text-gray-700">₹{(it.price * it.quantity).toFixed(2)}</div>
          </li>
        );
      })}
    </ul>
  );
}

function ClearCartClient({ enabled }: { enabled: boolean }) {
  // small client boundary that clears cart on mount when enabled
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: enabled
          ? `
            (async function(){
              try {
                await fetch('/api/cart/clear', { method: 'POST' });
              } catch (e) {}
            })();
          `
          : ''
      }}
    />
  );
}

export default async function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { order, products } = await getOrderAndProducts(id);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
        <p className="text-gray-600 mt-1">Order ID: {id}</p>

        {!order ? (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6 text-gray-700">
            We couldn't find this order. Please check your orders list.
          </div>
        ) : (
          <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">Status</div>
              <div className="text-sm font-medium text-gray-900">{order.status}</div>
            </div>

            <div className="mt-4">
              <ItemList items={order.items} products={products} />
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <div className="text-base font-medium text-gray-900">Total</div>
              <div className="text-base font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</div>
            </div>

            <div className="mt-6 flex gap-4">
              <Link href="/account/orders" className="text-blue-600 font-semibold hover:underline">View all orders</Link>
              <Link href="/" className="text-gray-700 hover:underline">Continue shopping</Link>
            </div>
          </div>
        )}
      </main>

      {/* Clear cart after successful payment */}
      {order?.status === 'PAID' ? <ClearCartClient enabled={true} /> : null}
    </div>
  );
}
