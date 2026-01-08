# Dashboard Application

This is the unified, role-based dashboard for the ShopPlatform ecommerce marketplace.

## Features

### Admin Dashboard
- Platform-wide analytics with revenue charts
- Seller management (activate/suspend)
- Brand and product oversight
- Influencer moderation
- Sponsorship approval
- **Homepage CMS** with drag-and-drop section reordering
- Audit log viewer

### Seller Dashboard
- Business analytics and performance metrics
- Full brand management
- Complete product/inventory control
- Order management
- Sponsorship campaign creation
- Influencer impact tracking

### Influencer Dashboard
- Affiliate link generation
- Earnings and commission tracking
- Performance analytics
- Payout history

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Auth**: Firebase Authentication
- **State Management**: React Context
- **HTTP Client**: Axios
- **Drag & Drop**: react-beautiful-dnd
- **Notifications**: react-hot-toast

## Setup

1. Install dependencies:
```bash
cd apps/dashboard
npm install
```

2. Create `.env.local` file (copy from `.env.local.example`):
```bash
cp .env.local.example .env.local
```

3. Configure Firebase credentials in `.env.local`

4. Start the development server:
```bash
npm run dev
```

The dashboard will be available at `http://localhost:3001`

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin dashboard routes
│   ├── seller/            # Seller dashboard routes
│   ├── influencer/        # Influencer dashboard routes
│   ├── login/             # Login page
│   └── unauthorized/      # 403 page
├── components/            # Reusable components
│   ├── DashboardLayout.tsx
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   └── ProtectedRoute.tsx
├── context/               # React context providers
│   └── AuthContext.tsx
├── lib/                   # Utilities
│   ├── firebase.ts
│   └── api.ts
└── types/                 # TypeScript types
    └── index.ts
```

## Role-Based Access

The dashboard implements strict role-based access control:

- **ADMIN**: Full platform control
- **SELLER_OWNER**: Full seller dashboard access
- **SELLER_MANAGER**: Seller dashboard (limited delete/payout)
- **SELLER_STAFF**: Seller dashboard (view + basic edits)
- **INFLUENCER**: Influencer dashboard only
- **CUSTOMER**: No dashboard access

Routes are protected using the `ProtectedRoute` component.

## API Integration

All API calls go through the `apiClient` in `lib/api.ts`, which:
- Automatically adds Firebase ID tokens
- Handles authentication errors
- Provides typed responses

## Key Features

### Homepage CMS
Admins can:
- Add/remove homepage sections
- Reorder sections via drag & drop
- Enable/disable sections
- Configure section parameters
- Publish changes instantly

### Analytics
- Real-time revenue tracking
- Sponsored vs organic breakdown
- Product performance metrics
- Time-series charts

### Inventory Management
Sellers can:
- Add/edit products
- Manage stock levels
- Set pricing and discounts
- Activate/deactivate listings
- Track low-stock alerts

## Development

### Adding New Pages

1. Create page in appropriate role directory:
```typescript
// apps/dashboard/src/app/admin/new-page/page.tsx
export default function NewAdminPage() {
  // Implementation
}
```

2. Add route to sidebar navigation in `components/Sidebar.tsx`

3. Ensure proper role-based protection

### Adding API Endpoints

Update `lib/api.ts` or create service-specific clients as needed.

## Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## License

Private - ShopPlatform Business
