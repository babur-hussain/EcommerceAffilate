# Firebase Configuration Complete

## ✅ Setup Complete

### Backend Configuration
- **Service Account:** [firebase-adminsdk.json](apps/backend/firebase-adminsdk.json) ✓
- **Project:** sarvrachna-inventorymanagement
- **Environment:** [.env](apps/backend/.env) updated with `FIREBASE_SERVICE_ACCOUNT_PATH`
- **Build:** Clean (no errors) ✓

### Frontend Configuration  
- **Project:** affilate-ecommerce-56ccc
- **Config:** [firebase.ts](apps/web/src/lib/firebase.ts) updated with hardcoded fallback values
- **API Key:** AIzaSyCCq6s1VXf3C5QOib9ddv2EfuVAjoyHttk
- **Auth Domain:** affilate-ecommerce-56ccc.firebaseapp.com

### Authentication Flow Ready
1. **Frontend** → User signs in with Firebase (email/password or Google)
2. **Frontend** → Gets Firebase ID token from client SDK
3. **Frontend** → Sends token in `Authorization: Bearer <token>` header
4. **Backend** → Verifies token with Firebase Admin SDK
5. **Backend** → Creates/updates User record in MongoDB on first login
6. **Backend** → Attaches `{id, role, businessId}` to request

### Data Models Updated
- **Business:** One business can own multiple brands
- **Brand:** Belongs to one business
- **User:** Can be linked to a business (via `businessId`)
- **Product:** Requires both `brandId` and `businessId`

### New Role System
- `ADMIN` - Platform administrator (no businessId)
- `BUSINESS_OWNER` - Business owner (has businessId)
- `BUSINESS_MANAGER` - Business manager (has businessId)
- `BUSINESS_STAFF` - Business staff (has businessId)
- `INFLUENCER` - Influencer/affiliate (no businessId)
- `CUSTOMER` - Regular customer (no businessId)

### Next Steps

**1. Enable Authentication Methods in Firebase Console**
- Go to [Firebase Console](https://console.firebase.google.com/project/affilate-ecommerce-56ccc/authentication)
- Enable **Email/Password** authentication
- Enable **Google Sign-In** authentication
- (Optional) Enable **Phone** authentication

**2. Test Backend Firebase Admin**
```bash
cd apps/backend
npm run dev
```
Look for: `✓ Firebase Admin initialized successfully`

**3. Test Frontend Firebase SDK**
```bash
cd apps/web
npm run dev
```
Open browser console - should see no Firebase errors

**4. Wire Firebase Auth into Routes**

Update protected routes to use Firebase middleware instead of old JWT:

```typescript
// OLD (JWT-based)
import { requireBrand } from '../middlewares/rbac';
router.get('/brand/products', requireBrand, ...);

// NEW (Firebase-based) - Option 1: Keep existing guards (they now check req.user)
// No changes needed! Firebase middleware already attaches req.user

// NEW (Firebase-based) - Option 2: Use Firebase middleware directly
import { verifyFirebaseToken } from '../middlewares/firebaseAuth';
router.get('/brand/products', verifyFirebaseToken, requireBrand, ...);
```

**5. Create Business & Brand Management Routes**

Create routes for:
- `POST /api/businesses` - Create business (admin or self-registration)
- `GET /api/businesses/mine` - Get my business
- `POST /api/businesses/:id/brands` - Create brand under business
- `GET /api/businesses/:id/brands` - List brands for business

**6. Update Product Creation in Frontend**

Products now require `brandId` in the request body:

```typescript
// Frontend: apps/web - product creation form
const createProduct = async (data) => {
  const token = await auth.currentUser?.getIdToken();
  
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      brandId: selectedBrandId, // Required!
    }),
  });
};
```

**7. Frontend Auth UI Components**

Create:
- Sign up form (email/password)
- Login form (email/password + Google button)
- Password reset flow
- Profile page showing user role and business

**8. Seed Initial Data**

Create a script or admin route to:
- Create first business
- Create brands under business
- Assign business ownership to users
- Update existing products with brandId/businessId

### Security Notes

**⚠️ Important:**
- `firebase-adminsdk.json` is in `.gitignore` - never commit!
- Service account has full Firebase Admin privileges
- Rotate keys periodically in Firebase Console
- For production, use environment variables instead of JSON file

### Testing Checklist

- [ ] Backend starts without errors
- [ ] Firebase Admin initializes successfully
- [ ] Frontend Firebase SDK initializes
- [ ] Can create Firebase user (email/password)
- [ ] Can sign in with Google
- [ ] Token verification works on backend
- [ ] User record auto-created in MongoDB on first login
- [ ] `req.user` contains correct `{id, role, businessId}`
- [ ] Business users can create brands
- [ ] Products require valid brandId
- [ ] Ownership checks work with businessId

### Migration Path for Existing Data

If you have existing products/users in the database:

**Option 1: Clean Start**
```bash
# Drop existing collections and start fresh
mongosh <your-connection-string>
use ecommerceearn
db.products.drop()
db.users.drop()
```

**Option 2: Migrate Existing Data**
Create a migration script to:
1. Create a default business
2. Create a default brand under that business
3. Update all existing products with the default brandId/businessId
4. Update all users with role 'BRAND' to 'BUSINESS_OWNER'

### Current Architecture

```
Firebase Auth
    ↓
  Users (MongoDB)
    ↓
 Business ←→ Brands
    ↓           ↓
  Products (require both businessId and brandId)
```

**Key Points:**
- One user can own one business (via `ownerUserId`)
- One business can have multiple brands
- One business can have multiple users (via `businessId` on User model)
- Products belong to both a brand and a business
- Only business-linked users can manage products
