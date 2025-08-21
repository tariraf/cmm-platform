'use client';
import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'marketing' | 'viewer';
  department: string;
  createdAt: string;
  lastLogin: string;
}

export function useAuth() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Auto-create profile for existing users
  const createUserProfile = async (firebaseUser: User): Promise<UserProfile> => {
    console.log('🔧 Creating user profile for:', firebaseUser.email);
    
    // Determine role based on email
    let role: 'admin' | 'marketing' | 'viewer' = 'viewer';
    let name = 'User';
    
    const email = firebaseUser.email || '';
    
    if (email.includes('admin@dico.co.id')) {
      role = 'admin';
      name = 'Admin DICO';
    } else if (email.includes('marketing@dico.co.id')) {
      role = 'marketing';
      name = 'Marketing Team';
    } else if (email.includes('demo@dico.co.id')) {
      role = 'viewer';
      name = 'Demo User';
    } else {
      // Extract name from email
      name = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    
    const userProfile: UserProfile = {
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      name,
      role,
      department: 'Marketing',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    try {
      // Create document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      console.log('✅ User profile created successfully in Firestore');
      return userProfile;
    } catch (error: any) {
      console.error('❌ Error creating user profile:', error);
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
  };

  // Get user profile from Firestore
  const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      console.log('🔧 Getting user profile for UID:', uid);
      
      const userDoc = await getDoc(doc(db, 'users', uid));
      
      if (!userDoc.exists()) {
        console.log('ℹ️ User profile document not found');
        return null;
      }
      
      const profile = userDoc.data() as UserProfile;
      console.log('✅ User profile found:', profile);
      return profile;
    } catch (error: any) {
      console.error('❌ Error getting user profile:', error);
      return null;
    }
  };

  // Listen to Firebase auth state changes
  useEffect(() => {
    console.log('🔧 Setting up auth listener...');
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('🔧 Auth state changed:', firebaseUser?.email || 'No user');
      
      try {
        if (firebaseUser) {
          setFirebaseUser(firebaseUser);
          
          // Try to get existing profile
          let userProfile = await getUserProfile(firebaseUser.uid);
          
          // If no profile exists, create one
          if (!userProfile) {
            console.log('ℹ️ No profile found, creating new profile...');
            userProfile = await createUserProfile(firebaseUser);
          } else {
            // Update last login
            const updatedProfile = {
              ...userProfile,
              lastLogin: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), updatedProfile, { merge: true });
            userProfile = updatedProfile;
          }
          
          setUser(userProfile);
          console.log('✅ User profile set:', userProfile);
        } else {
          setFirebaseUser(null);
          setUser(null);
          console.log('ℹ️ No authenticated user');
        }
      } catch (error: any) {
        console.error('❌ Auth state change error:', error);
        setError(`Authentication error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔧 Attempting login for:', email);
      
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('✅ Firebase Auth successful');
      
      // The auth state listener will handle profile creation/retrieval
      return true;
      
    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // Specific error messages
      if (error.code === 'auth/user-not-found') {
        setError('User tidak ditemukan');
      } else if (error.code === 'auth/wrong-password') {
        setError('Password salah');
      } else if (error.code === 'auth/invalid-credential') {
        setError('Email atau password tidak valid');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Terlalu banyak percobaan. Coba lagi nanti.');
      } else {
        setError(error.message || 'Login gagal');
      }
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('🔧 Logging out...');
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Clear error
  const clearError = () => setError(null);

  // Manual profile creation (for debugging)
  const createProfile = async () => {
    if (!firebaseUser) {
      setError('No authenticated user');
      return false;
    }
    
    try {
      const profile = await createUserProfile(firebaseUser);
      setUser(profile);
      return true;
    } catch (error: any) {
      setError(error.message);
      return false;
    }
  };

  return {
    user,
    firebaseUser,
    loading,
    error,
    login,
    logout,
    clearError,
    createProfile, // For debugging
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isMarketing: user?.role === 'marketing'
  };
}