import Link from "next/link";
import HeroSlider from "@/components/home/HeroSlider";
import HomeCategoryList from "@/components/home/HomeCategoryList";
import GlobalSearch from "@/components/search/GlobalSearch";

export default function Home() {
  return (
    <div className="bg-white text-slate-900 font-display antialiased overflow-x-hidden">


      {/* Main Content */}
      <main className="flex flex-col w-full">
        {/* Categories List */}
        <HomeCategoryList />

        {/* Hero Section */}
        <section className="relative w-full pt-1 pb-2 px-6">
          <div className="max-w-[1440px] mx-auto">
            <HeroSlider />
          </div>
        </section>




        {/* Groceries Section */}
        <section className="py-16 px-6 bg-linear-to-b from-transparent to-surface-light/50">
          <div className="max-w-[1440px] mx-auto">
            {/* Section Header */}
            <div className="flex items-end justify-between mb-10 px-2">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-widest uppercase">
                  <span className="material-symbols-outlined text-lg">
                    bolt
                  </span>
                  <span>Rapid Delivery</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                  Groceries in Minutes
                </h2>
              </div>
              <Link
                href="#"
                className="hidden md:flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
              >
                View all
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
              </Link>
            </div>
            {/* Product Scroll Container */}
            <div className="relative group/slider">
              {/* Scroll Controls (Visual Only) */}
              <button className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-20 size-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-900 opacity-0 group-hover/slider:opacity-100 transition-opacity disabled:opacity-50">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-20 size-12 rounded-full bg-white shadow-lg border border-slate-100 flex items-center justify-center text-slate-900 opacity-0 group-hover/slider:opacity-100 transition-opacity">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              {/* Cards Track */}
              <div className="flex gap-6 overflow-x-auto pb-12 hide-scrollbar snap-x snap-mandatory px-2">
                {/* Product Card 1 */}
                <div className="min-w-[280px] md:min-w-[320px] snap-center">
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-soft transition-all duration-300 group h-full flex flex-col">
                    <div className="relative aspect-4/3 bg-surface-light rounded-xl mb-4 overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        ORGANIC
                      </div>
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        data-alt="Fresh organic avocados on a light surface"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAINoYsNiRcHZlS6FrsAh1uQrX9mbb-FVksbSeFfPjOBw-6v2qK8UjAKptSf9hi5P7bR-V7ENw13OnHyc3WZRZ77XJ-7jdjkemhQgLIY5P2wOAAIu__RHCePq_ByoNPhgE-2xPT0gsI4-Q6Wp4nQddb6DJdnqyclPN-TmQB10wkaTDoho9AyzZ9mNh8xHy-kFe5yhrTmAPW79aOtVl8tiTXhV-FxCPsaySRV4xLYN3ZX9-bMfiTaFk1t6X-KPCwOpkS5FwUAhCG3E4i')",
                        }}
                      />
                      <button className="absolute bottom-3 right-3 size-10 bg-white rounded-full flex items-center justify-center shadow-md text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[20px] fill-0 hover:fill-1">
                          favorite
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">
                        Hass Avocados
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        Pack of 2 • 500g
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-bold text-slate-900">
                          ₹4.50
                        </span>
                        <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-sky-500 active:scale-95 transition-all flex items-center gap-2">
                          Add
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Product Card 2 */}
                <div className="min-w-[280px] md:min-w-[320px] snap-center">
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-soft transition-all duration-300 group h-full flex flex-col">
                    <div className="relative aspect-4/3 bg-surface-light rounded-xl mb-4 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        data-alt="Carton of fresh almond milk"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDLF1e6PQ6kY7LElgSZOpw5ba2TIOMydMFBIdMwqxvKjWEvaS15mGfkPhPhsExrrO8RKBYkZKXfQAZPYREj-K9E3iDwF3DKBTJp3L1zOFt4NBfDWFmYNvdF4fPR3_W4ljT9hTJuIB5I0cpZYiXCNaGh0LM7_uRcSCFrTCu9DJyp0K4k7dQz7YOStQnOgjV3TihrjMv2HHwzItPqpDOTG6NDO48pIBYZ3gTYmG7C7b1SmYEl0MprHZA-F-b3wWcoAN9L7K_o1ec13z76')",
                        }}
                      />
                      <button className="absolute bottom-3 right-3 size-10 bg-white rounded-full flex items-center justify-center shadow-md text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[20px] fill-0 hover:fill-1">
                          favorite
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">
                        Almond Milk
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        Unsweetened • 1L
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-bold text-slate-900">
                          ₹3.20
                        </span>
                        <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-sky-500 active:scale-95 transition-all flex items-center gap-2">
                          Add
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Product Card 3 */}
                <div className="min-w-[280px] md:min-w-[320px] snap-center">
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-soft transition-all duration-300 group h-full flex flex-col">
                    <div className="relative aspect-4/3 bg-surface-light rounded-xl mb-4 overflow-hidden">
                      <div className="absolute top-3 left-3 z-10 bg-yellow-400 text-slate-900 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                        BESTSELLER
                      </div>
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        data-alt="Fresh sourdough bread on a wooden board"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCXEqRUdaHVHuNz_RRLWwjjgJEbiUWKF7UIRA5W-sE0LDJ8xevro_YtApRrZ9BxGDuSak0HkD-tt2oPZj36PK-XZ92nsCfnGNIQR79dh5r-f2flMwptAA8cCN8-eATm_Lkgvx2QTB0aDCtFwC5jkLX2y3x6Z6RtOrDWBat74wpzvX0jUEiLM0dOOFQiA3uF2MkbtVVmwKNKO8KRa1RNPN4oGgmIAjgmuSZu50whS5vW51DcdtR0U43XR26BTVMoMC8EBEMAYru_-eTU')",
                        }}
                      />
                      <button className="absolute bottom-3 right-3 size-10 bg-white rounded-full flex items-center justify-center shadow-md text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[20px] fill-0 hover:fill-1">
                          favorite
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">
                        Artisan Sourdough
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        Freshly Baked • 750g
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-bold text-slate-900">
                          ₹6.00
                        </span>
                        <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-sky-500 active:scale-95 transition-all flex items-center gap-2">
                          Add
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Product Card 4 */}
                <div className="min-w-[280px] md:min-w-[320px] snap-center">
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-soft transition-all duration-300 group h-full flex flex-col">
                    <div className="relative aspect-4/3 bg-surface-light rounded-xl mb-4 overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        data-alt="Carton of fresh organic eggs"
                        style={{
                          backgroundImage:
                            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCwJBLq7Ui6xKsIGUWAbTguE4uUv0jJL_tiIrFoWAymcLJGH3xcgGw--ss8plfEhkOIfgQIHIYQS3QmDvvGKWsA14G69gwsF0Yc3IaurwzGF8-Cl7E-rOGJzePF9NmqMajGeyNs7ftzyF9IY-K_kLMbAZvPbUCe543IdiUx3k-xrpL67X-GaEMwkvfDI0iO5BOTC8iQ7GVCw8dgEu19tV1qzbbeBUf57i4Hi6TZz-qh_zyxmN4wOMuUYhn0z1XUa7Ik5yhGPSqMppPW')",
                        }}
                      />
                      <button className="absolute bottom-3 right-3 size-10 bg-white rounded-full flex items-center justify-center shadow-md text-slate-400 hover:text-red-500 transition-colors">
                        <span className="material-symbols-outlined text-[20px] fill-0 hover:fill-1">
                          favorite
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-col flex-1">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">
                        Free Range Eggs
                      </h3>
                      <p className="text-sm text-slate-500 mb-4">
                        Large • 12 Pack
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xl font-bold text-slate-900">
                          ₹5.00
                        </span>
                        <button className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg hover:bg-sky-500 active:scale-95 transition-all flex items-center gap-2">
                          Add
                          <span className="material-symbols-outlined text-[16px]">
                            add
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Collections Grid */}
        <section className="py-16 px-6">
          <div className="max-w-[1440px] mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">
              Curated For You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Collection 1 */}
              <div className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer">
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
              <div className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer lg:col-span-2">
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
