import { cookies } from 'next/headers';
import { Suspense } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000/api';
const AUTH_COOKIE_NAME = 'auth_token';

async function getMe() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const res = await fetch(`${API_BASE}/me`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
  if (!res.ok) return null;
  return res.json();
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      className="px-3 py-1.5 rounded border text-sm border-gray-300 text-gray-700 hover:bg-gray-50"
      onClick={async () => {
        try { await navigator.clipboard.writeText(text); } catch {}
      }}
    >
      Copy
    </button>
  );
}

export default async function InfluencerLinksPage() {
  const me = await getMe();
  const code: string = (me?.user?.email || '').toLowerCase();

  const siteBase = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const sampleProductId = 'PRODUCT_ID_HERE';
  const sampleCategorySlug = 'CATEGORY_SLUG_HERE';
  const productLink = `${siteBase}/product/${sampleProductId}?influencerCode=${encodeURIComponent(code)}`;
  const categoryLink = `${siteBase}/category/${sampleCategorySlug}?influencerCode=${encodeURIComponent(code)}`;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Affiliate Links</h1>
          <p className="text-gray-600 mt-1">Use your referral code to promote products and categories.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <div>
            <div className="text-sm text-gray-600">Your referral code</div>
            <div className="mt-1 flex items-center justify-between gap-3">
              <div className="text-base font-semibold text-gray-900 break-all">{code || '—'}</div>
              {code ? <CopyButton text={code} /> : null}
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-gray-600 mb-2">Sample product link (replace PRODUCT_ID_HERE)</div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-700 break-all">{productLink}</div>
              <CopyButton text={productLink} />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="text-sm text-gray-600 mb-2">Sample category link (replace CATEGORY_SLUG_HERE)</div>
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-gray-700 break-all">{categoryLink}</div>
              <CopyButton text={categoryLink} />
            </div>
          </div>

          <div className="pt-4 border-t text-sm text-gray-600">
            Note: Links append <code>?influencerCode=</code> and are tracked at order time.
          </div>
        </div>
      </main>
    </div>
  );
}
