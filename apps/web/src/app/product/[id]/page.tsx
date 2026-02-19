"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useCart } from "@/context/CartContext";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

import { BackendProduct } from "@/types/product";
import { useAuth } from "@/context/AuthContext";
import { useAffiliateTracking } from "@/hooks/useAffiliateTracking";
import AffiliateButton from "@/components/affiliate/AffiliateButton";

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:4000/api";

const API_BASE = "/api";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { backendUser, idToken } = useAuth();
  const { addToCart } = useCart();
  const { } = useAffiliateTracking(); // This captures ref param on page load

  const [product, setProduct] = useState<BackendProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [referralCode, setReferralCode] = useState<string | null>(null);

  // Check if user is an influencer
  const isInfluencer = backendUser?.role === "INFLUENCER";

  // Fetch influencer's referral code
  useEffect(() => {
    async function fetchReferralCode() {
      // Debug log for influencer check
      if (backendUser) {
        console.log("👤 User Role:", backendUser.role, "Is Influencer:", isInfluencer);
      }

      if (!isInfluencer) return;

      try {
        const res = await fetch(`${API_BASE}/influencers/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          credentials: "include",
        });
        if (res.ok) {
          const profile = await res.json();
          console.log("✅ Referral Code Fetched:", profile.referralCode);
          setReferralCode(profile.referralCode);
        } else {
          console.warn("⚠️ Failed to fetch influencer profile:", res.status);
        }
      } catch (err) {
        console.error("Error fetching referral code:", err);
      }
    }
    fetchReferralCode();
  }, [isInfluencer, backendUser]);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`${API_BASE}/products/${resolvedParams.id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Product not found</h1>
        <Link href="/" className="text-primary hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f5f8f8] text-[#0c1b1d] font-sans min-h-screen">
      {/* Note: Header is provided by layout.tsx automatically now? No, layout.tsx wraps children. 
           But this page previously imported `Header` and `Footer`. 
           The user's layout.tsx does import Header. 
           So I should NOT import Header here to avoid duplication if layout has it.
           Wait, step 250 verified layout.tsx has Header.
           So I should REMOVE Header import and usage here.
       */}

      <main className="max-w-[1440px] mx-auto px-3 sm:px-4 md:px-6 lg:px-12 py-4 sm:py-6 md:py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 sm:gap-2 mb-4 sm:mb-6 md:mb-8 text-xs sm:text-sm text-[#4597a1] font-medium overflow-x-auto hide-scrollbar">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/category/${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-[#0c1b1d] font-bold line-clamp-1">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12">
          <div className="lg:col-span-7">
            <div className="flex flex-col md:flex-row gap-4 h-full">
              {/* Thumbnails Swiper (Left on desktop, Bottom on mobile) */}
              <div className="order-2 md:order-1 w-full md:w-20 lg:w-24 shrink-0">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  direction="horizontal"
                  breakpoints={{
                    768: {
                      direction: "vertical",
                    }
                  }}
                  spaceBetween={10}
                  slidesPerView={4}
                  watchSlidesProgress={true}
                  modules={[Thumbs]}
                  className="h-full max-h-[100px] md:max-h-[500px]"
                >
                  {Array.from(new Set([product.primaryImage, ...(product.images || [])].filter(Boolean))).map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className={`aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${activeIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-60'}`}>
                        <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Main Swiper */}
              <div className="order-1 md:order-2 flex-1 min-w-0">
                <Swiper
                  spaceBetween={10}
                  navigation={true}
                  pagination={{ clickable: true }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  modules={[Navigation, Pagination, Thumbs, Autoplay]}
                  onSlideChange={(swiper: SwiperType) => setActiveIndex(swiper.activeIndex)}
                  className="rounded-xl bg-white shadow-sm overflow-hidden aspect-4/5"
                >
                  {Array.from(new Set([product.primaryImage, ...(product.images || [])].filter(Boolean))).map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="w-full h-full relative group">
                        <img
                          src={img}
                          alt={product.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>

          {/* Configuration & Checkout (Right 40%) */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-8">
              {/* Product Title */}
              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-display">{product.title}</h1>
                <p className="text-sm sm:text-base md:text-lg text-[#4597a1]">
                  {product.sellerName || product.brand || "Premium Brand"} • {product.categoryDetails?.name || product.category}
                </p>
                <div className="flex items-center gap-2 sm:gap-4 pt-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</span>
                  {product.mrp && product.mrp > product.price && (
                    <span className="text-lg sm:text-xl text-slate-400 line-through">₹{product.mrp.toFixed(2)}</span>
                  )}
                  {/* <span className="px-2 py-1 rounded bg-primary/10 text-primary text-xs font-bold">PREMIUM CHOICE</span> */}
                </div>
                {product.sellerName && (
                  <p className="text-sm text-slate-500">
                    Sold by <span className="font-semibold text-slate-700">{product.sellerName}</span>
                  </p>
                )}
              </div>

              {/* Rapid Delivery Card */}
              <div className="p-4 sm:p-5 bg-white rounded-xl border border-primary/10 shadow-sm space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-green-600 font-bold">
                    <span className="material-symbols-outlined">bolt</span>
                    <span>{product.deliveryEstimate || "Fast Delivery"}</span>
                  </div>
                  {product.deliveryEstimate && <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">Available Now</span>}
                </div>
                {/* Mock Map Visual */}
                <div className="relative h-24 w-full rounded-lg overflow-hidden bg-gray-200">
                  <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkIacT39j7QTwxwX0jZHxvL3pUR1T24eGBXSZmu3jMOi7KMhNAluTiVCcI2vmcB7audVT_kdRqDmubWy3i2R2597t4efe18eyh4jkyGkvyCZJdQart9RD_pGTxwNaW8J0wl22VHwucyxjjMQxXqD418awzED04H87pvkIOUgbTHWVYQgsjZ9XEzkn2UAUAm8E5BB6yokMVQvQxag5J-40XIKSCq2ARDwcftKG5FBUjwtLc6ZhCGcUN06QnU0v-r3qpMsPB2LX9FpkG')] bg-cover bg-center opacity-60"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                    <div className="size-3 bg-primary rounded-full animate-ping absolute"></div>
                    <div className="size-3 bg-primary rounded-full relative"></div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">Free delivery to your current location</p>
              </div>

              {/* Selection - Hidden until variants are implemented
              <div className="space-y-6">
                <div className="space-y-3">
                  <span className="text-sm font-bold uppercase tracking-wider opacity-60">Select Variant</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="px-4 py-3 rounded-lg border-2 border-primary bg-primary/5 font-bold flex flex-col items-start transition-all">
                      <span>Standard</span>
                      <span className="text-xs font-normal opacity-70">Base Model</span>
                    </button>
                    <button className="px-4 py-3 rounded-lg border-2 border-transparent bg-white font-bold flex flex-col items-start hover:border-primary/30 transition-all">
                      <span>Premium</span>
                      <span className="text-xs font-normal opacity-70">Gift Wrapped</span>
                    </button>
                  </div>
                </div>
              </div>
              */}

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={async () => {
                    await addToCart(product._id);
                    router.push("/checkout");
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 sm:py-5 rounded-xl text-base sm:text-lg transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <span>Buy Now • {product.deliveryEstimate || "Fast Delivery"}</span>
                </button>
                <button
                  onClick={() => addToCart(product._id)}
                  className="w-full border-2 border-primary text-primary hover:bg-primary/5 font-bold py-3 sm:py-4 rounded-xl transition-all"
                >
                  Add to Cart
                </button>

                {/* Affiliate Link Button for Influencers */}
                {isInfluencer && referralCode && (
                  <div className="pt-2 border-t border-slate-200 mt-2">
                    <p className="text-xs text-slate-500 mb-2">Generate your affiliate link:</p>
                    <AffiliateButton
                      productId={product._id}
                      referralCode={referralCode}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Description Text */}
              <div className="prose prose-sm text-slate-600">
                <p>{product.description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Specifications - Static Placeholder to match design */}
        <section className="mt-12 sm:mt-16 md:mt-24 pt-8 sm:pt-12 md:pt-24 border-t border-[#e6f3f4]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 md:gap-12">
            <div className="lg:col-span-4 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black font-display">{product.keyFeatures && product.keyFeatures.length > 0 ? "Key Features" : "Why Shop With Us"}</h2>
              <p className="text-[#4597a1] leading-relaxed">
                {product.keyFeatures && product.keyFeatures.length > 0
                  ? "Here's what makes this product special."
                  : "Engineered with precision and premium materials for an experience that exceeds expectations."}
              </p>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {product.keyFeatures && product.keyFeatures.length > 0 ? (
                product.keyFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <span className="material-symbols-outlined">check_circle</span>
                    </div>
                    <div>
                      <h4 className="font-bold">{feature}</h4>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">verified</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Authentic Quality</h4>
                      <p className="text-sm opacity-70">Guaranteed authentic products sourced directly.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">package_2</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Premium Packaging</h4>
                      <p className="text-sm opacity-70">Delivered in secure, eco-friendly packaging.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">currency_exchange</span>
                    </div>
                    <div>
                      <h4 className="font-bold">Easy Returns</h4>
                      <p className="text-sm opacity-70">Hassle-free 30-day return policy.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">support_agent</span>
                    </div>
                    <div>
                      <h4 className="font-bold">24/7 Support</h4>
                      <p className="text-sm opacity-70">Dedicated concierge support for your needs.</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Reviews Section - Static Placeholder */}
        <section className="mt-12 sm:mt-16 md:mt-24 space-y-6 sm:space-y-8 md:space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black font-display">Trusted by Experts</h2>
              <div className="flex items-center gap-4">
                <div className="flex text-primary">
                  <span className="material-symbols-outlined filled-star">star</span>
                  <span className="material-symbols-outlined filled-star">star</span>
                  <span className="material-symbols-outlined filled-star">star</span>
                  <span className="material-symbols-outlined filled-star">star</span>
                  <span className="material-symbols-outlined filled-star">star</span>
                </div>
                <span className="font-bold text-lg">4.9</span>
                <span className="opacity-60">(1.2k Reviews)</span>
              </div>
            </div>
            <button className="text-primary font-bold hover:underline">Write a review</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <div className="p-6 bg-white rounded-xl space-y-4 border border-primary/5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-200"></div>
                <div>
                  <p className="font-bold text-sm">Marcus V.</p>
                  <p className="text-xs opacity-50">Verified Purchase</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed italic">"The delivery actually took 11 minutes. I was shocked. The quality is perfectly balanced."</p>
            </div>
            <div className="p-6 bg-white rounded-xl space-y-4 border border-primary/5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-200"></div>
                <div>
                  <p className="font-bold text-sm">Elena S.</p>
                  <p className="text-xs opacity-50">Verified Purchase</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed italic">"Stunning build quality. They feel much more expensive than they are."</p>
            </div>
            <div className="p-6 bg-white rounded-xl space-y-4 border border-primary/5">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-slate-200"></div>
                <div>
                  <p className="font-bold text-sm">Julian K.</p>
                  <p className="text-xs opacity-50">Verified Purchase</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed italic">"Carbon finish is gorgeous. Perfect for my commute. Battery lasts forever."</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

