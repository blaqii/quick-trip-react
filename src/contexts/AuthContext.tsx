import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, userType: 'driver' | 'rider') => Promise<void>;
  loginWithGoogle: (userType: 'driver' | 'rider') => Promise<void>;
  updateUserType: (userType: 'driver' | 'rider') => Promise<void>;
  logout: () => Promise<void>;
}

interface UserProfile {
  uid: string;
  email: string;
  userType: 'driver' | 'rider';
  name?: string;
  phone?: string;
  createdAt: Date;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const createUserProfile = async (user: User, userType: 'driver' | 'rider') => {
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      const profile: UserProfile = {
        uid: user.uid,
        email: user.email!,
        userType,
        name: user.displayName || '',
        createdAt: new Date()
      };
      
      await setDoc(userRef, profile);
      setUserProfile(profile);
    } else {
      setUserProfile(userSnap.data() as UserProfile);
    }
  };

  const signup = async (email: string, password: string, userType: 'driver' | 'rider') => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(user, userType);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = async (userType: 'driver' | 'rider') => {
    const { user } = await signInWithPopup(auth, googleProvider);
    await createUserProfile(user, userType);
  };

  const updateUserType = async (userType: 'driver' | 'rider') => {
    if (!currentUser) return;
    
    const userRef = doc(db, 'users', currentUser.uid);
    await setDoc(userRef, { userType }, { merge: true });
    
    // Update local state
    setUserProfile(prev => prev ? { ...prev, userType } : null);
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as UserProfile);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    updateUserType,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};