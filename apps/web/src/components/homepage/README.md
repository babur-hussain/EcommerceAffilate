# Homepage Components

All homepage-specific components are organized in this folder for easy management and customization.

## 📁 Components

### 1. **PromoSlider.tsx**

Auto-sliding promotional banner with multiple slides.

**Easy Configuration (Lines 8-43):**

```typescript
const slides: Slide[] = [
  {
    id: 1,
    image: "your-image-url",
    title: "Mattress",
    subtitle: "Wakefit, Sleepwell & more",
    price: "From ₹2,999",
  },
  // Add more slides...
];
```

**Features:**

- Auto-play with 4-second intervals
- Manual navigation (arrows + dots)
- Pause on hover
- Responsive design

---

### 2. **TrendingProductSlider.tsx**

Displays trending products in a carousel format.

**Easy Configuration (Lines 8-15):**

```typescript
const TRENDING_PRODUCT_IDS = [
  "677e2cd52e7e05fddae41d29", // Replace with your actual product IDs
  "677e2cd52e7e05fddae41d2a",
  "677e2cd52e7e05fddae41d2b",
  // Add more product IDs...
];
```

**Features:**

- Fetches products by ID from backend
- Shows 4 products at a time
- Manual navigation arrows
- Progress indicator dots
- Discount badges
- Rating display
- Loading skeleton

---

### 3. **SponsoredBanner.tsx**

Vertical sponsored advertisement banner.

**Easy Configuration (Lines 7-14):**

```typescript
const SPONSORED_BANNER = {
  title: "Premium Smartphones",
  subtitle: "Exclusive Deals",
  discount: "Up to 40% Off",
  image: "your-image-url",
  link: "/category/electronics",
  backgroundColor: "from-purple-600 to-pink-600",
};
```

**Features:**

- Gradient background
- Sponsored badge
- CTA button
- Hover effects
- Decorative elements

---

## 🎯 How to Customize

### Change Promo Slides

Edit `PromoSlider.tsx` → Update the `slides` array (lines 15-43)

### Change Trending Products

Edit `TrendingProductSlider.tsx` → Update `TRENDING_PRODUCT_IDS` array (lines 8-15)

### Change Sponsored Banner

Edit `SponsoredBanner.tsx` → Update `SPONSORED_BANNER` object (lines 7-14)

---

## 📍 Location in Homepage

All components are imported in `apps/web/src/app/page.tsx`:

```typescript
import PromoSlider from "@/components/homepage/PromoSlider";
import TrendingProductSlider from "@/components/homepage/TrendingProductSlider";
import SponsoredBanner from "@/components/homepage/SponsoredBanner";
```

**Layout Structure:**

1. Header + CategoryNav
2. PromoSlider (full width)
3. TrendingProductSlider (75%) + SponsoredBanner (25%)
4. Dynamic sections from backend

---

## 🔧 Quick Tips

- All components use `"use client"` directive for interactivity
- Image URLs can be from Unsplash, Cloudinary, or your CDN
- Product IDs must exist in your backend database
- Responsive breakpoints: mobile (default), md (768px+), lg (1024px+)
