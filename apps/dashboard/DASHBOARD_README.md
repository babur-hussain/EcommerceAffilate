# Dashboard App

Custom built dashboard for ecommerce platform with role-based access control.

## Features

✅ Firebase Authentication (Email/Password + Google)
✅ Role-based routing (Admin, Seller, Influencer, Customer)
✅ Responsive layout with sidebar navigation
✅ Protected routes with automatic redirects
✅ Real-time data updates from backend API

## Pages

### Seller Dashboard (`/seller`)
- Dashboard - Business performance overview
- Brands - Brand management
- Products - Product catalog with filters
- Inventory - Stock level tracking
- Orders - Order management
- Sponsorships - Influencer campaign management
- Analytics - Business metrics and insights
- Influencer Impact - Partnership performance

### Admin Dashboard (`/admin`)
- Dashboard - Platform overview
- Sellers - Manage all sellers
- Brands - Platform brands
- Products - All products
- Influencers - Influencer management
- Sponsorships - Campaign oversight
- Analytics - Platform analytics
- Homepage CMS - Content management
- Audit Logs - System audit trail

### Influencer Dashboard (`/influencer`)
- Dashboard - Performance overview
- My Links - Affiliate links
- Earnings - Revenue tracking
- Performance - Metrics and analytics

## Running Locally

```bash
cd apps/dashboard
npm install
npm run dev
```

Dashboard runs on http://localhost:3001

## Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-auth-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-storage-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Architecture

- **Framework**: Next.js 14 (App Router)
- **Auth**: Firebase Auth
- **UI**: Tailwind CSS
- **Charts**: Recharts
- **HTTP**: Axios with automatic Bearer token injection
- **State**: React Context API

## User Roles

- `ADMIN` - Full platform access
- `SELLER_OWNER` - Full business access
- `SELLER_MANAGER` - Limited business access
- `SELLER_STAFF` - Basic business access
- `INFLUENCER` - Influencer features
- `CUSTOMER` - Not allowed in dashboard
