# Influencer Dashboard - Quick Start Guide

## 🚀 Get Started in 5 Minutes!

### Step 1: Start the Backend (if not running)

```bash
cd apps/backend
npm run dev
```

Wait for: `MongoDB connected` and `Server started on port 4000`

### Step 2: Start the Influencer Dashboard

```bash
cd apps/influencer-dashboard
npm run dev
```

Wait for: `Ready in X.Xs` and `Local: http://localhost:3002`

### Step 3: Access the Dashboard

Open your browser and go to: **http://localhost:3002**

### Step 4: Sign Up / Login

#### Option A: Email & Password

1. Click "Sign Up" tab
2. Enter your name, email, and password
3. Click "Sign Up"

#### Option B: Google Sign-In

1. Click "Sign in with Google" button
2. Choose your Google account
3. Authorize access

### Step 5: Explore the Dashboard

Once logged in, you'll be redirected to your dashboard at `/dashboard`.

#### What You'll See:

- **Your Referral Code**: Displayed in the sidebar (e.g., JOHN1A2B)
- **Performance Metrics**: Clicks, conversions, earnings
- **Navigation Menu**: 6 main sections on the left

### Step 6: Generate Your First Affiliate Link

1. Click **"Affiliate Links"** in the sidebar
2. Click **"Generate New Link"** button
3. Use the search to find a product (or select from list)
4. The link will be automatically created
5. Click **"Copy"** to copy the link
6. Share it on your social media!

Your affiliate link will look like:

```
http://localhost:3000/products/[PRODUCT_ID]?ref=[YOUR_CODE]
```

### Step 7: Track Your Performance

#### View Real-Time Stats

- Go to **Dashboard** to see overview
- Switch between Today / This Week / This Month

#### See Detailed Attribution

- Go to **Performance** page
- Filter by: All / Clicks / Conversions / Paid
- Export data as CSV

#### Check Earnings

- Go to **Earnings** page
- See: Total, Pending, Paid earnings
- Request payout when you have ₹500+

### Step 8: Update Your Profile

1. Click **Profile** in sidebar
2. Add your information:
   - Personal details
   - Social media links (Instagram, YouTube, etc.)
   - Follower counts
   - Bio/description
3. Click **"Save Changes"**

## 📊 Understanding Your Metrics

### Clicks

Number of times someone clicked your affiliate link

### Conversions

Number of clicks that resulted in a purchase

### Conversion Rate

Percentage of clicks that convert to sales

```
Conversion Rate = (Conversions ÷ Clicks) × 100
```

### Earnings

- **Total**: All-time commission earned
- **Pending**: Approved, waiting for payout
- **Paid**: Money you've already received

## 💰 How to Get Paid

### Requirements

- Minimum ₹500 in pending earnings
- Complete profile with payment details

### Steps

1. Go to **Earnings** page
2. Click **"Request Payout"**
3. Choose payment method:
   - **UPI**: Enter UPI ID (e.g., yourname@paytm)
   - **Bank Transfer**: Enter account details
   - **PayPal**: Enter PayPal email
4. Enter amount (₹500 - your pending balance)
5. Submit request
6. Wait for admin approval (1-3 business days)

## 🎯 Tips for Success

### 1. Generate Multiple Links

Create links for different products in your niche

### 2. Track What Works

Use the Analytics page to see which products perform best

### 3. Optimize Timing

Check the Hourly Performance chart to post at peak times

### 4. Update Your Profile

Complete social media links show credibility

### 5. Monitor Daily

Check your dashboard daily to track growth

## 🔍 Troubleshooting

### "Unauthorized" or Login Issues

1. Clear browser cache and cookies
2. Try logging out and logging in again
3. Check if backend is running (http://localhost:4000/health)

### No Data Showing

1. Generate some affiliate links first
2. Share links and get some clicks
3. Data updates may take a few minutes

### Charts Not Loading

1. Refresh the page
2. Check browser console for errors (F12)
3. Verify backend is running

### Can't Request Payout

1. Ensure you have ₹500+ pending
2. Complete your profile information
3. Check that payment method details are valid

## 📱 Mobile Access

The dashboard works on mobile devices!

- Responsive design adapts to screen size
- Sidebar collapses to hamburger menu
- All features available on mobile

## 🆘 Need Help?

### Check These First:

1. **Backend running?** → `apps/backend` with `npm run dev`
2. **Dashboard running?** → Port 3002 accessible
3. **Firebase configured?** → Check `.env.local` file
4. **Browser console?** → Press F12 to see errors

### Common Issues:

**Problem**: Can't see products
**Solution**: Backend needs product data seeded

**Problem**: Payout request fails
**Solution**: Check minimum balance and complete profile

**Problem**: Charts empty
**Solution**: Need at least one click/conversion for data

## 🎉 You're All Set!

Your influencer dashboard is now ready to use. Start by:

1. ✅ Creating your first affiliate link
2. ✅ Sharing it on social media
3. ✅ Tracking your first click
4. ✅ Earning your first commission!

---

## Quick Commands Cheat Sheet

```bash
# Start Backend
cd apps/backend && npm run dev

# Start Dashboard
cd apps/influencer-dashboard && npm run dev

# Build for Production
cd apps/influencer-dashboard && npm run build

# Check Backend Health
curl http://localhost:4000/health

# View Backend Logs
cd apps/backend && tail -f backend-logs.txt
```

## URLs

- 🎯 **Dashboard**: http://localhost:3002
- 🔧 **Backend API**: http://localhost:4000/api
- 🛍️ **Web Store**: http://localhost:3000
- 💼 **Business Dashboard**: http://localhost:3001

---

**Happy Earning! 🚀💰**
