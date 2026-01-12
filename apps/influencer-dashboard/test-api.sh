#!/bin/bash

# Influencer Dashboard API Test Script
# This script tests all influencer API endpoints

API_URL="http://localhost:4000/api"

echo "🧪 Testing Influencer Dashboard API Endpoints"
echo "=============================================="
echo ""

# Note: You need a valid Firebase token to test these endpoints
# Get one by logging into the dashboard and copying from browser devtools

echo "⚠️  NOTE: These endpoints require Firebase authentication"
echo "To test, you need to:"
echo "1. Login to http://localhost:3002"
echo "2. Open browser DevTools (F12)"
echo "3. Go to Application > Local Storage"
echo "4. Copy the Firebase auth token"
echo "5. Set it as TOKEN variable below"
echo ""

TOKEN="YOUR_FIREBASE_TOKEN_HERE"

if [ "$TOKEN" = "YOUR_FIREBASE_TOKEN_HERE" ]; then
    echo "❌ Please set a valid Firebase token in this script"
    exit 1
fi

echo "✅ Testing with token: ${TOKEN:0:20}..."
echo ""

# Test 1: Get Profile
echo "1️⃣  GET /api/influencers/profile"
curl -s -X GET "$API_URL/influencers/profile" \
  -H "Authorization: Bearer $TOKEN" \
  | head -n 20
echo -e "\n"

# Test 2: Get Metrics
echo "2️⃣  GET /api/influencers/metrics"
curl -s -X GET "$API_URL/influencers/metrics" \
  -H "Authorization: Bearer $TOKEN" \
  | head -n 20
echo -e "\n"

# Test 3: Get Top Products
echo "3️⃣  GET /api/influencers/top-products"
curl -s -X GET "$API_URL/influencers/top-products" \
  -H "Authorization: Bearer $TOKEN" \
  | head -n 20
echo -e "\n"

# Test 4: Get Clicks Over Time
echo "4️⃣  GET /api/influencers/clicks-over-time"
curl -s -X GET "$API_URL/influencers/clicks-over-time?days=7" \
  -H "Authorization: Bearer $TOKEN" \
  | head -n 20
echo -e "\n"

# Test 5: Get Attributions
echo "5️⃣  GET /api/influencers/attributions"
curl -s -X GET "$API_URL/influencers/attributions?status=all&days=30" \
  -H "Authorization: Bearer $TOKEN" \
  | head -n 20
echo -e "\n"

# Test 6: Get Stats
echo "6️⃣  GET /api/influencers/stats"
curl -s -X GET "$API_URL/influencers/stats" \
  -H "Authorization: Bearer $TOKEN" \
  | head -n 20
echo -e "\n"

# Test 7: Get Affiliate Links
echo "7️⃣  GET /api/influencers/affiliate-links"
curl -s -X GET "$API_URL/influencers/affiliate-links" \
  -H "Authorization: Bearer $TOKEN" \
  | head -n 20
echo -e "\n"

# Test 8: Get Analytics
echo "8️⃣  GET /api/influencers/analytics"
curl -s -X GET "$API_URL/influencers/analytics?days=30" \
  -H "Authorization: Bearer $TOKEN" \
  | head -n 20
echo -e "\n"

# Test 9: Get Payouts
echo "9️⃣  GET /api/influencers/payouts"
curl -s -X GET "$API_URL/influencers/payouts" \
  -H "Authorization: Bearer $TOKEN" \
  | head -n 20
echo -e "\n"

echo "✅ All endpoint tests completed!"
echo ""
echo "Note: Empty arrays [] are normal if no data exists yet"
echo "To generate test data, use the dashboard to:"
echo "  - Create affiliate links"
echo "  - Click on them from the web app"
echo "  - Make test purchases"
