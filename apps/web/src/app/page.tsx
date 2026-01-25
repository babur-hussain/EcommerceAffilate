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
        <section className="relative w-full pt-1 pb-2 px-3 md:px-6">
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

        {/* Featured Collections Grid */}
        <section className="py-8 md:py-16 px-4 md:px-6">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Curated For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Collection 1 */}
              <div className="group relative h-[260px] md:h-[400px] rounded-2xl overflow-hidden cursor-pointer">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  data-alt="Modern smartphone next to headphones on a dark surface"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC4f-Ge1a6h0vsiHY7OHoYNqOOCNmoshZnVjSzvK-fEFm37QMFOE87AXvH0jH0U491PYkZwI_LENzNCMIHVQJiSc_WJdmfCq0gHmDWxdKkfsKwzI0hS8TB4seXzAOnMdLsHw2ryaBmMmVmhneRUELGencLgzemTgJozuzL7Pbr7BCr6R4n1nOw420weu5KHZanh7MdvoFN5ZVjLMcxdLoofGmgkkKWiSJAvqBdAIAGGfkJ0NN7D6faNkiW3CTb_U9T9dPMUVShf-_hT')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Tech Essentials
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Upgrade your daily drivers.
                  </p>
                  <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                    Shop Electronics{" "}
                    <span className="material-symbols-outlined text-[16px]">
                      arrow_forward
                    </span>
                  </span>
                </div>
              </div>
              {/* Collection 2 */}
              <div className="group relative h-[260px] md:h-[400px] rounded-2xl overflow-hidden cursor-pointer lg:col-span-2">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  data-alt="Modern minimalist living room with designer furniture"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMoeOdEw8k4sBNtufBicmOzGNus8BtBV--T0MIaTmHA-v9DorMbnX8YbwpSpZVw77DFehAY2Lgw7Xa9AL5QjmOaxoR_ArJvJlP1vrqKtw6j2LgQKmaCnIezkr45tSsWTmqy8oZjDMqryX4-f0ytFoP8i_1tpdaUwOjY1kIkaT5dRbnBolExM5RqxWitAmVxfWOhyJ0iic8Zedj2W1nzfCqGstLD1T1wb4l-j63RdXd_H1tonD5UrzbYf8_cZFXE5jMNLhd9Camdzf4')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8">
                  <h3 className="text-2xl font-bold text-white mb-2">
                    Minimalist Home
                  </h3>
                  <p className="text-slate-300 mb-4">
                    Furniture designed for modern living.
                  </p>
                  <span className="text-primary font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
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
