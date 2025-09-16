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
CREATE TYPE member_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');

-- Donation method enum
CREATE TYPE donation_method AS ENUM ('online', 'check', 'cash', 'credit_card', 'bank_transfer');

-- Event status enum
CREATE TYPE event_status AS ENUM ('draft', 'published', 'active', 'completed', 'cancelled');

-- Registration status enum
CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'attended');

-- Communication type enum
CREATE TYPE communication_type AS ENUM ('newsletter', 'email_campaign', 'social_media', 'direct_email');

-- Automation status enum
CREATE TYPE automation_status AS ENUM ('active', 'paused', 'completed', 'error');

-- User role enum
CREATE TYPE user_role AS ENUM ('admin_role', 'treasurer_role', 'member_role');

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
    ELSIF total_amount >= 5000 THEN
        RETURN 'gold';
    ELSIF total_amount >= 1000 THEN
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
CREATE TRIGGER trigger_update_member_tier_after_donation
    AFTER INSERT OR UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_member_tier_and_totals();

-- Triggers to update updated_at timestamps
CREATE TRIGGER trigger_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_donations_updated_at
    BEFORE UPDATE ON donations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_event_registrations_updated_at
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_communications_updated_at
    BEFORE UPDATE ON communications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_automations_updated_at
    BEFORE UPDATE ON automations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to generate receipt numbers
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
CREATE POLICY "Admin can view all members" ON members
    FOR ALL USING (get_user_role() = 'admin_role');

CREATE POLICY "Treasurers can view all members" ON members
    FOR ALL USING (get_user_role() = 'treasurer_role');

CREATE POLICY "Members can view their own profile" ON members
    FOR SELECT USING (id = (SELECT member_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Members can update their own profile" ON members
    FOR UPDATE USING (id = (SELECT member_id FROM users WHERE id = auth.uid()));

-- Users policies
CREATE POLICY "Users can view their own user record" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Admin can manage all users" ON users
    FOR ALL USING (get_user_role() = 'admin_role');

-- Donations policies
CREATE POLICY "Admin can view all donations" ON donations
    FOR ALL USING (get_user_role() = 'admin_role');

CREATE POLICY "Treasurers can view all donations" ON donations
    FOR ALL USING (get_user_role() = 'treasurer_role');

CREATE POLICY "Members can view their own donations" ON donations
    FOR SELECT USING (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

-- Events policies
CREATE POLICY "Everyone can view published events" ON events
    FOR SELECT USING (status IN ('published', 'active'));

CREATE POLICY "Admin can manage all events" ON events
    FOR ALL USING (get_user_role() = 'admin_role');

-- Event registrations policies
CREATE POLICY "Admin can view all registrations" ON event_registrations
    FOR ALL USING (get_user_role() = 'admin_role');

CREATE POLICY "Members can view their own registrations" ON event_registrations
    FOR SELECT USING (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Members can create their own registrations" ON event_registrations
    FOR INSERT WITH CHECK (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

CREATE POLICY "Members can update their own registrations" ON event_registrations
    FOR UPDATE USING (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

-- Communications policies
CREATE POLICY "Admin can manage all communications" ON communications
    FOR ALL USING (get_user_role() = 'admin_role');

CREATE POLICY "Members can view communications sent to them" ON communication_recipients
    FOR SELECT USING (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

-- Automations policies (admin only)
CREATE POLICY "Admin can manage automations" ON automations
    FOR ALL USING (get_user_role() = 'admin_role');

CREATE POLICY "Admin can view automation logs" ON automation_logs
    FOR ALL USING (get_user_role() = 'admin_role');

-- Member activities policies
CREATE POLICY "Admin can view all activities" ON member_activities
    FOR ALL USING (get_user_role() = 'admin_role');

CREATE POLICY "Members can view their own activities" ON member_activities
    FOR SELECT USING (member_id = (SELECT member_id FROM users WHERE id = auth.uid()));

-- =============================================
-- 9. INSERT DEFAULT DATA
-- =============================================

-- Add unique constraint on automation name to prevent duplicates
ALTER TABLE automations ADD CONSTRAINT unique_automation_name UNIQUE (name);

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