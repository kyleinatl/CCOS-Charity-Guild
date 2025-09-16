-- Update events table to match API requirements
-- Add missing fields used in the event management system

-- Add registration_status enum for event registrations
DO $$ BEGIN
    CREATE TYPE registration_status AS ENUM ('pending', 'confirmed', 'cancelled', 'attended', 'no_show');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update events table with missing fields
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS virtual_meeting_url TEXT,
ADD COLUMN IF NOT EXISTS registration_fee DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS requirements TEXT,
ADD COLUMN IF NOT EXISTS agenda TEXT,
ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(20);

-- Rename virtual_link to virtual_meeting_url if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'events' AND column_name = 'virtual_link') THEN
        ALTER TABLE events RENAME COLUMN virtual_link TO virtual_meeting_url_old;
    END IF;
END $$;

-- Ensure event_registrations table has no_show status
DO $$ 
BEGIN
    -- Check if no_show already exists in the enum
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'no_show' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'registration_status')) THEN
        ALTER TYPE registration_status ADD VALUE 'no_show';
    END IF;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Update event_registrations table for better compatibility
ALTER TABLE event_registrations 
DROP COLUMN IF EXISTS checked_in,
DROP COLUMN IF EXISTS check_in_time,
DROP COLUMN IF EXISTS attended,
DROP COLUMN IF EXISTS amount_paid,
DROP COLUMN IF EXISTS payment_method,
DROP COLUMN IF EXISTS payment_date;

-- Add updated_at column to event_registrations if missing
ALTER TABLE event_registrations 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create updated trigger for event_registrations updated_at
DROP TRIGGER IF EXISTS trigger_event_registrations_updated_at ON event_registrations;
CREATE TRIGGER trigger_event_registrations_updated_at
    BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Ensure proper indexing for the new fields
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_is_virtual ON events(is_virtual);
CREATE INDEX IF NOT EXISTS idx_events_registration_deadline ON events(registration_deadline);

-- Update the event registration count function to handle no_show status
CREATE OR REPLACE FUNCTION update_event_registration_count()
RETURNS TRIGGER AS $$
BEGIN
    -- Update event current registrations (count confirmed and attended registrations)
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

-- Add some sample event data for testing
INSERT INTO events (
    name, 
    description, 
    event_type, 
    start_date, 
    end_date, 
    location, 
    is_virtual, 
    status, 
    capacity, 
    registration_fee,
    requirements,
    contact_email
) VALUES 
(
    'Annual Charity Gala', 
    'Join us for our biggest fundraising event of the year featuring dinner, entertainment, and silent auction.',
    'fundraiser',
    NOW() + INTERVAL '30 days',
    NOW() + INTERVAL '30 days' + INTERVAL '4 hours',
    'Grand Ballroom, Downtown Convention Center',
    false,
    'published',
    200,
    150.00,
    'Formal attire required. Must be 18+ to attend.',
    'events@ccoscharity.org'
),
(
    'Virtual Volunteer Training',
    'Learn about our programs and how you can make a difference in the community.',
    'volunteer',
    NOW() + INTERVAL '14 days',
    NOW() + INTERVAL '14 days' + INTERVAL '2 hours',
    null,
    true,
    'published',
    50,
    0,
    'No prior experience necessary. Computer with internet required.',
    'volunteer@ccoscharity.org'
),
(
    'Community Cleanup Day',
    'Help us make our neighborhoods cleaner and greener. All supplies provided.',
    'community',
    NOW() + INTERVAL '21 days',
    NOW() + INTERVAL '21 days' + INTERVAL '6 hours',
    'Riverside Park, Main Street Entrance',
    false,
    'published',
    100,
    0,
    'Comfortable clothes and closed-toe shoes required. Gloves provided.',
    'community@ccoscharity.org'
);

-- Update virtual meeting URL for virtual event
UPDATE events 
SET virtual_meeting_url = 'https://zoom.us/j/123456789?pwd=example'
WHERE is_virtual = true;

-- Insert sample communications for testing
INSERT INTO communications (
    type,
    subject,
    content,
    recipient_segments,
    total_recipients,
    sent_at,
    delivery_rate,
    open_rate,
    click_rate,
    from_email,
    reply_to_email,
    tags
) VALUES 
(
    'newsletter',
    'Monthly Newsletter - November 2025',
    'Dear Members,

Thank you for your continued support! This month we have exciting updates to share:

🎉 Annual Charity Gala - Join us for our biggest fundraising event
📚 New Educational Programs - Learn about our community initiatives  
💝 Recent Impact - See how your donations are making a difference

Best regards,
The CCOS Charity Guild Team',
    ARRAY['all'],
    150,
    NOW() - INTERVAL '5 days',
    94.5,
    28.7,
    12.3,
    'newsletter@ccoscharity.org',
    'info@ccoscharity.org',
    ARRAY['newsletter', 'monthly', 'updates']
),
(
    'email_campaign',
    'Last Chance: Annual Gala Early Bird Tickets',
    'Don''t miss out! Early bird pricing for our Annual Charity Gala ends this Friday.

🎭 Entertainment, dinner, and silent auction
💰 Early bird: $150 (regular: $200)
📅 December 15th, 6:00 PM
📍 Grand Ballroom, Downtown Convention Center

Reserve your tickets now and save $50!',
    ARRAY['gold', 'platinum', 'recent_donors'],
    85,
    NOW() - INTERVAL '2 days',
    96.2,
    42.1,
    18.7,
    'events@ccoscharity.org',
    'events@ccoscharity.org',
    ARRAY['gala', 'fundraiser', 'early-bird']
),
(
    'direct_email',
    'Thank You for Your Recent Donation',
    'Dear {first_name},

Thank you so much for your generous donation of ${amount} to CCOS Charity Guild.

Your contribution helps us:
- Support local families in need
- Fund educational programs  
- Maintain community resources

We truly appreciate your commitment to making a difference in our community.

With gratitude,
Sarah Johnson
Executive Director',
    ARRAY['recent_donors'],
    45,
    NOW() - INTERVAL '1 day',
    98.1,
    65.4,
    8.2,
    'donate@ccoscharity.org',
    'sarah@ccoscharity.org',
    ARRAY['thank-you', 'donation', 'acknowledgment']
);