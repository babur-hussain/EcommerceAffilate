import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  initializeAuth,
  getAuth,
  GoogleAuthProvider,
  Auth,
  browserLocalPersistence
} from 'firebase/auth';
import * as firebaseAuth from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

// Extract getReactNativePersistence safely to avoid type errors in web contexts
// @ts-ignore
const getReactNativePersistence = (firebaseAuth as any).getReactNativePersistence;

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyCCq6s1VXf3C5QOib9ddv2EfuVAjoyHttk",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "affilate-ecommerce-56ccc.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "affilate-ecommerce-56ccc",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "affilate-ecommerce-56ccc.firebasestorage.app",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "295518104458",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:295518104458:web:ce593105ee2da6c32db673",
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-PES9D1RVFY",
};

// Initialize Firebase (singleton pattern)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase Auth with persistence
let auth: Auth;
const persistence = Platform.OS === 'web'
  ? browserLocalPersistence
  : getReactNativePersistence(ReactNativeAsyncStorage);

try {
  auth = initializeAuth(app, { persistence });
} catch (e) {
  auth = getAuth(app);
  // If auth already initialized (e.g. fast refresh), ensure persistence is set
  // This prevents losing auth state on reload/restart in some edge cases
  auth.setPersistence(persistence).catch((err) => {
    console.warn("Failed to set persistence on existing auth instance", err);
  });
}

export { auth };

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

// Export app for potential future use
export { app };
