// Core TypeScript types for CCOS Charity Guild
// Database entity types and API interfaces

import { z } from 'zod';

// Enum types matching database enums
export type MemberTier = 'bronze' | 'silver' | 'gold' | 'platinum';
export type DonationMethod = 'online' | 'check' | 'cash' | 'credit_card' | 'bank_transfer';
export type EventStatus = 'draft' | 'published' | 'active' | 'completed' | 'cancelled';
export type RegistrationStatus = 'pending' | 'confirmed' | 'cancelled' | 'attended';
export type CommunicationType = 'newsletter' | 'email_campaign' | 'social_media' | 'direct_email';
export type AutomationStatus = 'active' | 'paused' | 'completed' | 'error';
export type UserRole = 'admin_role' | 'treasurer_role' | 'member_role';

// Base entity interface
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// Member related types
export interface Member extends BaseEntity {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country: string;
  tier: MemberTier;
  total_donated: number;
  last_donation_date?: string;
  member_since: string;
  engagement_score: number;
  email_subscribed: boolean;
  sms_subscribed: boolean;
  newsletter_subscribed: boolean;
  date_of_birth?: string;
  occupation?: string;
  employer?: string;
  interests?: string[];
  notes?: string;
  created_by?: string;
  updated_by?: string;
}

export interface MemberSummary {
  id: string;
  full_name: string;
  email: string;
  tier: MemberTier;
  total_donated: number;
  engagement_score: number;
  last_activity?: string;
}

// Donation related types
export interface Donation extends BaseEntity {
  member_id: string;
  amount: number;
  donation_date: string;
  method: DonationMethod;
  designation: string;
  transaction_id?: string;
  payment_processor?: string;
  processing_fee: number;
  net_amount: number;
  receipt_sent: boolean;
  receipt_sent_date?: string;
  tax_deductible: boolean;
  receipt_number?: string;
  is_recurring: boolean;
  recurring_frequency?: string;
  recurring_end_date?: string;
  parent_donation_id?: string;
  anonymous: boolean;
  public_acknowledgment: boolean;
  notes?: string;
  created_by?: string;
  // Relations
  member?: Member;
}

export interface DonationSummary {
  total_amount: number;
  total_count: number;
  average_amount: number;
  largest_donation: number;
  most_recent_date?: string;
  by_method: Record<DonationMethod, number>;
  by_designation: Record<string, number>;
  monthly_totals: Array<{
    month: string;
    amount: number;
    count: number;
  }>;
}

// Event related types
export interface Event extends BaseEntity {
  name: string;
  description?: string;
  event_type?: string;
  start_date: string;
  end_date?: string;
  registration_deadline?: string;
  venue_name?: string;
  venue_address?: string;
  is_virtual: boolean;
  virtual_link?: string;
  status: EventStatus;
  capacity?: number;
  current_registrations: number;
  waitlist_enabled: boolean;
  ticket_price: number;
  member_discount_percent: number;
  early_bird_price?: number;
  early_bird_deadline?: string;
  fundraising_goal?: number;
  total_raised: number;
  image_url?: string;
  requires_approval: boolean;
  tags?: string[];
  created_by?: string;
  updated_by?: string;
}

export interface EventRegistration extends BaseEntity {
  event_id: string;
  member_id: string;
  status: RegistrationStatus;
  registration_date: string;
  number_of_guests: number;
  total_attendees: number;
  amount_paid: number;
  payment_method?: DonationMethod;
  payment_date?: string;
  checked_in: boolean;
  check_in_time?: string;
  attended: boolean;
  dietary_restrictions?: string;
  special_requests?: string;
  notes?: string;
  // Relations
  event?: Event;
  member?: Member;
}

// Communication related types
export interface Communication extends BaseEntity {
  type: CommunicationType;
  subject: string;
  content: string;
  recipient_segments: string[];
  total_recipients: number;
  sent_at?: string;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  platform?: string;
  scheduled_for?: string;
  from_email?: string;
  reply_to_email?: string;
  template_id?: string;
  tags?: string[];
  created_by?: string;
}

export interface CommunicationRecipient extends BaseEntity {
  communication_id: string;
  member_id: string;
  delivered: boolean;
  delivered_at?: string;
  opened: boolean;
  opened_at?: string;
  clicked: boolean;
  clicked_at?: string;
  bounced: boolean;
  unsubscribed: boolean;
  // Relations
  communication?: Communication;
  member?: Member;
}

// Automation related types
export interface Automation extends BaseEntity {
  name: string;
  description?: string;
  trigger_type: string;
  trigger_conditions?: Record<string, any>;
  actions: Array<Record<string, any>>;
  status: AutomationStatus;
  last_run?: string;
  next_run?: string;
  run_count: number;
  created_by?: string;
}

export interface AutomationLog extends BaseEntity {
  automation_id: string;
  member_id?: string;
  trigger_data?: Record<string, any>;
  actions_executed?: Array<Record<string, any>>;
  success: boolean;
  error_message?: string;
  // Relations
  automation?: Automation;
  member?: Member;
}

// Activity tracking
export interface MemberActivity extends BaseEntity {
  member_id: string;
  activity_type: string;
  activity_description?: string;
  activity_value?: number;
  related_donation_id?: string;
  related_event_id?: string;
  related_communication_id?: string;
  // Relations
  member?: Member;
  related_donation?: Donation;
  related_event?: Event;
  related_communication?: Communication;
}

// Analytics and reporting types
export interface DashboardMetrics {
  total_members: number;
  new_members_this_month: number;
  total_donations_amount: number;
  donations_this_month: number;
  average_donation_amount: number;
  upcoming_events: number;
  active_automations: number;
  engagement_rate: number;
}

export interface MemberGrowthData {
  date: string;
  new_members: number;
  total_members: number;
}

export interface DonationTrendData {
  date: string;
  amount: number;
  count: number;
  cumulative_amount: number;
}

export interface TierDistribution {
  tier: MemberTier;
  count: number;
  percentage: number;
  total_donated: number;
}

// Form and validation types
export const MemberFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  address_line1: z.string().optional(),
  address_line2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  country: z.string().default('United States'),
  date_of_birth: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  interests: z.array(z.string()).optional(),
  notes: z.string().optional(),
  email_subscribed: z.boolean().default(true),
  sms_subscribed: z.boolean().default(false),
  newsletter_subscribed: z.boolean().default(true),
});

export const DonationFormSchema = z.object({
  member_id: z.string().uuid('Invalid member ID'),
  amount: z.number().positive('Amount must be positive'),
  donation_date: z.string(),
  method: z.enum(['online', 'check', 'cash', 'credit_card', 'bank_transfer']),
  designation: z.string().default('General Fund'),
  transaction_id: z.string().optional(),
  payment_processor: z.string().optional(),
  processing_fee: z.number().min(0).default(0),
  receipt_sent: z.boolean().default(false),
  tax_deductible: z.boolean().default(true),
  is_recurring: z.boolean().default(false),
  recurring_frequency: z.string().optional(),
  recurring_end_date: z.string().optional(),
  anonymous: z.boolean().default(false),
  public_acknowledgment: z.boolean().default(true),
  notes: z.string().optional(),
});

export const EventFormSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  description: z.string().optional(),
  event_type: z.string().optional(),
  start_date: z.string(),
  end_date: z.string().optional(),
  registration_deadline: z.string().optional(),
  venue_name: z.string().optional(),
  venue_address: z.string().optional(),
  is_virtual: z.boolean().default(false),
  virtual_link: z.string().url().optional().or(z.literal('')),
  capacity: z.number().positive().optional(),
  ticket_price: z.number().min(0).default(0),
  member_discount_percent: z.number().min(0).max(100).default(0),
  early_bird_price: z.number().min(0).optional(),
  early_bird_deadline: z.string().optional(),
  fundraising_goal: z.number().positive().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
  requires_approval: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
});

export const CommunicationFormSchema = z.object({
  type: z.enum(['newsletter', 'email_campaign', 'social_media', 'direct_email']),
  subject: z.string().min(1, 'Subject is required'),
  content: z.string().min(1, 'Content is required'),
  recipient_segments: z.array(z.string()).min(1, 'At least one recipient segment is required'),
  platform: z.string().optional(),
  scheduled_for: z.string().optional(),
  from_email: z.string().email().optional(),
  reply_to_email: z.string().email().optional(),
  tags: z.array(z.string()).optional(),
});

// Form data types
export type MemberFormData = z.infer<typeof MemberFormSchema>;
export type DonationFormData = z.infer<typeof DonationFormSchema>;
export type EventFormData = z.infer<typeof EventFormSchema>;
export type CommunicationFormData = z.infer<typeof CommunicationFormSchema>;

// API schema types (aliases for consistency)
export const CreateMemberSchema = MemberFormSchema;
export const CreateDonationSchema = DonationFormSchema;
export const CreateEventSchema = EventFormSchema;
export const CreateCommunicationSchema = CommunicationFormSchema;

// API response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// Search and filter types
export interface MemberFilters {
  tier?: MemberTier[];
  search?: string;
  engagement_score_min?: number;
  engagement_score_max?: number;
  total_donated_min?: number;
  total_donated_max?: number;
  member_since_from?: string;
  member_since_to?: string;
  interests?: string[];
  email_subscribed?: boolean;
  newsletter_subscribed?: boolean;
}

export interface DonationFilters {
  member_id?: string;
  amount_min?: number;
  amount_max?: number;
  method?: DonationMethod[];
  designation?: string[];
  date_from?: string;
  date_to?: string;
  is_recurring?: boolean;
  tax_deductible?: boolean;
}

export interface EventFilters {
  status?: EventStatus[];
  event_type?: string[];
  date_from?: string;
  date_to?: string;
  is_virtual?: boolean;
  has_capacity?: boolean;
}

// Authentication and authorization types
export interface User {
  id: string;
  email: string;
  role: UserRole;
  member_id?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// All types are individually exported above for easier importing