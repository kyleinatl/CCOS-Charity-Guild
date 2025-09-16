import { createClient } from '@supabase/supabase-js';

// Simple interfaces for type safety
interface MemberData {
  id?: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  tier?: string;
  status?: string;
  total_donated?: number;
  engagement_score?: number;
  member_since?: string;
  last_donation_date?: string;
  [key: string]: any;
}

interface DonationData {
  id?: string;
  member_id: string;
  amount: number;
  currency?: string;
  donation_date: string;
  method: string;
  designation: string;
  transaction_id: string;
  payment_processor: string;
  processing_fee: number;
  net_amount: number;
  receipt_number: string;
  [key: string]: any;
}

interface AutomationData {
  id?: string;
  name: string;
  description?: string;
  trigger_type: string;
  trigger_conditions?: any;
  actions: any;
  status?: string;
  last_run?: string;
  next_run?: string;
  run_count?: number;
  created_by: string;
  [key: string]: any;
}

// Runtime-safe Supabase client wrapper
class TypeSafeSupabaseClient {
  private client: any;

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://eueqffggclywmajfwiio.supabase.co';
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZXFmZmdnY2x5d21hamZ3aWlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NzQxMDUsImV4cCI6MjA3MzU1MDEwNX0.C3EcY0LgKJ2vOybc1rBHlwgsviKJ5w32xW9MxZHJ85E';
    this.client = createClient(supabaseUrl, supabaseAnonKey);
  }

  // Type-safe member operations
  async insertMember(member: MemberData) {
    try {
      return await this.client.from('members').insert(member).select().single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async updateMember(id: string, updates: Partial<MemberData>) {
    try {
      return await this.client.from('members').update(updates).eq('id', id).select().single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async getMember(id: string) {
    try {
      return await this.client.from('members').select('*').eq('id', id).single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async getMembers() {
    try {
      return await this.client.from('members').select('*');
    } catch (error) {
      return { data: null, error };
    }
  }

  // Type-safe donation operations
  async insertDonation(donation: DonationData) {
    try {
      return await this.client.from('donations').insert(donation).select().single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async updateDonation(id: string, updates: Partial<DonationData>) {
    try {
      return await this.client.from('donations').update(updates).eq('id', id).select().single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async getDonation(id: string) {
    try {
      return await this.client.from('donations').select('*').eq('id', id).single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async getDonations() {
    try {
      return await this.client.from('donations').select('*');
    } catch (error) {
      return { data: null, error };
    }
  }

  async getMemberDonations(memberId: string) {
    try {
      return await this.client.from('donations').select('*').eq('member_id', memberId);
    } catch (error) {
      return { data: null, error };
    }
  }

  // Type-safe automation operations
  async insertAutomation(automation: AutomationData) {
    try {
      return await this.client.from('automations').insert(automation).select().single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async updateAutomation(id: string, updates: Partial<AutomationData>) {
    try {
      return await this.client.from('automations').update(updates).eq('id', id).select().single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async getAutomation(id: string) {
    try {
      return await this.client.from('automations').select('*').eq('id', id).single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async getAutomations() {
    try {
      return await this.client.from('automations').select('*');
    } catch (error) {
      return { data: null, error };
    }
  }

  // Type-safe automation log operations
  async insertAutomationLog(log: {
    automation_id: string;
    member_id?: string;
    trigger_data?: any;
    success: boolean;
    error_message?: string;
    execution_time?: number;
  }) {
    try {
      return await this.client.from('automation_logs').insert(log).select().single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async getAutomationLogs(automationId?: string) {
    try {
      let query = this.client.from('automation_logs').select('*');
      if (automationId) {
        query = query.eq('automation_id', automationId);
      }
      return await query;
    } catch (error) {
      return { data: null, error };
    }
  }

  // Type-safe member activity operations
  async insertMemberActivity(activity: {
    member_id: string;
    activity_type: string;
    activity_description: string;
    activity_value?: number;
    metadata?: any;
  }) {
    try {
      return await this.client.from('member_activities').insert(activity).select().single();
    } catch (error) {
      return { data: null, error };
    }
  }

  async getMemberActivities(memberId: string) {
    try {
      return await this.client.from('member_activities').select('*').eq('member_id', memberId);
    } catch (error) {
      return { data: null, error };
    }
  }

  // Auth operations (pass-through)
  get auth() {
    return this.client.auth;
  }

  // Raw client access for complex queries
  get raw() {
    return this.client;
  }
}

export const typeSafeSupabase = new TypeSafeSupabaseClient();
export default typeSafeSupabase;