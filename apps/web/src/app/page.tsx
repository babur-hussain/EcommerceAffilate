import Header from "@/components/header/Header";
import CategoryNav from "@/components/header/CategoryNav";
import MainBanner from "@/components/banner/MainBanner";
import PromoSlider from "@/components/homepage/PromoSlider";
import TrendingProductSlider from "@/components/homepage/TrendingProductSlider";
import SponsoredBanner from "@/components/homepage/SponsoredBanner";
import CategoryDealsGrid from "@/components/homepage/CategoryDealsGrid";
import FashionBanner from "@/components/homepage/FashionBanner";
import ProductRow from "@/components/product/ProductRow";
import Footer from "@/components/footer/Footer";

export const dynamic = "force-dynamic";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

// Backend API Product type
interface BackendProduct {
  _id: string;
  title: string;
  slug: string;
  price: number;
  category: string;
  brand?: string;
  image: string;
  images: string[];
  rating: number;
  ratingCount: number;
  isActive: boolean;
  isSponsored: boolean;
  sponsoredScore: number;
  popularityScore: number;
  createdAt: string;
  updatedAt: string;
}

// Homepage payload types
type SectionType =
  | "HERO_BANNER"
  | "PRODUCT_CAROUSEL"
  | "CATEGORY_GRID"
  | "SPONSORED_CAROUSEL"
  | "TEXT_BANNER";
interface HomepageSectionBase {
  type: SectionType;
  title?: string;
  subtitle?: string;
}
interface ProductSection extends HomepageSectionBase {
  items?: BackendProduct[];
}
interface TextSection extends HomepageSectionBase {
  config?: Record<string, any>;
}
interface HomepagePayload {
  version: number;
  sections: (ProductSection | TextSection)[];
}

// Fetch homepage sections from backend (public)
async function getHomepage(): Promise<HomepagePayload> {
  try {
    const res = await fetch(`${API_BASE}/homepage`, { cache: "no-store" });
    if (res.ok) {
      const payload: HomepagePayload = await res.json();
      if (payload.sections?.length) {
        return payload;
      }
    }

    // Fallback: synthesize a single carousel from ranked products
    const ranked = await fetch(`${API_BASE}/ranking/homepage`, {
      cache: "no-store",
    });
    if (ranked.ok) {
      const items: BackendProduct[] = await ranked.json();
      if (items.length) {
        return {
          version: 0,
          sections: [
            { type: "PRODUCT_CAROUSEL", title: "Recommended for You", items },
          ],
        };
      }
    }

    // Final fallback: plain products
    const products = await fetch(`${API_BASE}/products`, { cache: "no-store" });
    if (products.ok) {
      const items: BackendProduct[] = await products.json();
      if (items.length) {
        return {
          version: 0,
          sections: [{ type: "PRODUCT_CAROUSEL", title: "Products", items }],
        };
      }
    }

    return { version: 0, sections: [] };
  } catch (error) {
    console.error("Error fetching homepage:", error);
    return { version: 0, sections: [] };
  }
}

export default async function Home() {
  const data = await getHomepage();
  const sections = data.sections ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Category Navigation */}
      <CategoryNav />

      {/* Promo Slider */}
      <div className="max-w-300 mx-auto px-6 pt-6">
        <PromoSlider />
      </div>

      {/* Trending Products + Sponsored Banner Section */}
      <div className="max-w-300 mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Left: Trending Products (75% width) */}
          <div className="lg:w-3/4">
            <TrendingProductSlider />
          </div>

          {/* Right: Sponsored Banner (25% width) */}
          <div className="lg:w-1/4 min-h-[400px]">
            <SponsoredBanner />
          </div>
        </div>
      </div>

      {/* Category Deals + Fashion Banner Section */}
      <div className="max-w-300 mx-auto px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Category Deals Grid (70% width) */}
          <div className="lg:w-[70%]">
            <CategoryDealsGrid />
          </div>

          {/* Right: Fashion Banner (30% width) */}
          <div className="lg:w-[30%]">
            <FashionBanner />
          </div>
        </div>
      </div>

      {/* Render Sections */}
      <main className="max-w-300 mx-auto px-6 py-8">
        {sections.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nothing to show yet</p>
            <p className="text-gray-500 text-sm mt-2">
              Please check back later
            </p>
          </div>
        ) : (
          sections.map((s, idx) => {
            switch (s.type) {
              case "HERO_BANNER":
                return (
                  <div key={`sec-${idx}`} className="mb-8">
                    <MainBanner />
                  </div>
                );
              case "TEXT_BANNER":
                return (
                  <div
                    key={`sec-${idx}`}
                    className="mb-8 bg-white rounded-lg shadow p-6"
                  >
                    {s.title && (
                      <h2 className="text-xl font-semibold mb-1">{s.title}</h2>
                    )}
                    {"subtitle" in s && s.subtitle && (
                      <p className="text-gray-600">{s.subtitle}</p>
                    )}
                  </div>
                );
              case "PRODUCT_CAROUSEL":
              case "SPONSORED_CAROUSEL":
              case "CATEGORY_GRID": {
                const items = (s as ProductSection).items ?? [];
                return (
                  <div key={`sec-${idx}`} className="mb-8">
                    <ProductRow
                      title={s.title ?? "Products"}
                      products={items}
                    />
                  </div>
                );
              }
              default:
                return null;
            }
          })
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
