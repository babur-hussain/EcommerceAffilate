"use client";

import Link from "next/link";
import DealStrip from "./DealStrip";
import type { HomepageSection } from "@/hooks/useHomepageSections";

interface CategorySectionProps {
    section: HomepageSection;
    index: number;
}

export default function CategorySection({ section, index }: CategorySectionProps) {
    if (!section.groups || section.groups.length === 0) return null;

    return (
        <section className="category-section mb-2.5 sm:mb-3">
            <div className="max-w-[1440px] mx-auto">
                <div className="bg-white shadow-sm overflow-hidden">
                    {/* Groups and Subcategories */}
                    {section.groups.map((group) => (
                        <div key={group.groupName}>
                            {/* Section Title Bar */}
                            <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-1">
                                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                                    {group.groupName === section.name
                                        ? section.name
                                        : `${group.groupName}`}
                                </h2>
                                <Link
                                    href={`/category/${section.slug}`}
                                    className="text-primary text-sm font-semibold hover:underline flex items-center gap-0.5 shrink-0"
                                >
                                    View All
                                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                                </Link>
                            </div>

                            {/* Subcategory Deal Strips */}
                            <div>
                                {group.subcategories.map((subcategory) => {
                                    const validProducts = subcategory.products?.filter(
                                        (p) => !!p.image || !!p.primaryImage || (p.images && p.images.length > 0)
                                    ) || [];

                                    if (validProducts.length === 0) return null;

                                    return (
                                        <DealStrip
                                            key={subcategory._id}
                                            title={subcategory.name}
                                            slug={subcategory._id}
                                            products={validProducts}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
