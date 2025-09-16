-- Row Level Security (RLS) Policies
-- Secure access control for the charity guild system

-- Enable RLS on all tables
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_activities ENABLE ROW LEVEL SECURITY;

-- Create user roles
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin_role') THEN
        CREATE ROLE admin_role;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'treasurer_role') THEN
        CREATE ROLE treasurer_role;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'member_role') THEN
        CREATE ROLE member_role;
    END IF;
END
$$;

-- Function to get user role from JWT
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN COALESCE(
        current_setting('request.jwt.claims', true)::json->>'role',
        'member_role'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user ID from JWT
CREATE OR REPLACE FUNCTION get_user_id()
RETURNS UUID AS $$
BEGIN
    RETURN COALESCE(
        (current_setting('request.jwt.claims', true)::json->>'sub')::uuid,
        '00000000-0000-0000-0000-000000000000'::uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Members table policies
CREATE POLICY "Admins can view all members" ON members
    FOR SELECT USING (get_user_role() = 'admin_role');

CREATE POLICY "Treasurers can view all members" ON members
    FOR SELECT USING (get_user_role() = 'treasurer_role');

CREATE POLICY "Members can view their own profile" ON members
    FOR SELECT USING (
        get_user_role() = 'member_role' AND 
        id = get_user_id()
    );

CREATE POLICY "Admins can insert members" ON members
    FOR INSERT WITH CHECK (get_user_role() = 'admin_role');

CREATE POLICY "Admins can update members" ON members
    FOR UPDATE USING (get_user_role() = 'admin_role');

CREATE POLICY "Members can update their own profile" ON members
    FOR UPDATE USING (
        get_user_role() = 'member_role' AND 
        id = get_user_id()
    );

CREATE POLICY "Only admins can delete members" ON members
    FOR DELETE USING (get_user_role() = 'admin_role');

-- Donations table policies
CREATE POLICY "Admins can view all donations" ON donations
    FOR SELECT USING (get_user_role() = 'admin_role');

CREATE POLICY "Treasurers can view all donations" ON donations
    FOR SELECT USING (get_user_role() = 'treasurer_role');

CREATE POLICY "Members can view their own donations" ON donations
    FOR SELECT USING (
        get_user_role() = 'member_role' AND 
        member_id = get_user_id()
    );

CREATE POLICY "Admins and treasurers can insert donations" ON donations
    FOR INSERT WITH CHECK (
        get_user_role() IN ('admin_role', 'treasurer_role')
    );

CREATE POLICY "Admins and treasurers can update donations" ON donations
    FOR UPDATE USING (
        get_user_role() IN ('admin_role', 'treasurer_role')
    );

CREATE POLICY "Only admins can delete donations" ON donations
    FOR DELETE USING (get_user_role() = 'admin_role');

-- Events table policies
CREATE POLICY "Everyone can view published events" ON events
    FOR SELECT USING (
        status = 'published' OR 
        status = 'active' OR 
        get_user_role() IN ('admin_role', 'treasurer_role')
    );

CREATE POLICY "Admins can manage events" ON events
    FOR ALL USING (get_user_role() = 'admin_role');

CREATE POLICY "Treasurers can manage events" ON events
    FOR ALL USING (get_user_role() = 'treasurer_role');

-- Event registrations table policies
CREATE POLICY "Admins can view all registrations" ON event_registrations
    FOR SELECT USING (get_user_role() = 'admin_role');

CREATE POLICY "Treasurers can view all registrations" ON event_registrations
    FOR SELECT USING (get_user_role() = 'treasurer_role');

CREATE POLICY "Members can view their own registrations" ON event_registrations
    FOR SELECT USING (
        get_user_role() = 'member_role' AND 
        member_id = get_user_id()
    );

CREATE POLICY "Members can register for events" ON event_registrations
    FOR INSERT WITH CHECK (
        member_id = get_user_id() OR 
        get_user_role() IN ('admin_role', 'treasurer_role')
    );

CREATE POLICY "Members can update their own registrations" ON event_registrations
    FOR UPDATE USING (
        member_id = get_user_id() OR 
        get_user_role() IN ('admin_role', 'treasurer_role')
    );

CREATE POLICY "Admins can delete registrations" ON event_registrations
    FOR DELETE USING (get_user_role() = 'admin_role');

-- Communications table policies
CREATE POLICY "Admins can manage communications" ON communications
    FOR ALL USING (get_user_role() = 'admin_role');

CREATE POLICY "Treasurers can view communications" ON communications
    FOR SELECT USING (get_user_role() = 'treasurer_role');

-- Communication recipients table policies
CREATE POLICY "Admins can view all recipients" ON communication_recipients
    FOR SELECT USING (get_user_role() = 'admin_role');

CREATE POLICY "Members can view their own communications" ON communication_recipients
    FOR SELECT USING (
        get_user_role() = 'member_role' AND 
        member_id = get_user_id()
    );

CREATE POLICY "Admins can manage recipients" ON communication_recipients
    FOR ALL USING (get_user_role() = 'admin_role');

-- Automations table policies
CREATE POLICY "Admins can manage automations" ON automations
    FOR ALL USING (get_user_role() = 'admin_role');

CREATE POLICY "Treasurers can view automations" ON automations
    FOR SELECT USING (get_user_role() = 'treasurer_role');

-- Automation logs table policies
CREATE POLICY "Admins can view automation logs" ON automation_logs
    FOR SELECT USING (get_user_role() = 'admin_role');

CREATE POLICY "System can insert automation logs" ON automation_logs
    FOR INSERT WITH CHECK (true);

-- Member activities table policies
CREATE POLICY "Admins can view all activities" ON member_activities
    FOR SELECT USING (get_user_role() = 'admin_role');

CREATE POLICY "Treasurers can view all activities" ON member_activities
    FOR SELECT USING (get_user_role() = 'treasurer_role');

CREATE POLICY "Members can view their own activities" ON member_activities
    FOR SELECT USING (
        get_user_role() = 'member_role' AND 
        member_id = get_user_id()
    );

CREATE POLICY "System can insert activities" ON member_activities
    FOR INSERT WITH CHECK (true);

-- Grant permissions to roles
GRANT USAGE ON SCHEMA public TO admin_role, treasurer_role, member_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO admin_role;
GRANT SELECT, INSERT, UPDATE ON donations, events, event_registrations TO treasurer_role;
GRANT SELECT ON members, communications TO treasurer_role;
GRANT SELECT ON members, donations, events, event_registrations, communications, member_activities TO member_role;
GRANT INSERT, UPDATE ON event_registrations TO member_role;
GRANT UPDATE ON members TO member_role;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO admin_role, treasurer_role, member_role;