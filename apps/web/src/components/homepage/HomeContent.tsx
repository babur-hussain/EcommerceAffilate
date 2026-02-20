"use client";

import HeroSlider from "@/components/home/HeroSlider";
import MobileHeroSlider from "@/components/home/MobileHeroSlider";
import HomeCategoryList from "@/components/home/HomeCategoryList";
import CategorySection from "@/components/homepage/CategorySection";
import LazySection from "@/components/common/LazySection";
import type { HomepageSection } from "@/hooks/useHomepageSections";

interface HomeContentProps {
    sections: HomepageSection[];
}

/** Number of sections to render immediately (above fold) */
const EAGER_SECTIONS = 2;

export default function HomeContent({ sections }: HomeContentProps) {
    return (
        <div className="bg-white text-slate-900 font-display antialiased overflow-x-hidden min-h-screen">
            {/* Categories Bar */}
            <HomeCategoryList />

            {/* Hero Section */}
            <section className="relative w-full pt-1 pb-2 px-2 sm:px-3 md:px-6 bg-white">
                <div className="max-w-[1440px] mx-auto">
                    {/* Desktop Slider */}
                    <div className="hidden md:block">
                        <HeroSlider />
                    </div>
                    {/* Mobile Slider */}
                    <div className="block md:hidden">
                        <MobileHeroSlider />
                    </div>
                </div>
            </section>

            {/* Dynamic Product Sections — lazy loaded per viewport */}
            <main className="flex flex-col w-full bg-white pt-2.5">
                {sections.map((section, index) => (
                    <LazySection
                        key={section._id}
                        priority={index < EAGER_SECTIONS}
                        height={360}
                    >
                        <CategorySection
                            section={section}
                            index={index}
                        />
                    </LazySection>
                ))}

                {/* Empty State */}
                {sections.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-white">
                        <span className="material-symbols-outlined text-6xl mb-4">inventory_2</span>
                        <p className="text-lg font-medium">No products available yet</p>
                        <p className="text-sm mt-1">Check back soon for amazing deals!</p>
                    </div>
                )}
            </main>
        </div>
    );
}
