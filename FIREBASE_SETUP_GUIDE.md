# Firebase Authentication Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name (e.g., "ecommerceearn" or "influencer-platform")
4. Disable Google Analytics (optional, can enable later)
5. Click "Create project"

---

## Step 2: Enable Authentication Methods

### Enable Email/Password Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Click on **Email/Password**
3. Toggle **Enable**
4. Click **Save**

### Enable Google Sign-In
1. In same **Sign-in method** page
2. Click on **Google**
3. Toggle **Enable**
4. Enter **Project support email** (your email)
5. Click **Save**

### (Optional) Enable Phone Authentication
1. Click on **Phone**
2. Toggle **Enable**
3. Add test phone numbers if needed
4. Click **Save**

---

## Step 3: Get Firebase Web Config

1. In Firebase Console, click the **gear icon** (Settings) → **Project settings**
2. Scroll to "Your apps" section
3. Click the **Web icon** (`</>`) to add a web app
4. Enter app nickname (e.g., "Web App")
5. Do NOT enable Firebase Hosting
6. Click **Register app**
7. Copy the firebaseConfig object

**Example config:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

8. Add these to `apps/web/.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## Step 4: Generate Service Account Key (Backend)

1. In Firebase Console, go to **Settings** → **Project settings**
2. Click **Service accounts** tab
3. Click **Generate new private key**
4. Confirm by clicking **Generate key**
5. A JSON file will download (e.g., `your-project-firebase-adminsdk-xxxxx.json`)

**IMPORTANT: Keep this file secure! Never commit to git!**

### Option A: Use JSON file directly (Development)
1. Place the JSON file in `apps/backend/` directory
2. Add to `apps/backend/.env`:
```
FIREBASE_SERVICE_ACCOUNT_PATH=./your-project-firebase-adminsdk-xxxxx.json
```

### Option B: Use environment variables (Production - Recommended)
1. Open the downloaded JSON file
2. Extract these values and add to `apps/backend/.env`:
```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

**Note:** The private key must include `\n` for line breaks.

---

## Step 5: Install Dependencies

### Frontend
```bash
cd apps/web
npm install firebase
```

### Backend
```bash
cd apps/backend
npm install firebase-admin
```

---

## Step 6: Update .gitignore

Add to `apps/backend/.gitignore`:
```
# Firebase service account
*-firebase-adminsdk-*.json
firebase-adminsdk-*.json
```

---

## Step 7: Verify Setup

### Test Frontend Firebase Initialization
```bash
cd apps/web
npm run dev
```
Check browser console for Firebase initialization (no errors).

### Test Backend Firebase Admin
```bash
cd apps/backend
npm run dev
```
Check terminal for "Firebase Admin initialized successfully" message.

---

## Next Steps

After this foundation is set up:
1. Create sign-up/login UI components
2. Map Firebase UIDs to user roles in database
3. Implement role-based access control
4. Replace existing JWT auth with Firebase tokens

---

## Troubleshooting

**Error: "Firebase config missing"**
- Ensure all `NEXT_PUBLIC_FIREBASE_*` variables are in `apps/web/.env.local`
- Restart Next.js dev server after adding env vars

**Error: "Could not load default credentials"**
- Ensure Firebase service account path is correct
- Or ensure all three env vars (PROJECT_ID, PRIVATE_KEY, CLIENT_EMAIL) are set
- Check that FIREBASE_PRIVATE_KEY includes `\n` characters properly

**Error: "Invalid token"**
- Ensure frontend is using the same Firebase project
- Check that token is being sent in `Authorization: Bearer <token>` header
- Verify token hasn't expired (tokens expire after 1 hour)

---

## Security Notes

1. **Never commit** `firebase-adminsdk-*.json` files
2. **Never commit** `.env` or `.env.local` files
3. In production, use environment variables (Option B) instead of JSON file
4. Rotate service account keys periodically
5. Set up Firebase security rules for Firestore/Storage if using those services
