import { createClient } from '@/lib/supabase/client';
import { typeSafeSupabase } from '@/lib/supabase/type-safe-client';
import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  member_profile?: {
    id: string;
    first_name: string;
    last_name: string;
    tier: string;
    total_donated: number;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    engagement_score: number;
    created_at: string;
    updated_at: string;
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
          address: memberData.address || '',
          city: memberData.city || '',
          state: memberData.state || '',
          zip_code: memberData.zip_code || '',
          tier: 'bronze',
          status: 'active',
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
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { data, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  // Sign out
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    return { error };
  }

  // Get current user with profile
  async getCurrentUserWithProfile(): Promise<{ user: AuthUser | null; error: any }> {
    try {
      const { data: { user }, error: userError } = await this.supabase.auth.getUser();
      
      if (userError || !user) {
        return { user: null, error: userError };
      }

      // Fetch member profile
      const { data: profile, error: profileError } = await this.supabase
        .from('members')
        .select('*')
        .eq('id', user.id)
        .single();

      const userWithProfile: AuthUser = {
        ...user,
        member_profile: profile || undefined
      };

      return { user: userWithProfile, error: profileError };
    } catch (error) {
      return { user: null, error };
    }
  }

  // Update member profile
  async updateProfile(userId: string, updates: Partial<{
    first_name: string;
    last_name: string;
    phone: string;
    address: string;
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
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      return { error };
    } catch (error) {
      return { error };
    }
  }

  // Listen to auth state changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // Mock data fallback for development
  async getMockUserData(): Promise<{ user: AuthUser | null; error: any }> {
    // This is a mock user for development - easily replaceable with real data
    const mockUser: AuthUser = {
      id: 'mock-user-id',
      email: 'john.doe@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      email_confirmed_at: new Date().toISOString(),
      phone: '',
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {
        first_name: 'John',
        last_name: 'Doe',
      },
      identities: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      member_profile: {
        id: 'mock-user-id',
        first_name: 'John',
        last_name: 'Doe',
        tier: 'gold',
        total_donated: 1250,
        phone: '+1 (555) 123-4567',
        address: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip_code: '12345',
        engagement_score: 85,
        created_at: '2024-01-15T10:00:00Z',
        updated_at: new Date().toISOString(),
      }
    };

    return { user: mockUser, error: null };
  }
}

export const authService = new AuthService();