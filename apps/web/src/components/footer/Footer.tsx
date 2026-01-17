'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Main Navigation */}
        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <Link href="#" className="hover:text-white">About Us</Link>
          <Link href="#" className="hover:text-white">Contact</Link>
          <Link href="#" className="hover:text-white">Privacy</Link>
          <Link href="#" className="hover:text-white">Terms</Link>
          <Link href="#" className="hover:text-white">Returns</Link>
          <Link href="#" className="hover:text-white">FAQ</Link>
        </nav>

        {/* Copyright */}
        <div className="border-t border-slate-700 mt-8 pt-6 text-center text-xs">
          <p>© 2026 ShopPlatform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
