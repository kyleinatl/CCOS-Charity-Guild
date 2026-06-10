-- One-shot idempotent setup for CCOS Charity Guild
-- Safe to run multiple times without duplicate-object errors.

-- CCOS Charity Guild - Complete Database Setup Script
-- This script creates all tables, relationships, functions, and policies needed for the system

-- =============================================
-- 1. ENABLE EXTENSIONS
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================
-- 2. CREATE ENUMS
-- =============================================

-- Member tier enum
DO $$ BEGIN
    CREATE TYPE member_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Donation method enum
DO $$ BEGIN
    CREATE TYPE donation_method AS ENUM ('online', 'check', 'cash', 'credit_card', 'bank_transfer');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Event status enum
DO $$ BEGIN
    CREATE TYPE event_status AS ENUM ('draft', 'published', 'active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Registration status enum
DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'attended');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Communication type enum
DO $$ BEGIN
    CREATE TYPE communication_type AS ENUM ('newsletter', 'email_campaign', 'social_media', 'direct_email');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- Automation status enum
DO $$ BEGIN
    CREATE TYPE automation_status AS ENUM ('active', 'paused', 'completed', 'error');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- User role enum
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin_role', 'treasurer_role', 'member_role');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

-- =============================================
-- 3. CREATE CORE TABLES
-- =============================================

-- Members table
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    country VARCHAR(100) DEFAULT 'United States',
    tier member_tier DEFAULT 'bronze',
    total_donated DECIMAL(10,2) DEFAULT 0.00,
    last_donation_date TIMESTAMP WITH TIME ZONE,
    member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    engagement_score INTEGER DEFAULT 0,
    email_subscribed BOOLEAN DEFAULT true,
    sms_subscribed BOOLEAN DEFAULT false,
    newsletter_subscribed BOOLEAN DEFAULT true,
    date_of_birth DATE,
    occupation VARCHAR(100),
    employer VARCHAR(100),
    interests TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Users table for auth
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role DEFAULT 'member_role',
    member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    donation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    method donation_method NOT NULL,
    designation VARCHAR(255) DEFAULT 'General Fund',
    transaction_id VARCHAR(255),
    payment_processor VARCHAR(100),
    processing_fee DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount - processing_fee) STORED,
    receipt_sent BOOLEAN DEFAULT false,
    receipt_sent_date TIMESTAMP WITH TIME ZONE,
    tax_deductible BOOLEAN DEFAULT true,
    receipt_number VARCHAR(100),
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency VARCHAR(50),
    recurring_end_date TIMESTAMP WITH TIME ZONE,
    parent_donation_id UUID REFERENCES donations(id),
    anonymous BOOLEAN DEFAULT false,
    public_acknowledgment BOOLEAN DEFAULT true,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(100),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    venue_name VARCHAR(255),
    venue_address TEXT,
    is_virtual BOOLEAN DEFAULT false,
    virtual_link VARCHAR(500),
    status event_status DEFAULT 'draft',
    capacity INTEGER CHECK (capacity > 0),
    current_registrations INTEGER DEFAULT 0,
    waitlist_enabled BOOLEAN DEFAULT true,
    ticket_price DECIMAL(10,2) DEFAULT 0.00,
    member_discount_percent INTEGER DEFAULT 0 CHECK (member_discount_percent >= 0 AND member_discount_percent <= 100),
    early_bird_price DECIMAL(10,2),
    early_bird_deadline TIMESTAMP WITH TIME ZONE,
    fundraising_goal DECIMAL(10,2),
    total_raised DECIMAL(10,2) DEFAULT 0.00,
    image_url VARCHAR(500),
    requires_approval BOOLEAN DEFAULT false,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    status registration_status DEFAULT 'pending',
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    number_of_guests INTEGER DEFAULT 0,
    total_attendees INTEGER GENERATED ALWAYS AS (1 + number_of_guests) STORED,
    amount_paid DECIMAL(10,2) DEFAULT 0.00,
    payment_method donation_method,
    payment_date TIMESTAMP WITH TIME ZONE,
    checked_in BOOLEAN DEFAULT false,
    check_in_time TIMESTAMP WITH TIME ZONE,
    attended BOOLEAN DEFAULT false,
    dietary_restrictions TEXT,
    special_requests TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(event_id, member_id)
);

-- Communications table
CREATE TABLE IF NOT EXISTS communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type communication_type NOT NULL,
    subject VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    recipient_segments TEXT[] NOT NULL,
    total_recipients INTEGER DEFAULT 0,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_rate DECIMAL(5,2) DEFAULT 0.00,
    open_rate DECIMAL(5,2) DEFAULT 0.00,
    click_rate DECIMAL(5,2) DEFAULT 0.00,
    platform VARCHAR(100),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    from_email VARCHAR(255),
    reply_to_email VARCHAR(255),
    template_id VARCHAR(100),
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Communication recipients table
CREATE TABLE IF NOT EXISTS communication_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    communication_id UUID NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    delivered BOOLEAN DEFAULT false,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened BOOLEAN DEFAULT false,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked BOOLEAN DEFAULT false,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced BOOLEAN DEFAULT false,
    unsubscribed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(communication_id, member_id)
);

-- Automations table
CREATE TABLE IF NOT EXISTS automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(100) NOT NULL,
    trigger_conditions JSONB,
    actions JSONB[] NOT NULL,
    status automation_status DEFAULT 'active',
    last_run TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE,
    run_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Automation logs table
CREATE TABLE IF NOT EXISTS automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    trigger_data JSONB,
    actions_executed JSONB[],
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Member activities table
CREATE TABLE IF NOT EXISTS member_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    activity_type VARCHAR(100) NOT NULL,
    activity_description TEXT,
    activity_value DECIMAL(10,2),
    related_donation_id UUID REFERENCES donations(id) ON DELETE SET NULL,
    related_event_id UUID REFERENCES events(id) ON DELETE SET NULL,
    related_communication_id UUID REFERENCES communications(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Members indexes
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_members_tier ON members(tier);
CREATE INDEX IF NOT EXISTS idx_members_total_donated ON members(total_donated);
CREATE INDEX IF NOT EXISTS idx_members_member_since ON members(member_since);
CREATE INDEX IF NOT EXISTS idx_members_engagement_score ON members(engagement_score);

-- Donations indexes
CREATE INDEX IF NOT EXISTS idx_donations_member_id ON donations(member_id);
CREATE INDEX IF NOT EXISTS idx_donations_date ON donations(donation_date);
CREATE INDEX IF NOT EXISTS idx_donations_amount ON donations(amount);
CREATE INDEX IF NOT EXISTS idx_donations_method ON donations(method);
CREATE INDEX IF NOT EXISTS idx_donations_designation ON donations(designation);

-- Events indexes
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);

-- Event registrations indexes
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_member_id ON event_registrations(member_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(status);
CREATE INDEX IF NOT EXISTS idx_event_registrations_date ON event_registrations(registration_date);

-- Communications indexes
CREATE INDEX IF NOT EXISTS idx_communications_type ON communications(type);
CREATE INDEX IF NOT EXISTS idx_communications_sent_at ON communications(sent_at);

-- Automation indexes
CREATE INDEX IF NOT EXISTS idx_automations_trigger_type ON automations(trigger_type);
CREATE INDEX IF NOT EXISTS idx_automations_status ON automations(status);
CREATE INDEX IF NOT EXISTS idx_automation_logs_automation_id ON automation_logs(automation_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_member_id ON automation_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_automation_logs_created_at ON automation_logs(created_at);

-- Member activities indexes
CREATE INDEX IF NOT EXISTS idx_member_activities_member_id ON member_activities(member_id);
CREATE INDEX IF NOT EXISTS idx_member_activities_type ON member_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_member_activities_created_at ON member_activities(created_at);

-- =============================================
-- 5. CREATE UTILITY FUNCTIONS
-- =============================================

-- Function to calculate member tier based on total donations
CREATE OR REPLACE FUNCTION calculate_member_tier(total_amount DECIMAL)
RETURNS member_tier AS $$
BEGIN
    IF total_amount >= 10000 THEN
        RETURN 'platinum';
    ELSIF total_amount >= 2500 THEN
        RETURN 'gold';
    ELSIF total_amount >= 500 THEN
        RETURN 'silver';
    ELSE
        RETURN 'bronze';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get current user ID
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role
    FROM users
    WHERE id = auth.uid();
    
    RETURN COALESCE(user_role, 'member_role');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update member tier after donation
CREATE OR REPLACE FUNCTION update_member_tier_and_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update member totals and tier
    UPDATE members 
    SET 
        total_donated = (
            SELECT COALESCE(SUM(amount), 0) 
            FROM donations 
            WHERE member_id = NEW.member_id
        ),
        tier = calculate_member_tier((
            SELECT COALESCE(SUM(amount), 0) 
            FROM donations 
            WHERE member_id = NEW.member_id
        )),
        last_donation_date = NEW.donation_date,
        updated_at = NOW()
    WHERE id = NEW.member_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate receipt number
CREATE OR REPLACE FUNCTION generate_receipt_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.receipt_number IS NULL THEN
        NEW.receipt_number = 'RECEIPT-' || TO_CHAR(NEW.donation_date, 'YYYY') || '-' || 
                           LPAD(EXTRACT(DOY FROM NEW.donation_date)::TEXT, 3, '0') || '-' ||
                           LPAD(nextval('receipt_sequence')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 6. CREATE SEQUENCES
-- =============================================

-- Receipt number sequence
CREATE SEQUENCE IF NOT EXISTS receipt_sequence START 1;

-- =============================================
-- 7. CREATE TRIGGERS
-- =============================================

-- Trigger to update member tier after donation insert/update
DROP TRIGGER IF EXISTS trigger_update_member_tier_after_donation ON donations;
CREATE TRIGGER trigger_update_member_tier_after_donation
    AFTER INSERT OR UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_member_tier_and_totals();

-- Triggers to update updated_at timestamps
DROP TRIGGER IF EXISTS trigger_members_updated_at ON members;
CREATE TRIGGER trigger_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_donations_updated_at ON donations;
CREATE TRIGGER trigger_donations_updated_at
    BEFORE UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_events_updated_at ON events;
CREATE TRIGGER trigger_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_event_registrations_updated_at ON event_registrations;
CREATE TRIGGER trigger_event_registrations_updated_at
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_communications_updated_at ON communications;
CREATE TRIGGER trigger_communications_updated_at
    BEFORE UPDATE ON communications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS trigger_automations_updated_at ON automations;
CREATE TRIGGER trigger_automations_updated_at
    BEFORE UPDATE ON automations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to generate receipt numbers
DROP TRIGGER IF EXISTS trigger_generate_receipt_number ON donations;
CREATE TRIGGER trigger_generate_receipt_number
    BEFORE INSERT ON donations
    FOR EACH ROW
    EXECUTE FUNCTION generate_receipt_number();

-- =============================================
-- 8. CREATE ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_activities ENABLE ROW LEVEL SECURITY;

-- Members policies
DROP POLICY IF EXISTS "Admin can view all members" ON members;
CREATE POLICY "Admin can view all members" ON members
    FOR ALL USING (get_user_role() = 'admin_role');

DROP POLICY IF EXISTS "Treasurers can view all members" ON members;
CREATE POLICY "Treasurers can view all members" ON members
    FOR ALL USING (get_user_role() = 'treasurer_role');

DROP POLICY IF EXISTS "Members can view their own profile" ON members;
CREATE POLICY "Members can view their own profile" ON members
    FOR SELECT USING (id = (SELECT member_id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Members can update their own profile" ON members;
CREATE POLICY "Members can update their own profile" ON members
    FOR UPDATE USING (id = (SELECT member_id FROM users WHERE id = auth.uid()));

-- Users policies
DROP POLICY IF EXISTS "Users can view their own user record" ON users;
CREATE POLICY "Users can view their own user record" ON users
    FOR SELECT USING (id = auth.uid());

DROP POLICY IF EXISTS "Admin can manage all users" ON users;
CREATE POLICY "Admin can manage all users" ON users
    FOR ALL USING (get_user_role() = 'admin_role');

-- Donations policies
DROP POLICY IF EXISTS "Admin can view all donations" ON donations;
CREATE POLICY "Admin can view all donations" ON donations
    FOR ALL USING (get_user_role() = 'admin_role');

DROP POLICY IF EXISTS "Treasurers can view all donations" ON donations;
CREATE POLICY "Treasurers can view all donations" ON donations
    FOR ALL USING (get_user_role() = 'treasurer_role');

DROP POLICY IF EXISTS "Members can view their own donations" ON donations;
CREATE POLICY "Members can view their own donations" ON donations
    FOR SELECT USING (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

-- Events policies
DROP POLICY IF EXISTS "Everyone can view published events" ON events;
CREATE POLICY "Everyone can view published events" ON events
    FOR SELECT USING (status IN ('published', 'active'));

DROP POLICY IF EXISTS "Admin can manage all events" ON events;
CREATE POLICY "Admin can manage all events" ON events
    FOR ALL USING (get_user_role() = 'admin_role');

-- Event registrations policies
DROP POLICY IF EXISTS "Admin can view all registrations" ON event_registrations;
CREATE POLICY "Admin can view all registrations" ON event_registrations
    FOR ALL USING (get_user_role() = 'admin_role');

DROP POLICY IF EXISTS "Members can view their own registrations" ON event_registrations;
CREATE POLICY "Members can view their own registrations" ON event_registrations
    FOR SELECT USING (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Members can create their own registrations" ON event_registrations;
CREATE POLICY "Members can create their own registrations" ON event_registrations
    FOR INSERT WITH CHECK (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Members can update their own registrations" ON event_registrations;
CREATE POLICY "Members can update their own registrations" ON event_registrations
    FOR UPDATE USING (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

-- Communications policies
DROP POLICY IF EXISTS "Admin can manage all communications" ON communications;
CREATE POLICY "Admin can manage all communications" ON communications
    FOR ALL USING (get_user_role() = 'admin_role');

DROP POLICY IF EXISTS "Members can view communications sent to them" ON communication_recipients;
CREATE POLICY "Members can view communications sent to them" ON communication_recipients
    FOR SELECT USING (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

-- Automations policies (admin only)
DROP POLICY IF EXISTS "Admin can manage automations" ON automations;
CREATE POLICY "Admin can manage automations" ON automations
    FOR ALL USING (get_user_role() = 'admin_role');

DROP POLICY IF EXISTS "Admin can view automation logs" ON automation_logs;
CREATE POLICY "Admin can view automation logs" ON automation_logs
    FOR ALL USING (get_user_role() = 'admin_role');

-- Member activities policies
DROP POLICY IF EXISTS "Admin can view all activities" ON member_activities;
CREATE POLICY "Admin can view all activities" ON member_activities
    FOR ALL USING (get_user_role() = 'admin_role');

DROP POLICY IF EXISTS "Members can view their own activities" ON member_activities;
CREATE POLICY "Members can view their own activities" ON member_activities
    FOR SELECT USING (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

-- =============================================
-- 9. INSERT DEFAULT DATA
-- =============================================

-- Add unique constraint on automation name to prevent duplicates
DO $$ BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'unique_automation_name'
          AND conrelid = 'automations'::regclass
    ) THEN
        ALTER TABLE automations ADD CONSTRAINT unique_automation_name UNIQUE (name);
    END IF;
END $$;

-- Insert default automations
INSERT INTO automations (name, description, trigger_type, actions, status) VALUES
(
    'Member Onboarding',
    'Welcome sequence for new members',
    'member_registration',
    ARRAY[
        '{"type": "send_email", "template": "welcome", "delay": 0}'::jsonb,
        '{"type": "send_email", "template": "getting_started", "delay": 24}'::jsonb,
        '{"type": "send_email", "template": "community_intro", "delay": 168}'::jsonb
    ],
    'active'
),
(
    'Donation Acknowledgment',
    'Thank you and receipt for donations',
    'donation_received',
    ARRAY[
        '{"type": "send_email", "template": "donation_receipt", "delay": 0}'::jsonb,
        '{"type": "generate_receipt", "delay": 0}'::jsonb
    ],
    'active'
),
(
    'Event Registration Confirmation',
    'Confirmation email for event registrations',
    'event_registration',
    ARRAY[
        '{"type": "send_email", "template": "registration_confirmation", "delay": 0}'::jsonb,
        '{"type": "calendar_invite", "delay": 0}'::jsonb
    ],
    'active'
),
(
    'Event Reminder',
    'Reminder emails before events',
    'event_reminder',
    ARRAY[
        '{"type": "send_email", "template": "event_reminder_week", "delay": -168}'::jsonb,
        '{"type": "send_email", "template": "event_reminder_day", "delay": -24}'::jsonb,
        '{"type": "send_email", "template": "event_reminder_hour", "delay": -1}'::jsonb
    ],
    'active'
),
(
    'Event Check-in',
    'Check-in notifications and welcome messages',
    'event_check_in',
    ARRAY[
        '{"type": "send_email", "template": "event_welcome", "delay": 0}'::jsonb,
        '{"type": "staff_notification", "delay": 0}'::jsonb
    ],
    'active'
),
(
    'Post-event Survey',
    'Follow-up survey and thank you after events',
    'post_event_survey',
    ARRAY[
        '{"type": "send_email", "template": "event_thank_you", "delay": 24}'::jsonb,
        '{"type": "send_survey", "template": "event_feedback", "delay": 48}'::jsonb
    ],
    'active'
)
ON CONFLICT (name) DO NOTHING;

-- =============================================
-- 10. CREATE VIEWS FOR REPORTING
-- =============================================

-- Member summary view
CREATE OR REPLACE VIEW member_summary AS
SELECT 
    m.id,
    m.first_name || ' ' || m.last_name as full_name,
    m.email,
    m.tier,
    m.total_donated,
    m.last_donation_date,
    m.member_since,
    m.engagement_score,
    COUNT(DISTINCT d.id) as donation_count,
    COUNT(DISTINCT er.id) as event_registration_count,
    COUNT(DISTINCT CASE WHEN er.attended = true THEN er.id END) as events_attended,
    COALESCE(AVG(d.amount), 0) as avg_donation_amount,
    MAX(ma.created_at) as last_activity_date
FROM members m
LEFT JOIN donations d ON m.id = d.member_id
LEFT JOIN event_registrations er ON m.id = er.member_id
LEFT JOIN member_activities ma ON m.id = ma.member_id
GROUP BY m.id, m.first_name, m.last_name, m.email, m.tier, m.total_donated, 
         m.last_donation_date, m.member_since, m.engagement_score;

-- Event summary view
CREATE OR REPLACE VIEW event_summary AS
SELECT 
    e.id,
    e.name,
    e.start_date,
    e.end_date,
    e.status,
    e.capacity,
    e.current_registrations,
    e.ticket_price,
    e.total_raised,
    COUNT(DISTINCT er.id) as total_registrations,
    COUNT(DISTINCT CASE WHEN er.status = 'confirmed' THEN er.id END) as confirmed_registrations,
    COUNT(DISTINCT CASE WHEN er.status = 'pending' THEN er.id END) as pending_registrations,
    COUNT(DISTINCT CASE WHEN er.attended = true THEN er.id END) as attendees,
    COALESCE(e.capacity - e.current_registrations, 0) as available_spots
FROM events e
LEFT JOIN event_registrations er ON e.id = er.event_id
GROUP BY e.id, e.name, e.start_date, e.end_date, e.status, e.capacity, 
         e.current_registrations, e.ticket_price, e.total_raised;

-- Donation summary view
CREATE OR REPLACE VIEW donation_summary AS
SELECT 
    DATE_TRUNC('month', donation_date) as month,
    COUNT(*) as donation_count,
    SUM(amount) as total_amount,
    AVG(amount) as avg_amount,
    COUNT(DISTINCT member_id) as unique_donors
FROM donations
GROUP BY DATE_TRUNC('month', donation_date)
ORDER BY month DESC;

-- =============================================
-- 11. GRANT PERMISSIONS
-- =============================================

-- Grant usage on sequences
GRANT USAGE ON SEQUENCE receipt_sequence TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION calculate_member_tier(DECIMAL) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_id() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role() TO authenticated;

-- =============================================
-- 12. FINAL COMMENTS AND NOTES
-- =============================================

-- Database setup complete!
-- 
-- Next steps:
-- 1. Set up your Supabase project authentication
-- 2. Configure your environment variables
-- 3. Add sample data for testing
-- 4. Set up your application with the connection details
--
-- Features included:
-- - Complete member management system
-- - Donation tracking with automated tier calculation
-- - Event management with registration system
-- - Communication and email campaign management
-- - Automation workflows with logging
-- - Row Level Security for data protection
-- - Performance indexes for fast queries
-- - Utility functions and triggers
-- - Comprehensive reporting views
--
-- The system is ready for production use with proper security policies,
-- data integrity constraints, and performance optimizations.

COMMENT ON DATABASE postgres IS 'CCOS Charity Guild Management System Database';

-- =============================================
-- 13. PORTAL DOCUMENTS + PORTAL USER SEED
-- =============================================

-- Portal-ready Supabase setup for CCOS Charity Guild
-- Run after the base schema migrations.

-- Private document library used by the member portal
DO $$ BEGIN
  CREATE TYPE portal_document_type AS ENUM ('minutes', 'form', 'policy', 'other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS portal_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  document_type portal_document_type NOT NULL DEFAULT 'other',
  description TEXT,
  file_name VARCHAR(255) NOT NULL,
  file_path TEXT,
  file_url TEXT,
  uploaded_by VARCHAR(255),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE portal_documents ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Admins can manage portal documents"
    ON portal_documents FOR ALL
    USING (get_user_role() = 'admin_role');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Treasurers can manage portal documents"
    ON portal_documents FOR ALL
    USING (get_user_role() = 'treasurer_role');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Members can read portal documents"
    ON portal_documents FOR SELECT
    USING (get_user_role() = 'member_role');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

INSERT INTO storage.buckets (id, name, public) VALUES ('portal-documents', 'portal-documents', false) ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  CREATE POLICY "Portal docs private read"
    ON storage.objects FOR SELECT
    USING (
      bucket_id = 'portal-documents'
      AND get_user_role() IN ('admin_role', 'treasurer_role', 'member_role')
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Portal docs admin upload"
    ON storage.objects FOR INSERT
    WITH CHECK (
      bucket_id = 'portal-documents'
      AND get_user_role() IN ('admin_role', 'treasurer_role')
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Portal docs admin update"
    ON storage.objects FOR UPDATE
    USING (
      bucket_id = 'portal-documents'
      AND get_user_role() IN ('admin_role', 'treasurer_role')
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Portal docs admin delete"
    ON storage.objects FOR DELETE
    USING (
      bucket_id = 'portal-documents'
      AND get_user_role() IN ('admin_role', 'treasurer_role')
    );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Seed real portal members and operational accounts
WITH portal_seed (email, first_name, last_name, tier, role) AS (
  VALUES
    ('admin@ccoscharityguild.org', 'Admin', '', 'platinum', 'admin_role'),
    ('chuck.schneider@ccoscharityguild.org', 'Chuck', 'Schneider', 'platinum', 'member_role'),
    ('suzanne.and.richard.schultze@ccoscharityguild.org', 'Suzanne', 'and Richard Schultze', 'platinum', 'member_role'),
    ('ana.vargas@ccoscharityguild.org', 'Ana', 'Vargas', 'platinum', 'member_role'),
    ('cathy.and.glen.bradley@ccoscharityguild.org', 'Cathy', 'and Glen Bradley', 'platinum', 'member_role'),
    ('shelly.and.chris.demetree@ccoscharityguild.org', 'Shelly', 'and Chris Demetree', 'platinum', 'member_role'),
    ('melissa.dickens@ccoscharityguild.org', 'Melissa', 'Dickens', 'platinum', 'member_role'),
    ('kristin.and.thomas.golub@ccoscharityguild.org', 'Kristin', 'and Thomas Golub', 'platinum', 'member_role'),
    ('kristin.and.brian.harms@ccoscharityguild.org', 'Kristin', 'and Brian Harms', 'platinum', 'member_role'),
    ('beth.and.andy.wren@ccoscharityguild.org', 'Beth', 'and Andy Wren', 'platinum', 'member_role'),
    ('jan.and.bruce.alonso@ccoscharityguild.org', 'Jan', 'and Bruce Alonso', 'gold', 'member_role'),
    ('bridget.barfield@ccoscharityguild.org', 'Bridget', 'Barfield', 'gold', 'member_role'),
    ('mary.baird.and.david.nelson@ccoscharityguild.org', 'Mary', 'Baird and David Nelson', 'gold', 'member_role'),
    ('pam.and.larry.buckley@ccoscharityguild.org', 'Pam', 'and Larry Buckley', 'gold', 'member_role'),
    ('chris.burson@ccoscharityguild.org', 'Chris', 'Burson', 'gold', 'member_role'),
    ('joyce.and.vince.connolly@ccoscharityguild.org', 'Joyce', 'and Vince Connolly', 'gold', 'member_role'),
    ('mary.and.lance.cunha@ccoscharityguild.org', 'Mary', 'and Lance Cunha', 'gold', 'member_role'),
    ('ruchi.and.manish.dave@ccoscharityguild.org', 'Ruchi', 'and Manish Dave', 'gold', 'member_role'),
    ('julia.and.david.decook@ccoscharityguild.org', 'Julia', 'and David DeCook', 'gold', 'member_role'),
    ('irma.rodriguez.and.fred.fernandez@ccoscharityguild.org', 'Irma', 'Rodriguez and Fred Fernandez', 'gold', 'member_role'),
    ('jennifer.and.gary.gabriel@ccoscharityguild.org', 'Jennifer', 'and Gary Gabriel', 'gold', 'member_role'),
    ('kim.and.john.gehrhardt@ccoscharityguild.org', 'Kim', 'and John Gehrhardt', 'gold', 'member_role'),
    ('julie.samsel.and.benjamin.grimes@ccoscharityguild.org', 'Julie', 'Samsel and Benjamin Grimes', 'gold', 'member_role'),
    ('patrica.grimes@ccoscharityguild.org', 'Patrica', 'Grimes', 'gold', 'member_role'),
    ('candace.and.todd.hickman@ccoscharityguild.org', 'Candace', 'and Todd Hickman', 'gold', 'member_role'),
    ('marjorie.and.michael.keith@ccoscharityguild.org', 'Marjorie', 'and Michael Keith', 'gold', 'member_role'),
    ('diane.and.michael.koehler@ccoscharityguild.org', 'Diane', 'and Michael Koehler', 'gold', 'member_role'),
    ('suzanne.kolb@ccoscharityguild.org', 'Suzanne', 'Kolb', 'gold', 'member_role'),
    ('sally.levan.and.michael.steck@ccoscharityguild.org', 'Sally', 'Levan and Michael Steck', 'gold', 'member_role'),
    ('jill.and.richard.levine@ccoscharityguild.org', 'Jill', 'and Richard Levine', 'gold', 'member_role'),
    ('lani.and.richard.lusk@ccoscharityguild.org', 'Lani', 'and Richard Lusk', 'gold', 'member_role'),
    ('vanessa.and.kirk.mason@ccoscharityguild.org', 'Vanessa', 'and Kirk Mason', 'gold', 'member_role'),
    ('joyce.and.larry.mays@ccoscharityguild.org', 'Joyce', 'and Larry Mays', 'gold', 'member_role'),
    ('jennifer.meyrowitz@ccoscharityguild.org', 'Jennifer', 'Meyrowitz', 'gold', 'member_role'),
    ('meg.middleton@ccoscharityguild.org', 'Meg', 'Middleton', 'gold', 'member_role'),
    ('tracie.and.jeff.nolde@ccoscharityguild.org', 'Tracie', 'and Jeff Nolde', 'gold', 'member_role'),
    ('louise.o.neill@ccoscharityguild.org', 'Louise', 'O''Neill', 'silver', 'member_role'),
    ('lori.and.larry.payne@ccoscharityguild.org', 'Lori', 'and Larry Payne', 'gold', 'member_role'),
    ('k.lee.sherman.and.john.perkins@ccoscharityguild.org', 'K', 'Lee Sherman and John Perkins', 'gold', 'member_role'),
    ('stacey.ramani@ccoscharityguild.org', 'Stacey', 'Ramani', 'silver', 'member_role'),
    ('tracy.and.michael.reidenbach@ccoscharityguild.org', 'Tracy', 'and Michael Reidenbach', 'gold', 'member_role'),
    ('glen.and.debbie.rubin@ccoscharityguild.org', 'Glen', 'and Debbie Rubin', 'gold', 'member_role'),
    ('pam.and.bryant.scott@ccoscharityguild.org', 'Pam', 'and Bryant Scott', 'gold', 'member_role'),
    ('pat.and.mark.seal@ccoscharityguild.org', 'Pat', 'and Mark Seal', 'gold', 'member_role'),
    ('halina.and.aleksander.szlam@ccoscharityguild.org', 'Halina', 'and Aleksander Szlam', 'gold', 'member_role'),
    ('louise.and.william.tallman@ccoscharityguild.org', 'Louise', 'and William Tallman', 'gold', 'member_role'),
    ('chantel.and.rob.taylor@ccoscharityguild.org', 'Chantel', 'and Rob Taylor', 'gold', 'member_role'),
    ('luann.and.tom.via@ccoscharityguild.org', 'LuAnn', 'and Tom Via', 'gold', 'member_role'),
    ('rhonda.and.russ.welch@ccoscharityguild.org', 'Rhonda', 'and Russ Welch', 'gold', 'member_role'),
    ('leslie.and.jeff.wilks@ccoscharityguild.org', 'Leslie', 'and Jeff Wilks', 'silver', 'member_role'),
    ('katherine.and.ed.young@ccoscharityguild.org', 'Katherine', 'and Ed Young', 'gold', 'member_role'),
    ('christine.abbate@ccoscharityguild.org', 'Christine', 'Abbate', 'silver', 'member_role'),
    ('suzanne.and.dennis.antinori@ccoscharityguild.org', 'Suzanne', 'and Dennis Antinori', 'silver', 'member_role'),
    ('avinesh.bhar@ccoscharityguild.org', 'Avinesh', 'Bhar', 'silver', 'member_role'),
    ('maureen.anderson@ccoscharityguild.org', 'Maureen', 'Anderson', 'silver', 'member_role'),
    ('judy.and.john.bardis@ccoscharityguild.org', 'Judy', 'and John Bardis', 'gold', 'member_role'),
    ('james.callahan@ccoscharityguild.org', 'James', 'Callahan', 'silver', 'member_role'),
    ('lisa.and.tom.chambers@ccoscharityguild.org', 'Lisa', 'and Tom Chambers', 'silver', 'member_role'),
    ('dana.and.rob.cochran@ccoscharityguild.org', 'Dana', 'and Rob Cochran', 'silver', 'member_role'),
    ('peggy.and.paul.connors@ccoscharityguild.org', 'Peggy', 'and Paul Connors', 'silver', 'member_role'),
    ('cherlyn.and.neal.corbett@ccoscharityguild.org', 'Cherlyn', 'and Neal Corbett', 'silver', 'member_role'),
    ('ellie.and.christopher.deedy@ccoscharityguild.org', 'Ellie', 'and Christopher Deedy', 'silver', 'member_role'),
    ('christine.and.george.fey@ccoscharityguild.org', 'Christine', 'and George Fey', 'silver', 'member_role'),
    ('kristine.and.phil.finkle@ccoscharityguild.org', 'Kristine', 'and Phil Finkle', 'silver', 'member_role'),
    ('susan.and.lance.friedland@ccoscharityguild.org', 'Susan', 'and Lance Friedland', 'silver', 'member_role'),
    ('pam.and.pete.gebhardt@ccoscharityguild.org', 'Pam', 'and Pete Gebhardt', 'silver', 'member_role'),
    ('donna.and.guy.gill@ccoscharityguild.org', 'Donna', 'and Guy Gill', 'silver', 'member_role'),
    ('lynn.and.jp.gingras@ccoscharityguild.org', 'Lynn', 'and JP Gingras', 'silver', 'member_role'),
    ('tobey.and.ed.gray@ccoscharityguild.org', 'Tobey', 'and Ed Gray', 'silver', 'member_role'),
    ('marcy.and.paul.hirshberg@ccoscharityguild.org', 'Marcy', 'and Paul Hirshberg', 'silver', 'member_role'),
    ('elaine.and.peter.johns@ccoscharityguild.org', 'Elaine', 'and Peter Johns', 'silver', 'member_role'),
    ('whitney.and.hugh.kaplan@ccoscharityguild.org', 'Whitney', 'and Hugh Kaplan', 'silver', 'member_role'),
    ('gol.and.clint.kimbrell@ccoscharityguild.org', 'Gol', 'and Clint Kimbrell', 'silver', 'member_role'),
    ('mary.lynn.and.jb.kurish@ccoscharityguild.org', 'Mary', 'Lynn and JB Kurish', 'silver', 'member_role'),
    ('sissy.and.michael.luciani@ccoscharityguild.org', 'Sissy', 'and Michael Luciani', 'bronze', 'member_role'),
    ('lynne.and.gene.magurno@ccoscharityguild.org', 'Lynne', 'and Gene Magurno', 'silver', 'member_role'),
    ('melinda.marshall@ccoscharityguild.org', 'Melinda', 'Marshall', 'silver', 'member_role'),
    ('sandra.and.patrick.marshall@ccoscharityguild.org', 'Sandra', 'and Patrick Marshall', 'silver', 'member_role'),
    ('connie.and.jim.mcginley@ccoscharityguild.org', 'Connie', 'and Jim McGinley', 'silver', 'member_role'),
    ('paula.and.george.norton@ccoscharityguild.org', 'Paula', 'and George Norton', 'silver', 'member_role'),
    ('yvette.and.tony.norwood@ccoscharityguild.org', 'Yvette', 'and Tony Norwood', 'silver', 'member_role'),
    ('joy.and.bill.prettyman@ccoscharityguild.org', 'Joy', 'and Bill Prettyman', 'gold', 'member_role'),
    ('claire.quinn@ccoscharityguild.org', 'Claire', 'Quinn', 'silver', 'member_role'),
    ('romica.raina@ccoscharityguild.org', 'Romica', 'Raina', 'silver', 'member_role'),
    ('brian.rohner@ccoscharityguild.org', 'Brian', 'Rohner', 'silver', 'member_role'),
    ('debbie.and.glen.rubin@ccoscharityguild.org', 'Debbie', 'and Glen Rubin', 'silver', 'member_role'),
    ('jaclyn.and.john.scarbrough@ccoscharityguild.org', 'Jaclyn', 'and John Scarbrough', 'silver', 'member_role'),
    ('eileen.and.mark.sharitz@ccoscharityguild.org', 'Eileen', 'and Mark Sharitz', 'bronze', 'member_role'),
    ('andrea.and.ken.shelton@ccoscharityguild.org', 'Andrea', 'and Ken Shelton', 'silver', 'member_role'),
    ('lokendra.and.anu.sheth@ccoscharityguild.org', 'Lokendra', 'and Anu Sheth', 'silver', 'member_role'),
    ('kristen.and.trent.speckhals@ccoscharityguild.org', 'Kristen', 'and Trent Speckhals', 'silver', 'member_role'),
    ('kent.and.pam.starke@ccoscharityguild.org', 'Kent', 'and Pam Starke', 'silver', 'member_role'),
    ('shelley.and.dale.stortz@ccoscharityguild.org', 'Shelley', 'and Dale Stortz', 'silver', 'member_role'),
    ('jennifer.and.chad.streetman@ccoscharityguild.org', 'Jennifer', 'and Chad Streetman', 'silver', 'member_role'),
    ('jennifer.and.graham.stroman@ccoscharityguild.org', 'Jennifer', 'and Graham Stroman', 'silver', 'member_role'),
    ('carolyn.and.walter.terry@ccoscharityguild.org', 'Carolyn', 'and Walter Terry', 'silver', 'member_role'),
    ('suzanne.and.bob.thomas@ccoscharityguild.org', 'Suzanne', 'and Bob Thomas', 'silver', 'member_role'),
    ('betty.wolf.and.leroy.anderson@ccoscharityguild.org', 'Betty', 'Wolf and LeRoy Anderson', 'silver', 'member_role'),
    ('tammy.and.todd.antin@ccoscharityguild.org', 'Tammy', 'and Todd Antin', 'bronze', 'member_role'),
    ('erin.and.andrew.armour@ccoscharityguild.org', 'Erin', 'and Andrew Armour', 'bronze', 'member_role'),
    ('terry.and.thomas.backer@ccoscharityguild.org', 'Terry', 'and Thomas Backer', 'bronze', 'member_role'),
    ('amanda.and.mike.blackwelder@ccoscharityguild.org', 'Amanda', 'and Mike Blackwelder', 'bronze', 'member_role'),
    ('andee.blauser@ccoscharityguild.org', 'Andee', 'Blauser', 'bronze', 'member_role'),
    ('susan.sullivan.and.doug.bonk@ccoscharityguild.org', 'Susan', 'Sullivan and Doug Bonk', 'bronze', 'member_role'),
    ('kim.and.kevin.bryan@ccoscharityguild.org', 'Kim', 'and Kevin Bryan', 'bronze', 'member_role'),
    ('michelle.and.ross.carlson@ccoscharityguild.org', 'Michelle', 'and Ross Carlson', 'bronze', 'member_role'),
    ('karen.cox@ccoscharityguild.org', 'Karen', 'Cox', 'bronze', 'member_role'),
    ('caroline.and.ron.cruz@ccoscharityguild.org', 'Caroline', 'and Ron Cruz', 'bronze', 'member_role'),
    ('pam.and.bill.curtice@ccoscharityguild.org', 'Pam', 'and Bill Curtice', 'bronze', 'member_role'),
    ('heather.and.bryan.davis@ccoscharityguild.org', 'Heather', 'and Bryan Davis', 'bronze', 'member_role'),
    ('margaret.demetree@ccoscharityguild.org', 'Margaret', 'Demetree', 'bronze', 'member_role'),
    ('pamela.deritis@ccoscharityguild.org', 'Pamela', 'DeRitis', 'bronze', 'member_role'),
    ('sue.and.steve.foege@ccoscharityguild.org', 'Sue', 'and Steve Foege', 'bronze', 'member_role'),
    ('lyn.and.bob.isaacs@ccoscharityguild.org', 'Lyn', 'and Bob Isaacs', 'bronze', 'member_role'),
    ('catherine.and.bill.johnston@ccoscharityguild.org', 'Catherine', 'and Bill Johnston', 'bronze', 'member_role'),
    ('wendy.and.bob.king@ccoscharityguild.org', 'Wendy', 'and Bob King', 'bronze', 'member_role'),
    ('rebecca.kozycki@ccoscharityguild.org', 'Rebecca', 'Kozycki', 'bronze', 'member_role'),
    ('erin.and.brian.mccarthy@ccoscharityguild.org', 'Erin', 'and Brian McCarthy', 'bronze', 'member_role'),
    ('barbara.and.carlos.miramontes@ccoscharityguild.org', 'Barbara', 'and Carlos Miramontes', 'bronze', 'member_role'),
    ('rebecca.and.kevin.polli@ccoscharityguild.org', 'Rebecca', 'and Kevin Polli', 'bronze', 'member_role'),
    ('kristyn.and.albert.rees@ccoscharityguild.org', 'Kristyn', 'and Albert Rees', 'bronze', 'member_role'),
    ('louise.scott@ccoscharityguild.org', 'Louise', 'Scott', 'bronze', 'member_role'),
    ('kirsten.and.david.stinson@ccoscharityguild.org', 'Kirsten', 'and David Stinson', 'bronze', 'member_role'),
    ('joan.postell.and.lee.trexler@ccoscharityguild.org', 'Joan', 'Postell and Lee Trexler', 'bronze', 'member_role'),
    ('bridget.and.david.rickey@ccoscharityguild.org', 'Bridget', 'and David Rickey', 'bronze', 'member_role'),
    ('ramon.rodriguez@ccoscharityguild.org', 'Ramon', 'Rodriguez', 'bronze', 'member_role'),
    ('dee.and.jay.vallee@ccoscharityguild.org', 'Dee', 'and Jay Vallee', 'bronze', 'member_role'),
    ('bradley.keeter@ccoscharityguild.org', 'Bradley', 'Keeter', 'platinum', 'member_role'),
    ('kinskey.family@ccoscharityguild.org', 'Kinskey', 'family', 'platinum', 'member_role'),
    ('douglas.ross@ccoscharityguild.org', 'Douglas', 'Ross', 'platinum', 'member_role'),
    ('becky.and.roger.brown@ccoscharityguild.org', 'Becky', 'and Roger Brown', 'gold', 'member_role'),
    ('kerri.and.mark.friedman@ccoscharityguild.org', 'Kerri', 'and Mark Friedman', 'gold', 'member_role'),
    ('ken.gary@ccoscharityguild.org', 'Ken', 'Gary', 'gold', 'member_role'),
    ('susie.and.michael.greenberg@ccoscharityguild.org', 'Susie', 'and Michael Greenberg', 'silver', 'member_role'),
    ('beth.hausmann@ccoscharityguild.org', 'Beth', 'Hausmann', 'gold', 'member_role'),
    ('jennifer.and.barry.meyrowitz@ccoscharityguild.org', 'Jennifer', 'and Barry Meyrowitz', 'gold', 'member_role'),
    ('konni.and.jon.minter@ccoscharityguild.org', 'Konni', 'and Jon Minter', 'gold', 'member_role'),
    ('stephanie.and.dan.moody@ccoscharityguild.org', 'Stephanie', 'and Dan Moody', 'gold', 'member_role'),
    ('carol.and.van.page@ccoscharityguild.org', 'Carol', 'and Van Page', 'gold', 'member_role'),
    ('marianne.and.winfried.johnson.rank@ccoscharityguild.org', 'Marianne', 'and Winfried Johnson-Rank', 'gold', 'member_role'),
    ('zamira.and.john.rasper@ccoscharityguild.org', 'Zamira', 'and John Rasper', 'gold', 'member_role'),
    ('beth.and.john.scarbrough@ccoscharityguild.org', 'Beth', 'and John Scarbrough', 'gold', 'member_role'),
    ('kathy.and.scott.solomon@ccoscharityguild.org', 'Kathy', 'and Scott Solomon', 'gold', 'member_role'),
    ('salli.levan.and.michael.steck@ccoscharityguild.org', 'Salli', 'LeVan and Michael Steck', 'gold', 'member_role'),
    ('barbara.and.scott.stevens@ccoscharityguild.org', 'Barbara', 'and Scott Stevens', 'gold', 'member_role'),
    ('rhonda.and.russell.welch@ccoscharityguild.org', 'Rhonda', 'and Russell Welch', 'gold', 'member_role'),
    ('vivienne.and.mark.avetoom@ccoscharityguild.org', 'Vivienne', 'and Mark Avetoom', 'silver', 'member_role'),
    ('tricia.and.mike.bennett@ccoscharityguild.org', 'Tricia', 'and Mike Bennett', 'silver', 'member_role'),
    ('kimberly.and.clydall.bobb@ccoscharityguild.org', 'Kimberly', 'and Clydall Bobb', 'silver', 'member_role'),
    ('cynthia.and.robert.bowers@ccoscharityguild.org', 'Cynthia', 'and Robert Bowers', 'silver', 'member_role'),
    ('karri.bunn.holley@ccoscharityguild.org', 'Karri', 'Bunn Holley', 'silver', 'member_role'),
    ('sandie.and.craig.cappai@ccoscharityguild.org', 'Sandie', 'and Craig Cappai', 'silver', 'member_role'),
    ('ann.chapman@ccoscharityguild.org', 'Ann', 'Chapman', 'silver', 'member_role'),
    ('heidi.cohen.brugliera.and.gary.brugliera@ccoscharityguild.org', 'Heidi', 'Cohen-Brugliera and Gary Brugliera', 'silver', 'member_role'),
    ('marie.and.kyle.cooper@ccoscharityguild.org', 'Marie', 'and Kyle Cooper', 'silver', 'member_role'),
    ('marcelle.decuir@ccoscharityguild.org', 'Marcelle', 'DeCuir', 'silver', 'member_role'),
    ('barbara.flandreau@ccoscharityguild.org', 'Barbara', 'Flandreau', 'silver', 'member_role'),
    ('deirdre.and.ken.greenfield@ccoscharityguild.org', 'Deirdre', 'and Ken Greenfield', 'silver', 'member_role'),
    ('tracy.and.allen.hobbs@ccoscharityguild.org', 'Tracy', 'and Allen Hobbs', 'silver', 'member_role'),
    ('kathy.and.rob.hoddeson@ccoscharityguild.org', 'Kathy', 'and Rob Hoddeson', 'silver', 'member_role'),
    ('kausar.and.michael.kenning@ccoscharityguild.org', 'Kausar', 'and Michael Kenning', 'silver', 'member_role'),
    ('mary.lyn.and.jb.kurish@ccoscharityguild.org', 'Mary', 'Lyn and JB Kurish', 'silver', 'member_role'),
    ('jacqueline.and.keith.large@ccoscharityguild.org', 'Jacqueline', 'and Keith Large', 'silver', 'member_role'),
    ('allison.and.andy.loetscher@ccoscharityguild.org', 'Allison', 'and Andy Loetscher', 'silver', 'member_role'),
    ('julie.maurer@ccoscharityguild.org', 'Julie', 'Maurer', 'silver', 'member_role'),
    ('yvette.and.tony.mendez.norwood@ccoscharityguild.org', 'Yvette', 'and Tony Mendez-Norwood', 'silver', 'member_role'),
    ('monica.and.ric.murray@ccoscharityguild.org', 'Monica', 'and Ric Murray', 'silver', 'member_role'),
    ('yara.parada.aguirre@ccoscharityguild.org', 'Yara', 'Parada-Aguirre', 'silver', 'member_role'),
    ('karishma.kothari.and.kushal.patel@ccoscharityguild.org', 'Karishma', 'Kothari and Kushal Patel', 'silver', 'member_role'),
    ('jen.and.mike.passilla@ccoscharityguild.org', 'Jen', 'and Mike Passilla', 'silver', 'member_role'),
    ('heather.and.tim.perry@ccoscharityguild.org', 'Heather', 'and Tim Perry', 'silver', 'member_role'),
    ('rebecca.and.phil.rochester@ccoscharityguild.org', 'Rebecca', 'and Phil Rochester', 'silver', 'member_role'),
    ('megan.and.bob.ross@ccoscharityguild.org', 'Megan', 'and Bob Ross', 'silver', 'member_role'),
    ('lynn.and.rick.schultz@ccoscharityguild.org', 'Lynn', 'and Rick Schultz', 'silver', 'member_role'),
    ('anu.and.lokendra.sheth@ccoscharityguild.org', 'Anu', 'and Lokendra Sheth', 'bronze', 'member_role'),
    ('stephanie.and.andrew.shearer@ccoscharityguild.org', 'Stephanie', 'and Andrew Shearer', 'silver', 'member_role'),
    ('kristin.and.trent.speckhals@ccoscharityguild.org', 'Kristin', 'and Trent Speckhals', 'silver', 'member_role'),
    ('cathy.and.majdi.suleiman@ccoscharityguild.org', 'Cathy', 'and Majdi Suleiman', 'silver', 'member_role'),
    ('denise.templeton@ccoscharityguild.org', 'Denise', 'Templeton', 'silver', 'member_role'),
    ('suzanne.and.robert.thomas@ccoscharityguild.org', 'Suzanne', 'and Robert Thomas', 'silver', 'member_role'),
    ('anne.and.al.tiano@ccoscharityguild.org', 'Anne', 'and Al Tiano', 'silver', 'member_role'),
    ('tina.and.thomas.tromiczak@ccoscharityguild.org', 'Tina', 'and Thomas Tromiczak', 'silver', 'member_role'),
    ('sarah.weyl@ccoscharityguild.org', 'Sarah', 'Weyl', 'silver', 'member_role'),
    ('chenab.and.sunny.aiya@ccoscharityguild.org', 'Chenab', 'and Sunny Aiya', 'bronze', 'member_role'),
    ('kat.and.michael.anderson@ccoscharityguild.org', 'Kat', 'and Michael Anderson', 'bronze', 'member_role'),
    ('jennifer.and.nate.browne@ccoscharityguild.org', 'Jennifer', 'and Nate Browne', 'bronze', 'member_role'),
    ('barbara.young.and.bennett.bruckner@ccoscharityguild.org', 'Barbara', 'Young and Bennett Bruckner', 'bronze', 'member_role'),
    ('julie.and.warren.carson@ccoscharityguild.org', 'Julie', 'and Warren Carson', 'bronze', 'member_role'),
    ('dana.cochran@ccoscharityguild.org', 'Dana', 'Cochran', 'bronze', 'member_role'),
    ('randolph.cochran@ccoscharityguild.org', 'Randolph', 'Cochran', 'bronze', 'member_role'),
    ('sonya.dane@ccoscharityguild.org', 'Sonya', 'Dane', 'bronze', 'member_role'),
    ('monica.davis.and.richard.alford@ccoscharityguild.org', 'Monica', 'Davis and Richard Alford', 'bronze', 'member_role'),
    ('ellie.and.chris.deedy@ccoscharityguild.org', 'Ellie', 'and Chris Deedy', 'bronze', 'member_role'),
    ('claire.demetree@ccoscharityguild.org', 'Claire', 'Demetree', 'bronze', 'member_role'),
    ('phillip.dopson@ccoscharityguild.org', 'Phillip', 'Dopson', 'bronze', 'member_role'),
    ('bradley.ellis@ccoscharityguild.org', 'Bradley', 'Ellis', 'bronze', 'member_role'),
    ('catherine.foley@ccoscharityguild.org', 'Catherine', 'Foley', 'bronze', 'member_role'),
    ('maggie.goldman@ccoscharityguild.org', 'Maggie', 'Goldman', 'bronze', 'member_role'),
    ('cathy.and.bill.johnston@ccoscharityguild.org', 'Cathy', 'and Bill Johnston', 'bronze', 'member_role'),
    ('carla.and.grantley.joseph@ccoscharityguild.org', 'Carla', 'and Grantley Joseph', 'bronze', 'member_role'),
    ('mary.beth.kennedy@ccoscharityguild.org', 'Mary', 'Beth Kennedy', 'bronze', 'member_role'),
    ('ryann.and.scott.kennedy@ccoscharityguild.org', 'Ryann', 'and Scott Kennedy', 'bronze', 'member_role'),
    ('lauren.kermani@ccoscharityguild.org', 'Lauren', 'Kermani', 'bronze', 'member_role'),
    ('meghan.and.kam.mccarthy@ccoscharityguild.org', 'Meghan', 'and Kam McCarthy', 'bronze', 'member_role'),
    ('marla.and.greg.milano@ccoscharityguild.org', 'Marla', 'and Greg Milano', 'bronze', 'member_role'),
    ('colleen.nilan@ccoscharityguild.org', 'Colleen', 'Nilan', 'bronze', 'member_role'),
    ('marissa.pendegraft@ccoscharityguild.org', 'Marissa', 'Pendegraft', 'bronze', 'member_role'),
    ('jennifer.and.david.ray@ccoscharityguild.org', 'Jennifer', 'and David Ray', 'bronze', 'member_role'),
    ('nancy.and.marion.rhine@ccoscharityguild.org', 'Nancy', 'and Marion Rhine', 'bronze', 'member_role'),
    ('kevin.ryan@ccoscharityguild.org', 'Kevin', 'Ryan', 'bronze', 'member_role'),
    ('melanie.sanders@ccoscharityguild.org', 'Melanie', 'Sanders', 'bronze', 'member_role'),
    ('ann.and.jesse.seidman@ccoscharityguild.org', 'Ann', 'and Jesse Seidman', 'bronze', 'member_role'),
    ('paulette.and.carter.simpson@ccoscharityguild.org', 'Paulette', 'and Carter Simpson', 'bronze', 'member_role'),
    ('beth.and.jonathan.speigner@ccoscharityguild.org', 'Beth', 'and Jonathan Speigner', 'bronze', 'member_role'),
    ('carter.spriggs@ccoscharityguild.org', 'Carter', 'Spriggs', 'bronze', 'member_role'),
    ('holly.and.rami.suleiman@ccoscharityguild.org', 'Holly', 'and Rami Suleiman', 'bronze', 'member_role'),
    ('nicole.vereen.and.steve.siegner@ccoscharityguild.org', 'Nicole', 'Vereen and Steve Siegner', 'bronze', 'member_role'),
    ('gina.and.sharad.virmani@ccoscharityguild.org', 'Gina', 'and Sharad Virmani', 'bronze', 'member_role'),
    ('mike.wells@ccoscharityguild.org', 'Mike', 'Wells', 'bronze', 'member_role')
), upserted_members AS (
  INSERT INTO members (email, first_name, last_name, tier, total_donated, engagement_score, email_subscribed, sms_subscribed, newsletter_subscribed, country)
  SELECT
    email,
    first_name,
    last_name,
    tier::member_tier,
    0,
    0,
    true,
    false,
    true,
    'United States'
  FROM portal_seed
  ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    tier = EXCLUDED.tier,
    updated_at = NOW()
  RETURNING id, email
)
INSERT INTO users (id, email, role, member_id)
SELECT
  gen_random_uuid(),
  ps.email,
  ps.role::user_role,
  m.id
FROM portal_seed ps
JOIN members m ON m.email = ps.email
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  member_id = EXCLUDED.member_id,
  updated_at = NOW();

-- Optional admin account already exists in the users table and member profile seed.
