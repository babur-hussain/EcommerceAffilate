'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';


function PaymentSuccessInner() {
  const search = useSearchParams();
  const orderId = search.get('orderId');
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Payment Status</h1>
        <p className="text-gray-600 mt-1">Order ID: {orderId}</p>
        <div className="mt-6 text-green-700">Payment successful! Your order is now PAID.</div>
        <div className="mt-8 space-x-6">
          <Link href="/account/orders" className="text-blue-600 font-semibold hover:underline">
            Go to your orders
          </Link>
          {orderId ? (
            <Link href={`/order/confirmation/${orderId}`} className="text-blue-600 font-semibold hover:underline">
              View order confirmation
            </Link>
          ) : null}
        </div>
      </main>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessInner />
    </Suspense>
  );
}
