import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onIdTokenChanged,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import api from '../lib/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface User {
  uid: string;
  _id?: string;
  email: string;
  name?: string;
  phone?: string;
  role?: string;
  isActive?: boolean;
  profileImage?: string;
  coins?: number;
  membershipStatus?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const response = await api.get('/api/me');
      const userData: User = {
        uid: firebaseUser.uid,
        _id: response.data.user.id || response.data.user._id, // Handle both id formats
        email: firebaseUser.email || '',
        name: response.data.user.name || firebaseUser.displayName,
        phone: response.data.user.phone,
        role: response.data.user.role,
        isActive: response.data.user.isActive,
        profileImage: response.data.user.profileImage || firebaseUser.photoURL,
        coins: response.data.user.coins,
        membershipStatus: response.data.user.membershipStatus,
      };
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Still set basic user info from Firebase
      setUser((prev) => ({
        ...prev,
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || prev?.name,
      }));
    }
  };

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        await AsyncStorage.setItem('authToken', token);
        await fetchUserProfile(firebaseUser);
      } else {
        setUser(null);
        await AsyncStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshUser = async () => {
    if (auth.currentUser) {
      // Force token refresh if needed, usually just re-fetching profile is enough
      await fetchUserProfile(auth.currentUser);
    }
  };

  // Google Sign-In Configuration
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: Constants.expoConfig?.extra?.googleWebClientId || '289792075088-6td58kavr8slvog42a31ncnn5q221n84.apps.googleusercontent.com',
    iosClientId: Constants.expoConfig?.extra?.googleIosClientId || '289792075088-e0qo7dnh8fm612grks53tnatthlph2gp.apps.googleusercontent.com',
    androidClientId: Constants.expoConfig?.extra?.googleAndroidClientId || '289792075088-6td58kavr8slvog42a31ncnn5q221n84.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((error) => {
        console.error('Google Sign-In Error:', error);
      });
    }
  }, [response]);

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('authToken', token);
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Create user in Firebase
    const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Update display name
    await updateProfile(userCredential.user, { displayName: name });

    const token = await userCredential.user.getIdToken();
    await AsyncStorage.setItem('authToken', token);

    // Create user in backend
    try {
      await api.post('/api/auth/register', {
        email,
        password,
        name,
        firebaseUid: userCredential.user.uid
      });
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        console.log('User already exists in backend, proceeding.');
      } else {
        console.error('Error creating user in backend:', error);
        // Optional: Delete firebase user if backend creation fails
      }
    }
  };

  const signInWithGoogle = async () => {
    if (!request) {
      throw new Error('Google Sign-In is not initialized. Please check your configuration.');
    }

    // Check if Client IDs are still placeholders or missing
    const isPlaceholder =
      request?.clientId?.includes('YOUR_WEB_CLIENT_ID') ||
      request?.clientId?.includes('YOUR_ANDROID_CLIENT_ID');

    if (isPlaceholder) {
      console.warn('Google Sign-In misconfigured: Placeholder IDs detected.');
      throw new Error('Google Sign-In is not fully configured.');
    }

    try {
      await promptAsync();
    } catch (err) {
      console.error("Google Sign-In prompt failed:", err);
      throw err;
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    await AsyncStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
