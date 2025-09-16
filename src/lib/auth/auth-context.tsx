'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, authService } from './auth-service';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>;
  signUp: (email: string, password: string, memberData: any) => Promise<{ data: any; error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: any) => Promise<{ data: any; error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session on mount
    const getInitialSession = async () => {
      try {
        // Try to get real user data first
        const { user: realUser, error } = await authService.getCurrentUserWithProfile();
        
        if (realUser && !error) {
          setUser(realUser);
        } else {
          // Fallback to mock data for development
          // TODO: Remove this in production - replace with proper error handling
          const { user: mockUser } = await authService.getMockUserData();
          setUser(mockUser);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Fallback to mock data
        const { user: mockUser } = await authService.getMockUserData();
        setUser(mockUser);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth state changes
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { user: userWithProfile } = await authService.getCurrentUserWithProfile();
        setUser(userWithProfile);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await authService.signIn(email, password);
    if (result.data?.user) {
      const { user: userWithProfile } = await authService.getCurrentUserWithProfile();
      setUser(userWithProfile);
    }
    return result;
  };

  const signUp = async (email: string, password: string, memberData: any) => {
    const result = await authService.signUp(email, password, memberData);
    return result;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: any) => {
    if (!user) return { data: null, error: 'No user logged in' };
    
    const result = await authService.updateProfile(user.id, updates);
    if (result.data) {
      // Update local user state
      setUser(prev => prev ? {
        ...prev,
        member_profile: { ...(prev.member_profile || {}), ...(result.data || {}) }
      } : null);
    }
    return result;
  };

  const resetPassword = async (email: string) => {
    return await authService.resetPassword(email);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
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