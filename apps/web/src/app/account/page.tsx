import Link from 'next/link';

export default function AccountHome() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your Account</h1>
          <p className="text-gray-600 mt-1">Manage orders, wishlist, and cart.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/account/orders" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow">
            <h2 className="text-lg font-semibold text-gray-900">Orders</h2>
            <p className="text-sm text-gray-600 mt-1">View your recent orders.</p>
          </Link>
          <Link href="/account/wishlist" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow">
            <h2 className="text-lg font-semibold text-gray-900">Wishlist</h2>
            <p className="text-sm text-gray-600 mt-1">Products you saved for later.</p>
          </Link>
          <Link href="/cart" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow">
            <h2 className="text-lg font-semibold text-gray-900">Cart</h2>
            <p className="text-sm text-gray-600 mt-1">Items ready for checkout.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
