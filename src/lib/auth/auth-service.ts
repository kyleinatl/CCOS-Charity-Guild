import { createClient } from '@/lib/supabase/client';
import { typeSafeSupabase } from '@/lib/supabase/type-safe-client';
import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  member_profile?: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    tier: string | null;
    total_donated: number | null;
    phone: string | null;
    address_line1: string | null;
    city: string | null;
    state: string | null;
    zip_code: string | null;
    engagement_score: number | null;
    created_at: string | null;
    updated_at: string | null;
  };
}

export class AuthService {
  private supabase = createClient();

  // Sign up new member
  async signUp(email: string, password: string, memberData: {
    first_name: string;
    last_name: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip_code?: string;
  }) {
    try {
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: memberData.first_name,
            last_name: memberData.last_name,
          }
        }
      });

      if (authError) throw authError;

      // Create member profile after successful auth signup
      if (authData.user) {
        const { error: profileError } = await typeSafeSupabase.insertMember({
          id: authData.user.id,
          email: authData.user.email!,
          first_name: memberData.first_name,
          last_name: memberData.last_name,
          phone: memberData.phone || '',
          address_line1: memberData.address || '',
          city: memberData.city || '',
          state: memberData.state || '',
          zip_code: memberData.zip_code || '',
          tier: 'bronze',
          total_donated: 0,
          engagement_score: 0,
        });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          // Note: In production, you might want to clean up the auth user here
        }
      }

      return { data: authData, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign in existing member
  async signIn(email: string, password: string) {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { data: null, error: data.error || 'Unable to sign in' };
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign out
  async signOut() {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (!response.ok) {
        return { error: 'Unable to sign out' };
      }
      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  // Get current user with profile
  async getCurrentUserWithProfile(): Promise<{ user: AuthUser | null; error: any }> {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });

      if (!response.ok) {
        return { user: null, error: 'Failed to load session' };
      }

      const data = await response.json();
      return { user: data.user || null, error: null };
    } catch (error) {
      return { user: null, error };
    }
  }

  // Update member profile
  async updateProfile(userId: string, updates: Partial<{
    first_name: string;
    last_name: string;
    phone: string;
    address_line1: string;
    city: string;
    state: string;
    zip_code: string;
    communication_preferences: any;
  }>) {
    try {
      const { data, error } = await typeSafeSupabase.updateMember(userId, {
        ...updates,
        updated_at: new Date().toISOString(),
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Reset password
  async resetPassword(email: string) {
    return { error: 'Password resets are handled by the admin portal' };
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return { data: { subscription: { unsubscribe() {} } } };
  }
}

export const authService = new AuthService();