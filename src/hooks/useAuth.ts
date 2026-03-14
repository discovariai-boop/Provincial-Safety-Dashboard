'use client';

import { useEffect, useState, useContext, createContext, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { CustomClaims, UserRole } from '@/lib/rbac';

export interface AuthContextType {
  user: User | null;
  claims: CustomClaims | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  refreshClaims: () => Promise<CustomClaims | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<CustomClaims | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Refresh custom claims from Firebase
  const refreshClaims = async (): Promise<CustomClaims | null> => {
    try {
      if (!user) return null;
      
      const idTokenResult = await user.getIdTokenResult(true); // Force refresh
      const customClaims = {
        role: (idTokenResult.claims.role as UserRole) || 'guest',
        department: (idTokenResult.claims.department as string) || null,
        sector: (idTokenResult.claims.sector as string) || null,
        province: (idTokenResult.claims.province as 'limpopo' | 'all') || 'limpopo',
        emergencyOverride: (idTokenResult.claims.emergencyOverride as boolean) || false,
      } as CustomClaims;
      
      setClaims(customClaims);
      return customClaims;
    } catch (err) {
      console.error('Error refreshing claims:', err);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser: User | null) => {
      try {
        setUser(currentUser);
        if (currentUser) {
          await refreshClaims();
        } else {
          setClaims(null);
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      const result = await signInWithEmailAndPassword(auth, email, password);
      await refreshClaims();
      return result.user;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string): Promise<User> => {
    try {
      setError(null);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setError(null);
      await firebaseSignOut(auth);
      setClaims(null);
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    claims,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    refreshClaims,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
