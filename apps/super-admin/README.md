# 🛡️ Super Admin Panel - EcommerceEarn

## Overview

This is the **Super Admin Panel** for the EcommerceEarn platform. It provides comprehensive management capabilities for administrators to oversee the entire platform, including sellers, influencers, users, analytics, and system settings.

## 🚀 Features

### ✅ Implemented

- **Dashboard** - Platform-wide metrics and system status
- **Seller Management** - View, approve, and manage all seller accounts
- **Influencer Management** - Monitor and control influencer accounts
- **Live Data** - Real-time updates every 60 seconds
- **Authentication** - Firebase-based admin authentication with email whitelist
- **Status Management** - Approve, suspend, or activate accounts
- **Search & Filters** - Quick access to specific users
- **Responsive UI** - Modern, clean interface matching existing dashboards

### 🔜 Coming Soon

- All Users Management
- Advanced Analytics
- Reports & Exports
- Audit Logs
- System Settings
- Bulk Actions

## 🏗️ Architecture

```
super-admin/
├── src/
│   ├── app/
│   │   ├── login/          # Admin login page
│   │   ├── admin/          # Protected admin routes
│   │   │   ├── page.tsx           # Main dashboard
│   │   │   ├── sellers/           # Seller management
│   │   │   ├── influencers/       # Influencer management
│   │   │   ├── users/             # All users (coming soon)
│   │   │   ├── analytics/         # Analytics (coming soon)
│   │   │   ├── reports/           # Reports (coming soon)
│   │   │   └── settings/          # Settings (coming soon)
│   ├── components/        # Reusable components
│   ├── context/          # Auth context
│   ├── lib/              # Utilities and API client
│   └── types/            # TypeScript types
```

## 🔐 Access Control

Only users with emails in the whitelist can access the super admin panel.

**Update Whitelist in `.env.local`:**

```env
NEXT_PUBLIC_SUPER_ADMIN_EMAILS=admin@ecommerceearn.com,superadmin@ecommerceearn.com
```

## 📦 Installation

```bash
# Navigate to super-admin directory
cd apps/super-admin

# Install dependencies
npm install

# Start development server
npm run dev
```

The super admin panel will be available at **http://localhost:3003**

## 🔧 Configuration

### Environment Variables

Create `.env.local` with:

```env
# Firebase (Same as other dashboards)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000

# Super Admin Whitelist (comma-separated)
NEXT_PUBLIC_SUPER_ADMIN_EMAILS=admin@ecommerceearn.com,superadmin@ecommerceearn.com
```

## 🎨 UI Design

The super admin panel follows the same design system as:

- Influencer Dashboard
- Seller Dashboard

**Features:**

- Clean, modern interface
- Tailwind CSS styling
- Lucide React icons
- Responsive design
- Live data indicators
- Toast notifications

## 📊 Data Sources

All data is fetched from live backend APIs:

| Endpoint                       | Description             |
| ------------------------------ | ----------------------- |
| `/api/super-admin/metrics`     | Platform-wide metrics   |
| `/api/super-admin/sellers`     | All seller accounts     |
| `/api/super-admin/influencers` | All influencer accounts |
| `/api/super-admin/users`       | All users               |
| `/api/super-admin/analytics`   | Advanced analytics      |
| `/api/super-admin/reports`     | System reports          |

## 🔄 Auto-Refresh

All pages automatically refresh every 60 seconds to ensure data is current.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Auth
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Notifications:** React Hot Toast

## 🚦 Status Indicators

- 🟢 **LIVE** - Real-time data active
- ✅ **Active** - Account is active
- ❌ **Inactive** - Account is suspended
- ⏳ **Pending** - Awaiting approval

## 📱 Pages

### Dashboard (`/admin`)

- Platform overview
- User statistics
- Business metrics
- System status
- Pending actions

### Sellers (`/admin/sellers`)

- All seller accounts
- Business information
- Revenue stats
- Approve/suspend actions
- Search and filters

### Influencers (`/admin/influencers`)

- All influencer accounts
- Referral codes
- Performance metrics
- Earnings overview
- Social media links
- Status management

## 🔒 Security

1. **Email Whitelist** - Only approved emails can access
2. **Firebase Authentication** - Secure login system
3. **Token-based API** - Protected backend endpoints
4. **Role Validation** - Super admin role required

## 🐛 Troubleshooting

### Can't Login

- Ensure your email is in `NEXT_PUBLIC_SUPER_ADMIN_EMAILS`
- Check Firebase credentials
- Verify backend is running

### No Data Showing

- Check backend API is running on port 4000
- Verify `.env.local` has correct `NEXT_PUBLIC_API_URL`
- Check browser console for errors

### Port Already in Use

```bash
# Kill process on port 3003 (Windows PowerShell)
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3003).OwningProcess -Force

# Or use a different port
npm run dev -- -p 3004
```

## 📝 Development

### Adding New Pages

1. Create page in `src/app/admin/[page-name]/page.tsx`
2. Add route to navigation in `src/app/admin/layout.tsx`
3. Add backend API endpoint
4. Update types in `src/types/index.ts`

### Backend API Required

Super admin endpoints need to be implemented in:

```
apps/backend/src/routes/super-admin.route.ts
```

## 🎯 Roadmap

- [ ] Users page (all user types)
- [ ] Advanced analytics with charts
- [ ] Report generation and export
- [ ] Audit logs tracking
- [ ] System settings management
- [ ] Bulk actions
- [ ] Email notifications
- [ ] Activity timeline
- [ ] Role-based permissions
- [ ] Two-factor authentication

## 📄 License

Copyright © 2026 EcommerceEarn. All rights reserved.

---

**Port:** 3003  
**Access:** Restricted to super administrators only
