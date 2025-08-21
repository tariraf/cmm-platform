import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: 'admin' | 'marketing' | 'viewer';
  department: string;
  createdAt: string;
  lastLogin: string;
}

// Register new user
export const registerUser = async (
  email: string, 
  password: string, 
  name: string, 
  role: 'admin' | 'marketing' | 'viewer' = 'viewer'
): Promise<UserProfile> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      name,
      role,
      department: 'Marketing',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    // Save user profile to Firestore
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    return userProfile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Login user
export const loginUser = async (email: string, password: string): Promise<UserProfile> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user profile from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User profile not found');
    }
    
    const userProfile = userDoc.data() as UserProfile;
    
    // Update last login
    await setDoc(doc(db, 'users', user.uid), {
      ...userProfile,
      lastLogin: new Date().toISOString()
    }, { merge: true });
    
    return userProfile;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Get user profile
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    return userDoc.data() as UserProfile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Auth state observer
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};