import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

let adminAuth: admin.auth.Auth;

try {
  // Check if already initialized
  if (admin.apps.length === 0) {
    // Option A: Use service account JSON file (Development)
    const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

    if (serviceAccountPath) {
      const fullPath = path.resolve(serviceAccountPath);
      if (fs.existsSync(fullPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('✓ Firebase Admin initialized with service account file');
      } else {
        throw new Error(`Service account file not found at: ${fullPath}`);
      }
    }
    // Option B: Use environment variables (Production)
    else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_PRIVATE_KEY &&
      process.env.FIREBASE_CLIENT_EMAIL
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      });
      console.log('✓ Firebase Admin initialized with environment variables');
    }
    // Fallback: Try application default credentials (for GCP environments)
    else {
      admin.initializeApp();
      console.log('✓ Firebase Admin initialized with default credentials');
    }
  }

  adminAuth = admin.auth();
} catch (error) {
  console.error('✗ Failed to initialize Firebase Admin:', error);
  throw error;
}

export { adminAuth, admin };
