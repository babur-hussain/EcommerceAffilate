import { cookies } from 'next/headers';
import CategoryManager from '@/components/admin/CategoryManager';

export const dynamic = 'force-dynamic';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

async function getCategories(token: string) {
    const res = await fetch(`${API_BASE}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
    });
    if (!res.ok) return [];
    return res.json();
}

export default async function AdminCategoriesPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

    if (!token) {
        return <div>Unauthorized. Please log in.</div>;
    }

    const categories = await getCategories(token);

    return (
        <div className="min-h-screen bg-gray-50">
            <main className="max-w-6xl mx-auto px-6 py-10">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                    <p className="text-gray-600 mt-1">Manage categories and their posters/banners.</p>
                </div>

                <CategoryManager initialCategories={categories} token={token} />
            </main>
        </div>
    );
}
