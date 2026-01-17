import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BrandDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Brand Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your products and view sponsorships.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/brand/products" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow">
            <h2 className="text-lg font-semibold text-gray-900">Products</h2>
            <p className="text-sm text-gray-600 mt-1">View and manage your product catalog.</p>
          </Link>
          <Link href="/brand/sponsorships" className="block bg-white border border-gray-200 rounded-lg p-6 hover:shadow">
            <h2 className="text-lg font-semibold text-gray-900">Sponsorships</h2>
            <p className="text-sm text-gray-600 mt-1">Track budgets and status of sponsorships.</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
