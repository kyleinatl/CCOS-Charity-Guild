-- Seed data for CCOS Charity Guild development
-- This file contains sample data for testing and development

-- Insert sample members
INSERT INTO members (id, email, first_name, last_name, phone, address_line1, city, state, zip_code, tier, total_donated, engagement_score, occupation, employer, interests) VALUES
    ('11111111-1111-1111-1111-111111111111', 'john.doe@example.com', 'John', 'Doe', '(555) 123-4567', '123 Main St', 'Atlanta', 'GA', '30309', 'gold', 7500.00, 85, 'Software Engineer', 'Tech Corp', ARRAY['technology', 'education']),
    ('22222222-2222-2222-2222-222222222222', 'jane.smith@example.com', 'Jane', 'Smith', '(555) 234-5678', '456 Oak Ave', 'Decatur', 'GA', '30030', 'platinum', 15000.00, 95, 'Doctor', 'Regional Hospital', ARRAY['healthcare', 'community']),
    ('33333333-3333-3333-3333-333333333333', 'mike.johnson@example.com', 'Mike', 'Johnson', '(555) 345-6789', '789 Pine Rd', 'Marietta', 'GA', '30062', 'silver', 2500.00, 70, 'Teacher', 'Local High School', ARRAY['education', 'youth']),
    ('44444444-4444-4444-4444-444444444444', 'sarah.wilson@example.com', 'Sarah', 'Wilson', '(555) 456-7890', '321 Elm St', 'Roswell', 'GA', '30075', 'bronze', 500.00, 60, 'Marketing Manager', 'AdCorp', ARRAY['marketing', 'arts']),
    ('55555555-5555-5555-5555-555555555555', 'david.brown@example.com', 'David', 'Brown', '(555) 567-8901', '654 Maple Dr', 'Sandy Springs', 'GA', '30328', 'gold', 8200.00, 88, 'Financial Advisor', 'Investment Firm', ARRAY['finance', 'mentoring']);

-- Insert sample donations
INSERT INTO donations (member_id, amount, donation_date, method, designation, transaction_id, payment_processor, tax_deductible, receipt_sent) VALUES
    ('11111111-1111-1111-1111-111111111111', 1000.00, '2024-01-15 10:30:00', 'credit_card', 'General Fund', 'txn_1234567890', 'stripe', true, true),
    ('11111111-1111-1111-1111-111111111111', 2500.00, '2024-03-20 14:45:00', 'online', 'Education Program', 'txn_2345678901', 'stripe', true, true),
    ('11111111-1111-1111-1111-111111111111', 4000.00, '2024-06-10 09:15:00', 'check', 'Building Fund', 'check_001', null, true, true),
    ('22222222-2222-2222-2222-222222222222', 5000.00, '2024-02-01 11:00:00', 'bank_transfer', 'General Fund', 'wire_001', null, true, true),
    ('22222222-2222-2222-2222-222222222222', 10000.00, '2024-07-15 16:30:00', 'online', 'Capital Campaign', 'txn_3456789012', 'stripe', true, true),
    ('33333333-3333-3333-3333-333333333333', 500.00, '2024-01-30 13:20:00', 'cash', 'General Fund', null, null, true, true),
    ('33333333-3333-3333-3333-333333333333', 1000.00, '2024-04-25 10:45:00', 'credit_card', 'Youth Programs', 'txn_4567890123', 'stripe', true, true),
    ('33333333-3333-3333-3333-333333333333', 1000.00, '2024-08-12 15:10:00', 'online', 'General Fund', 'txn_5678901234', 'stripe', true, true),
    ('44444444-4444-4444-4444-444444444444', 200.00, '2024-03-05 12:30:00', 'online', 'General Fund', 'txn_6789012345', 'stripe', true, true),
    ('44444444-4444-4444-4444-444444444444', 300.00, '2024-09-01 08:45:00', 'credit_card', 'Arts Program', 'txn_7890123456', 'stripe', true, true),
    ('55555555-5555-5555-5555-555555555555', 3000.00, '2024-02-14 17:00:00', 'check', 'General Fund', 'check_002', null, true, true),
    ('55555555-5555-5555-5555-555555555555', 2500.00, '2024-05-30 11:30:00', 'online', 'Scholarship Fund', 'txn_8901234567', 'stripe', true, true),
    ('55555555-5555-5555-5555-555555555555', 2700.00, '2024-08-20 14:15:00', 'bank_transfer', 'Building Fund', 'wire_002', null, true, true);

-- Insert sample events
INSERT INTO events (id, name, description, event_type, start_date, end_date, venue_name, venue_address, capacity, ticket_price, fundraising_goal, status) VALUES
    ('eeeeeeee-1111-1111-1111-111111111111', 'Annual Charity Gala', 'Our biggest fundraising event of the year featuring dinner, silent auction, and entertainment.', 'fundraiser', '2024-11-15 18:00:00', '2024-11-15 23:00:00', 'Grand Ballroom', '123 Event Center Dr, Atlanta, GA 30309', 200, 150.00, 50000.00, 'published'),
    ('eeeeeeee-2222-2222-2222-222222222222', 'Community Service Day', 'Join us for a day of giving back to our local community through various service projects.', 'social', '2024-10-20 09:00:00', '2024-10-20 16:00:00', 'Community Center', '456 Service Blvd, Decatur, GA 30030', 100, 0.00, 0.00, 'published'),
    ('eeeeeeee-3333-3333-3333-333333333333', 'Youth Mentorship Workshop', 'Educational workshop for young professionals and students.', 'workshop', '2024-12-05 10:00:00', '2024-12-05 15:00:00', 'Learning Center', '789 Education Way, Marietta, GA 30062', 50, 25.00, 2500.00, 'published'),
    ('eeeeeeee-4444-4444-4444-444444444444', 'Virtual Donor Appreciation', 'Online event to thank our supporters and share impact stories.', 'social', '2024-12-20 19:00:00', '2024-12-20 20:30:00', null, null, 75, 0.00, 0.00, 'published');
UPDATE events SET is_virtual = true, virtual_link = 'https://zoom.us/j/donor-appreciation' WHERE id = 'eeeeeeee-4444-4444-4444-444444444444';

-- Insert sample event registrations
INSERT INTO event_registrations (event_id, member_id, status, number_of_guests, amount_paid, payment_method, payment_date) VALUES
    ('eeeeeeee-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'confirmed', 1, 300.00, 'credit_card', '2024-09-15 10:30:00'),
    ('eeeeeeee-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', 'confirmed', 1, 300.00, 'online', '2024-09-20 14:45:00'),
    ('eeeeeeee-1111-1111-1111-111111111111', '55555555-5555-5555-5555-555555555555', 'confirmed', 0, 150.00, 'check', '2024-09-25 09:15:00'),
    ('eeeeeeee-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'confirmed', 0, 0.00, null, '2024-09-30 11:00:00'),
    ('eeeeeeee-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', 'confirmed', 2, 0.00, null, '2024-10-01 16:30:00'),
    ('eeeeeeee-2222-2222-2222-222222222222', '44444444-4444-4444-4444-444444444444', 'confirmed', 0, 0.00, null, '2024-10-02 13:20:00'),
    ('eeeeeeee-3333-3333-3333-333333333333', '33333333-3333-3333-3333-333333333333', 'confirmed', 0, 25.00, 'online', '2024-10-15 10:45:00'),
    ('eeeeeeee-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'confirmed', 0, 0.00, null, '2024-11-01 15:10:00'),
    ('eeeeeeee-4444-4444-4444-444444444444', '22222222-2222-2222-2222-222222222222', 'confirmed', 0, 0.00, null, '2024-11-01 12:30:00'),
    ('eeeeeeee-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', 'confirmed', 0, 0.00, null, '2024-11-02 08:45:00');

-- Insert sample communications
INSERT INTO communications (type, subject, content, recipient_segments, total_recipients, sent_at, delivery_rate, open_rate, click_rate, from_email) VALUES
    ('newsletter', 'October 2024 Newsletter', 'Thank you for your continued support! Here are the highlights from this month...', ARRAY['all'], 5, '2024-10-01 09:00:00', 98.5, 65.2, 12.8, 'newsletter@ccoscharityguild.org'),
    ('email_campaign', 'Annual Gala Invitation', 'You are cordially invited to our Annual Charity Gala on November 15th...', ARRAY['gold', 'platinum'], 2, '2024-09-15 10:00:00', 100.0, 85.0, 45.0, 'events@ccoscharityguild.org'),
    ('direct_email', 'Thank You for Your Donation', 'Dear {first_name}, Thank you for your generous donation of ${amount}...', ARRAY['all'], 1, '2024-09-01 14:30:00', 100.0, 80.0, 5.0, 'donations@ccoscharityguild.org');

-- Insert sample communication recipients
INSERT INTO communication_recipients (communication_id, member_id, delivered, delivered_at, opened, opened_at, clicked, clicked_at) 
SELECT 
    c.id,
    m.id,
    true,
    c.sent_at + INTERVAL '5 minutes',
    CASE WHEN random() > 0.35 THEN true ELSE false END,
    CASE WHEN random() > 0.35 THEN c.sent_at + INTERVAL '2 hours' ELSE null END,
    CASE WHEN random() > 0.87 THEN true ELSE false END,
    CASE WHEN random() > 0.87 THEN c.sent_at + INTERVAL '3 hours' ELSE null END
FROM communications c
CROSS JOIN members m
WHERE 
    (c.recipient_segments @> ARRAY['all']) OR
    (c.recipient_segments @> ARRAY[m.tier::text]);

-- Insert sample automations
INSERT INTO automations (name, description, trigger_type, trigger_conditions, actions, status) VALUES
    ('Welcome New Members', 'Send welcome email sequence to new members', 'new_member', '{"delay_hours": 0}', '[{"type": "send_email", "template": "welcome", "delay_hours": 0}, {"type": "send_email", "template": "getting_started", "delay_hours": 24}]', 'active'),
    ('Thank You for Donations', 'Send thank you email for donations over $100', 'donation_received', '{"minimum_amount": 100}', '[{"type": "send_email", "template": "donation_thank_you", "delay_hours": 1}]', 'active'),
    ('Event Reminder', 'Send reminder 24 hours before event', 'event_reminder', '{"hours_before": 24}', '[{"type": "send_email", "template": "event_reminder", "delay_hours": 0}]', 'active');

-- Insert sample member activities
INSERT INTO member_activities (member_id, activity_type, activity_description, activity_value, related_donation_id, related_event_id, created_at) 
SELECT 
    d.member_id,
    'donation',
    'Made donation of $' || d.amount::text,
    d.amount,
    d.id,
    null,
    d.created_at
FROM donations d;

INSERT INTO member_activities (member_id, activity_type, activity_description, activity_value, related_event_id, created_at) 
SELECT 
    er.member_id,
    'event_registration',
    'Registered for ' || e.name,
    0,
    e.id,
    er.created_at
FROM event_registrations er
JOIN events e ON er.event_id = e.id;

-- Update member engagement scores based on activities
UPDATE members SET engagement_score = (
    SELECT CASE 
        WHEN COUNT(*) = 0 THEN 0
        WHEN COUNT(*) <= 2 THEN 40
        WHEN COUNT(*) <= 5 THEN 60
        WHEN COUNT(*) <= 8 THEN 75
        WHEN COUNT(*) <= 12 THEN 85
        ELSE 95
    END
    FROM member_activities ma 
    WHERE ma.member_id = members.id
);

-- Add some notes to members
UPDATE members SET notes = 'Active donor, interested in education programs' WHERE id = '11111111-1111-1111-1111-111111111111';
UPDATE members SET notes = 'Major donor, board member potential' WHERE id = '22222222-2222-2222-2222-222222222222';
UPDATE members SET notes = 'Teacher, volunteers regularly' WHERE id = '33333333-3333-3333-3333-333333333333';
UPDATE members SET notes = 'New member, interested in arts programs' WHERE id = '44444444-4444-4444-4444-444444444444';
UPDATE members SET notes = 'Financial expertise, good mentor candidate' WHERE id = '55555555-5555-5555-5555-555555555555';