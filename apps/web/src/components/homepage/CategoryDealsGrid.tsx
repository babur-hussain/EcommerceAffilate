"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

// ⚡ EASY CONFIG: Change category IDs here to display different deals
const DEAL_SECTIONS = [
  {
    title: "Fashion's Top Deals",
    categoryIds: [
      "695ffd2d5f2baf92257f146e", // Replace with your category IDs
      "695ff7de3f61939001a0637c",
      "695ff7de3f61939001a0637d",
      "695ff7de3f61939001a0637e",
    ],
  },
  {
    title: "New year Essentials",
    categoryIds: [
      "695ff7de3f61939001a06380",
      "695ff7de3f61939001a06381",
      "695ff7de3f61939001a06382",
      "695ff7de3f61939001a06383",
    ],
  },
];

interface Category {
  _id: string;
  name: string;
  slug: string;
  image?: string;
  description?: string;
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

export default function CategoryDealsGrid() {
  const [categories, setCategories] = useState<{ [key: string]: Category[] }>(
    {}
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch all categories first
        const response = await fetch(`${API_BASE}/categories`);
        if (!response.ok) {
          console.error("Failed to fetch categories");
          setLoading(false);
          return;
        }

        const allCategories: Category[] = await response.json();
        console.log("Fetched categories:", allCategories);

        // Organize categories by section
        const sectionsData: { [key: string]: Category[] } = {};

        for (const section of DEAL_SECTIONS) {
          // Filter categories that match the IDs in this section
          const matchedCategories = allCategories.filter((cat) =>
            section.categoryIds.includes(cat._id)
          );

          // If we don't have enough matched categories, take first available ones
          if (matchedCategories.length < section.categoryIds.length) {
            const remainingCount =
              section.categoryIds.length - matchedCategories.length;
            const additionalCategories = allCategories
              .filter(
                (cat) => !matchedCategories.some((mc) => mc._id === cat._id)
              )
              .slice(0, remainingCount);
            sectionsData[section.title] = [
              ...matchedCategories,
              ...additionalCategories,
            ];
          } else {
            sectionsData[section.title] = matchedCategories;
          }
        }

        console.log("Sections data:", sectionsData);
        setCategories(sectionsData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((j) => (
                <div key={j}>
                  <div className="bg-gray-200 h-40 rounded-lg mb-2"></div>
                  <div className="bg-gray-200 h-4 rounded mb-1"></div>
                  <div className="bg-gray-200 h-3 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {DEAL_SECTIONS.map((section) => {
        const sectionCategories = categories[section.title] || [];

        // Show section even if no categories, with a message
        const displayCategories =
          sectionCategories.length > 0 ? sectionCategories : [];

        return (
          <div
            key={section.title}
            className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {section.title}
              </h2>
              <Link
                href="/categories"
                className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-colors"
                aria-label="View all"
              >
                <svg
                  className="w-4 h-4"
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
              </Link>
            </div>

            {/* Categories Grid */}
            {displayCategories.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                {displayCategories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug}`}
                    className="group"
                  >
                    {/* Category Image */}
                    <div className="relative aspect-square mb-2 overflow-hidden rounded-lg bg-gray-50 border border-gray-200 group-hover:border-blue-400 transition-colors">
                      {category.image ? (
                        <Image
                          src={category.image}
                          alt={category.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                          <svg
                            className="w-16 h-16 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Category Info */}
                    <div>
                      <h3 className="text-sm md:text-base font-semibold text-gray-800 mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {category.name}
                      </h3>
                      <p className="text-xs md:text-sm font-bold text-green-600">
                        Min. 70% Off
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No categories available</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
