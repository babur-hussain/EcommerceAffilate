"use client";

import Image from "next/image";
import Link from "next/link";

// ⚡ EASY CONFIG: Change fashion banner details here
const FASHION_BANNER = {
  title: "Shop your fashion Needs",
  subtitle: "with Latest & Trendy Choices",
  buttonText: "Shop Now",
  image:
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop",
  link: "/category/fashion",
  bgGradient: "from-orange-100 via-amber-50 to-yellow-50",
};

export default function FashionBanner() {
  return (
    <Link
      href={FASHION_BANNER.link}
      className="block h-[calc(100%)] max-h-[545px] bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-50 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
    >
      <div className="relative h-full flex flex-col">
        {/* Content Section */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-center relative z-10">
          <div className="max-w-xs">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 leading-tight">
              {FASHION_BANNER.title}
            </h2>
            <p className="text-base md:text-lg text-gray-600 mb-6">
              {FASHION_BANNER.subtitle}
            </p>
            <button className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold transition-all group-hover:scale-105 transform duration-200 shadow-md">
              {FASHION_BANNER.buttonText}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Image Section */}
        <div className="relative h-[300px] lg:h-[400px]">
          <Image
            src={FASHION_BANNER.image}
            alt={FASHION_BANNER.title}
            fill
            className="object-cover object-top"
            priority
          />
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-orange-300/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-2xl"></div>
      </div>
    </Link>
  );
}
