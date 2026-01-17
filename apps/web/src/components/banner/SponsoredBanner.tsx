"use client";

import Image from "next/image";
import Link from "next/link";

// ⚡ EASY CONFIG: Change banner details here
const SPONSORED_BANNER = {
  title: "Premium Smartphones",
  subtitle: "Exclusive Deals",
  discount: "Up to 40% Off",
  image:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=600&fit=crop",
  link: "/category/electronics",
  backgroundColor: "from-purple-600 to-pink-600",
};

export default function SponsoredBanner() {
  return (
    <Link
      href={SPONSORED_BANNER.link}
      className="block h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow group"
    >
      <div className="relative h-full flex flex-col">
        {/* Sponsored Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-white/90 text-xs font-semibold px-2 py-1 rounded-full text-gray-700">
            Sponsored
          </span>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 flex-1 flex flex-col justify-between text-white relative z-10">
          {/* Top Section */}
          <div>
            <h3 className="text-xl md:text-2xl font-bold mb-1">
              {SPONSORED_BANNER.title}
            </h3>
            <p className="text-sm md:text-base opacity-90 mb-3">
              {SPONSORED_BANNER.subtitle}
            </p>
            <div className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <span className="text-lg md:text-xl font-bold">
                {SPONSORED_BANNER.discount}
              </span>
            </div>
          </div>

          {/* Bottom Section */}
          <div>
            <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors group-hover:scale-105 transform duration-200">
              Shop Now →
            </button>
          </div>
        </div>

        {/* Background Image */}
        <div className="absolute inset-0 opacity-20">
          <Image
            src={SPONSORED_BANNER.image}
            alt={SPONSORED_BANNER.title}
            fill
            className="object-cover mix-blend-overlay"
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
      </div>
    </Link>
  );
}
