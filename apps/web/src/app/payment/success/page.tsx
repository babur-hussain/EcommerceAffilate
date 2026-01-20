'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function PaymentSuccessInner() {
  const search = useSearchParams();
  const router = useRouter();
  const orderId = search.get('orderId');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/account/orders'); // Redirect to orders page
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">


      <div className="max-w-md w-full text-center space-y-8 animate-fade-in-up">
        <div className="success-checkmark">
          <div className="check-icon">
            <span className="icon-line line-tip"></span>
            <span className="icon-line line-long"></span>
            <div className="icon-circle"></div>
            <div className="icon-fix"></div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. We've received your order and sent a confirmation email.
          </p>
          {orderId && (
            <p className="text-sm text-gray-400 font-mono bg-gray-50 py-2 px-4 rounded-full inline-block">
              Order ID: <span className="text-gray-600 font-bold">#{orderId.slice(-6).toUpperCase()}</span>
            </p>
          )}
        </div>

        <div className="pt-8 border-t border-gray-100">
          <div className="flex flex-col items-center space-y-3">
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2 overflow-hidden">
              <div
                className="bg-green-500 h-1.5 rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              ></div>
            </div>
            <p className="text-gray-500 text-sm">
              Redirecting to your orders in <span className="font-bold text-gray-800">{countdown}s</span>...
            </p>
          </div>

          <div className="mt-8">
            <Link
              href="/account/orders"
              className="text-primary hover:text-green-700 font-medium text-sm hover:underline"
            >
              Click here if you are not redirected
            </Link>
          </div>
        </div>
      </div>
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
