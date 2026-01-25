import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import HomeCategoryList from "@/components/home/HomeCategoryList";
import GlobalSearch from "@/components/search/GlobalSearch";
import ProductRow from "@/components/home/ProductRow";

export default function Home() {
  return (
    <div className="bg-white text-slate-900 font-display antialiased overflow-x-hidden">


      {/* Main Content */}
      <main className="flex flex-col w-full">
        {/* Categories List */}
        <HomeCategoryList />

        {/* Hero Section */}
        <section className="relative w-full pt-1 pb-2 px-2 sm:px-3 md:px-6">
          <div className="max-w-[1440px] mx-auto">
            <HeroSlider />
          </div>
        </section>




        {/* Groceries Section (Live Data) */}
        <ProductRow
          title="Groceries in Minutes"
          subtitle="Rapid Delivery"
          categoryIds={["697095953758a7d8f76fa88c"]}
          className="bg-linear-to-b from-transparent to-surface-light/50"
        />

        {/* Kids Fashion Section (Live Data) */}
        <ProductRow
          title="Kids' Fashion"
          subtitle="New Arrivals"
          categoryIds={["697633598cef606b4e24dda6"]}
        />

        {/* Beautiful Kids Shopping Section - Boys T-Shirts */}
        {/* Kids Categories Section with Multiple Sliders */}
        <section className="relative py-6 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 overflow-hidden bg-linear-to-br from-pink-50 via-purple-50 to-blue-50">
          {/* Playful Background Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-blue-300 rounded-full opacity-20 blur-2xl"></div>

          <div className="max-w-[1440px] mx-auto relative z-10">
            {/* Section Header */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-block mb-3">
                <span className="bg-linear-to-r from-pink-500 to-purple-600 text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide shadow-lg">
                  ✨ KIDS ZONE ✨
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-2 sm:mb-3">
                Cool Styles for{" "}
                <span className="bg-clip-text text-transparent bg-linear-to-r from-pink-500 via-purple-500 to-blue-500">
                  Little Champions
                </span>
              </h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto px-4">
                Comfy, colorful, and super stylish outfits for every occasion
              </p>
            </div>

            {/* Subcategory Sliders */}
            {/* Subcategory Sliders */}
            <div className="bg-white rounded-xl sm:rounded-3xl shadow-sm border border-slate-100 overflow-hidden mt-4 sm:mt-6">
              <ProductRow
                title="Boys T-Shirts"
                categoryIds={["696e6dba9d453a4173def3e0"]}
                viewAllLink="/search?category=696e6dba9d453a4173def3e0"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
              <ProductRow
                title="Boys Shirts"
                categoryIds={["696e6dba9d453a4173def3e3"]}
                viewAllLink="/search?category=696e6dba9d453a4173def3e3"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
              <ProductRow
                title="Boys Jeans"
                categoryIds={["696e6dba9d453a4173def3e6"]}
                viewAllLink="/search?category=696e6dba9d453a4173def3e6"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
              <ProductRow
                title="Boys Shorts"
                categoryIds={["696e6dbb9d453a4173def3e9"]}
                viewAllLink="/search?category=696e6dbb9d453a4173def3e9"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
              <ProductRow
                title="Boys Ethnic Wear"
                categoryIds={["696e6dbb9d453a4173def3ec"]}
                viewAllLink="/search?category=696e6dbb9d453a4173def3ec"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />

              <ProductRow
                title="Girls Dresses"
                categoryIds={["696e6dbb9d453a4173def3ef"]}
                viewAllLink="/search?category=696e6dbb9d453a4173def3ef"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
              <ProductRow
                title="Girls Tops"
                categoryIds={["696e6dbb9d453a4173def3f2"]}
                viewAllLink="/search?category=696e6dbb9d453a4173def3f2"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
              <ProductRow
                title="Girls Jeans"
                categoryIds={["696e6dbb9d453a4173def3f5"]}
                viewAllLink="/search?category=696e6dbb9d453a4173def3f5"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
              <ProductRow
                title="Girls Skirts"
                categoryIds={["696e6dbb9d453a4173def3f8"]}
                viewAllLink="/search?category=696e6dbb9d453a4173def3f8"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
              <ProductRow
                title="Girls Ethnic Wear"
                categoryIds={["696e6dbb9d453a4173def3fb"]}
                viewAllLink="/search?category=696e6dbb9d453a4173def3fb"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />

              <ProductRow
                title="Infant Wear"
                categoryIds={["696e6dbb9d453a4173def3fe"]}
                viewAllLink="/search?category=696e6dbb9d453a4173def3fe"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
              <ProductRow
                title="Kids Innerwear"
                categoryIds={["696e6dbb9d453a4173def401"]}
                viewAllLink="/search?category=696e6dbb9d453a4173def401"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
              <ProductRow
                title="School Uniforms"
                categoryIds={["696e6dbb9d453a4173def404"]}
                viewAllLink="/search?category=696e6dbb9d453a4173def404"
                className="!bg-transparent !py-3 sm:!py-5 !shadow-none border-b border-slate-50 last:border-0"
              />
            </div>

          </div>
        </section>


        {/* Featured Collections Grid */}
        <section className="py-6 sm:py-8 md:py-16 px-3 sm:px-4 md:px-6">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900 mb-4 sm:mb-6 md:mb-8 px-1">
              Curated For You
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {/* Collection 1 */}
              <div className="group relative h-[200px] sm:h-[240px] md:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  data-alt="Modern smartphone next to headphones on a dark surface"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4f-Ge1a6h0vsiHY7OHoYNqOOCNmoshZnVjSzvK-fEFm37QMFOE87AXvH0jH0U491PYkZwI_LENzNCMIHVQJiSc_WJdmfCq0gHmDWxdKkfsKwzI0hS8TB4seXzAOnMdLsHw2ryaBmMmVmhneRUELGencLgzemTgJozuzL7Pbr7BCr6R4n1nOw420weu5KHZanh7MdvoFN5ZVjLMcxdLoofGmgkkKWiSJAvqBdAIAGGfkJ0NN7D6faNkiW3CTb_U9T9dPMUVShf-_hT')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                    Tech Essentials
                  </h3>
                  <p className="text-slate-300 mb-2 sm:mb-4 text-sm sm:text-base">
                    Upgrade your daily drivers.
                  </p>
                  <span className="text-primary font-bold text-xs sm:text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Shop Electronics{" "}
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>
              {/* Collection 2 */}
              <div className="group relative h-[200px] sm:h-[240px] md:h-[400px] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer sm:col-span-1 lg:col-span-2">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  data-alt="Modern minimalist living room with designer furniture"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMoeOdEw8k4sBNtufBicmOzGNus8BtBV--T0MIaTmHA-v9DorMbnX8YbwpSpZVw77DFehAY2Lgw7Xa9AL5QjmOaxoR_ArJvJlP1vrqKtw6j2LgQKmaCnIezkr45tSsWTmqy8oZjDMqryX4-f0ytFoP8i_1tpdaUwOjY1kIkaT5dRbnBolExM5RqxWitAmVxfWOhyJ0iic8Zedj2W1nzfCqGstLD1T1wb4l-j63RdXd_H1tonD5UrzbYf8_cZFXE5jMNLhd9Camdzf4')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 md:p-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2">
                    Minimalist Home
                  </h3>
                  <p className="text-slate-300 mb-2 sm:mb-4 text-sm sm:text-base">
                    Furniture designed for modern living.
                  </p>
                  <span className="text-primary font-bold text-xs sm:text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Discover Home{" "}
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
