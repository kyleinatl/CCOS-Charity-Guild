-- CCOS Charity Guild Database Schema
-- Comprehensive nonprofit management system database

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE member_tier AS ENUM ('bronze', 'silver', 'gold', 'platinum');
CREATE TYPE donation_method AS ENUM ('online', 'check', 'cash', 'credit_card', 'bank_transfer');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'active', 'completed', 'cancelled');
CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'attended');
CREATE TYPE communication_type AS ENUM ('newsletter', 'email_campaign', 'social_media', 'direct_email');
CREATE TYPE automation_status AS ENUM ('active', 'paused', 'completed', 'error');

-- Members table - Core member management
CREATE TABLE members (
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
    
    -- Member status and tier
    tier member_tier DEFAULT 'bronze',
    total_donated DECIMAL(10,2) DEFAULT 0,
    last_donation_date TIMESTAMP WITH TIME ZONE,
    member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Engagement tracking
    engagement_score INTEGER DEFAULT 0,
    email_subscribed BOOLEAN DEFAULT true,
    sms_subscribed BOOLEAN DEFAULT false,
    newsletter_subscribed BOOLEAN DEFAULT true,
    
    -- Profile information
    date_of_birth DATE,
    occupation VARCHAR(100),
    employer VARCHAR(100),
    interests TEXT[],
    notes TEXT,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Donations table - Track all donations and payments
CREATE TABLE donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    
    -- Donation details
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    donation_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    method donation_method NOT NULL,
    designation VARCHAR(255) DEFAULT 'General Fund',
    
    -- Payment processing
    transaction_id VARCHAR(255),
    payment_processor VARCHAR(50),
    processing_fee DECIMAL(10,2) DEFAULT 0,
    net_amount DECIMAL(10,2) GENERATED ALWAYS AS (amount - processing_fee) STORED,
    
    -- Tax receipt information
    receipt_sent BOOLEAN DEFAULT false,
    receipt_sent_date TIMESTAMP WITH TIME ZONE,
    tax_deductible BOOLEAN DEFAULT true,
    receipt_number VARCHAR(50),
    
    -- Recurring donation details
    is_recurring BOOLEAN DEFAULT false,
    recurring_frequency VARCHAR(20), -- monthly, quarterly, yearly
    recurring_end_date DATE,
    parent_donation_id UUID REFERENCES donations(id),
    
    -- Additional information
    anonymous BOOLEAN DEFAULT false,
    public_acknowledgment BOOLEAN DEFAULT true,
    notes TEXT,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    
    -- Ensure recurring donations have frequency
    CONSTRAINT recurring_frequency_check CHECK (
        (is_recurring = false) OR 
        (is_recurring = true AND recurring_frequency IS NOT NULL)
    )
);

-- Events table - Manage all events and fundraisers
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(100), -- fundraiser, social, meeting, workshop
    
    -- Event scheduling
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    registration_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Location details
    venue_name VARCHAR(255),
    venue_address TEXT,
    is_virtual BOOLEAN DEFAULT false,
    virtual_link VARCHAR(500),
    
    -- Event management
    status event_status DEFAULT 'draft',
    capacity INTEGER,
    current_registrations INTEGER DEFAULT 0,
    waitlist_enabled BOOLEAN DEFAULT false,
    
    -- Pricing
    ticket_price DECIMAL(10,2) DEFAULT 0,
    member_discount_percent INTEGER DEFAULT 0,
    early_bird_price DECIMAL(10,2),
    early_bird_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Event goals and tracking
    fundraising_goal DECIMAL(10,2),
    total_raised DECIMAL(10,2) DEFAULT 0,
    
    -- Additional information
    image_url VARCHAR(500),
    requires_approval BOOLEAN DEFAULT false,
    tags TEXT[],
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    updated_by UUID
);

-- Event registrations table - Track who's attending events
CREATE TABLE event_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    
    -- Registration details
    status registration_status DEFAULT 'pending',
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    number_of_guests INTEGER DEFAULT 0,
    total_attendees INTEGER GENERATED ALWAYS AS (1 + number_of_guests) STORED,
    
    -- Payment information
    amount_paid DECIMAL(10,2) DEFAULT 0,
    payment_method donation_method,
    payment_date TIMESTAMP WITH TIME ZONE,
    
    -- Event day tracking
    checked_in BOOLEAN DEFAULT false,
    check_in_time TIMESTAMP WITH TIME ZONE,
    attended BOOLEAN DEFAULT false,
    
    -- Additional information
    dietary_restrictions TEXT,
    special_requests TEXT,
    notes TEXT,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure unique registration per member per event
    UNIQUE(event_id, member_id)
);

-- Communications table - Track all communications sent
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type communication_type NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    
    -- Targeting
    recipient_segments TEXT[], -- all, bronze, silver, gold, platinum, custom
    total_recipients INTEGER DEFAULT 0,
    
    -- Delivery tracking
    sent_at TIMESTAMP WITH TIME ZONE,
    delivery_rate DECIMAL(5,2) DEFAULT 0, -- percentage
    open_rate DECIMAL(5,2) DEFAULT 0,
    click_rate DECIMAL(5,2) DEFAULT 0,
    
    -- Social media specific
    platform VARCHAR(50), -- facebook, instagram, twitter, linkedin
    scheduled_for TIMESTAMP WITH TIME ZONE,
    
    -- Email specific
    from_email VARCHAR(255),
    reply_to_email VARCHAR(255),
    
    -- Content management
    template_id UUID,
    tags TEXT[],
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Communication recipients table - Track individual delivery status
CREATE TABLE communication_recipients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    communication_id UUID NOT NULL REFERENCES communications(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    
    -- Delivery tracking
    delivered BOOLEAN DEFAULT false,
    delivered_at TIMESTAMP WITH TIME ZONE,
    opened BOOLEAN DEFAULT false,
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked BOOLEAN DEFAULT false,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounced BOOLEAN DEFAULT false,
    unsubscribed BOOLEAN DEFAULT false,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(communication_id, member_id)
);

-- Automations table - Manage automated workflows
CREATE TABLE automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Trigger configuration
    trigger_type VARCHAR(100) NOT NULL, -- new_member, donation_received, event_registration
    trigger_conditions JSONB, -- flexible conditions storage
    
    -- Actions configuration
    actions JSONB NOT NULL, -- array of actions to perform
    
    -- Status and scheduling
    status automation_status DEFAULT 'active',
    last_run TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE,
    run_count INTEGER DEFAULT 0,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);

-- Automation logs table - Track automation execution
CREATE TABLE automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID NOT NULL REFERENCES automations(id) ON DELETE CASCADE,
    member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    
    -- Execution details
    trigger_data JSONB,
    actions_executed JSONB,
    success BOOLEAN DEFAULT true,
    error_message TEXT,
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Member engagement activities table - Track all member interactions
CREATE TABLE member_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
    
    -- Activity details
    activity_type VARCHAR(100) NOT NULL, -- donation, event_registration, email_open, etc.
    activity_description TEXT,
    activity_value DECIMAL(10,2), -- donation amount, engagement points, etc.
    
    -- References to related records
    related_donation_id UUID REFERENCES donations(id),
    related_event_id UUID REFERENCES events(id),
    related_communication_id UUID REFERENCES communications(id),
    
    -- System fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_tier ON members(tier);
CREATE INDEX idx_members_total_donated ON members(total_donated);
CREATE INDEX idx_members_created_at ON members(created_at);

CREATE INDEX idx_donations_member_id ON donations(member_id);
CREATE INDEX idx_donations_date ON donations(donation_date);
CREATE INDEX idx_donations_amount ON donations(amount);
CREATE INDEX idx_donations_method ON donations(method);
CREATE INDEX idx_donations_recurring ON donations(is_recurring);

CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_created_at ON events(created_at);

CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX idx_event_registrations_member_id ON event_registrations(member_id);
CREATE INDEX idx_event_registrations_status ON event_registrations(status);

CREATE INDEX idx_communications_type ON communications(type);
CREATE INDEX idx_communications_sent_at ON communications(sent_at);

CREATE INDEX idx_member_activities_member_id ON member_activities(member_id);
CREATE INDEX idx_member_activities_type ON member_activities(activity_type);
CREATE INDEX idx_member_activities_created_at ON member_activities(created_at);

-- Create functions for tier calculation and updates
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

-- Function to update member totals and tier
CREATE OR REPLACE FUNCTION update_member_donation_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update member totals and tier on donation insert/update
    UPDATE members 
    SET 
        total_donated = (
            SELECT COALESCE(SUM(amount), 0) 
            FROM donations 
            WHERE member_id = COALESCE(NEW.member_id, OLD.member_id)
        ),
        tier = calculate_member_tier((
            SELECT COALESCE(SUM(amount), 0) 
            FROM donations 
            WHERE member_id = COALESCE(NEW.member_id, OLD.member_id)
        )),
        last_donation_date = (
            SELECT MAX(donation_date) 
            FROM donations 
            WHERE member_id = COALESCE(NEW.member_id, OLD.member_id)
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.member_id, OLD.member_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update event registration counts
CREATE OR REPLACE FUNCTION update_event_registration_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update event current registrations
    UPDATE events 
    SET current_registrations = (
        SELECT COUNT(*) 
        FROM event_registrations 
        WHERE event_id = COALESCE(NEW.event_id, OLD.event_id) 
        AND status IN ('confirmed', 'attended')
    )
    WHERE id = COALESCE(NEW.event_id, OLD.event_id);
    
    RETURN COALESCE(NEW, OLD);
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

-- Create triggers
CREATE TRIGGER trigger_update_member_totals
    AFTER INSERT OR UPDATE OR DELETE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_member_donation_totals();

CREATE TRIGGER trigger_update_event_registrations
    AFTER INSERT OR UPDATE OR DELETE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_event_registration_count();

-- Update timestamp triggers
CREATE TRIGGER trigger_members_updated_at
    BEFORE UPDATE ON members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_donations_updated_at
    BEFORE UPDATE ON donations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_event_registrations_updated_at
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_communications_updated_at
    BEFORE UPDATE ON communications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_automations_updated_at
    BEFORE UPDATE ON automations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();