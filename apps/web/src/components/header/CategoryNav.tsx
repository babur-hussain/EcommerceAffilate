"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (res.ok) {
          const data = await res.json();
          // Sort by order field
          const sortedData = data.sort(
            (a: Category, b: Category) => a.order - b.order
          );
          setCategories(sortedData);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-300 mx-auto px-6 py-4">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 shrink-0"
              >
                <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse" />
                <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-gray-50 border-b border-gray-200 overflow-hidden">
      <div className="max-w-300 mx-auto px-6 py-4">
        <div className="flex items-start gap-6 overflow-x-auto overflow-y-hidden scrollbar-hide">
          {categories.map((category) => {
            // Check if icon is a URL or emoji
            const isImageUrl = category.icon && (
              category.icon.startsWith('http://') ||
              category.icon.startsWith('https://') ||
              category.icon.startsWith('/')
            );

            return (
              <Link
                key={category._id}
                href={`/category/${category.slug}`}
                className="flex flex-col items-center gap-2 shrink-0 group"
                aria-label={`Category ${category.name}`}
              >
                <div
                  className="relative w-14 h-14 rounded-full border-2 border-gray-200 group-hover:border-blue-500 flex items-center justify-center transition-all shadow-sm overflow-hidden"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  {isImageUrl ? (
                    <img
                      src={category.icon}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  ) : category.icon ? (
                    <span
                      className="text-2xl leading-none flex items-center justify-center"
                    >
                      {category.icon}
                    </span>
                  ) : (
                    <span className="text-lg font-semibold text-gray-400">
                      {category.name.charAt(0)}
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-700 group-hover:text-blue-600 whitespace-nowrap font-medium transition-colors max-w-[70px] text-center overflow-hidden text-ellipsis">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
