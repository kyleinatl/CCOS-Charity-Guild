-- Add analytics database functions

-- Function to get member growth data
CREATE OR REPLACE FUNCTION get_member_growth_data(start_date timestamptz, end_date timestamptz)
RETURNS TABLE (
  month text,
  new_members bigint,
  total_members bigint
) AS $$
BEGIN
  RETURN QUERY
  WITH monthly_data AS (
    SELECT 
      date_trunc('month', created_at) as month_date,
      COUNT(*) as new_members_count
    FROM members 
    WHERE created_at >= start_date AND created_at <= end_date
    GROUP BY date_trunc('month', created_at)
    ORDER BY month_date
  ),
  running_totals AS (
    SELECT 
      month_date,
      new_members_count,
      SUM(new_members_count) OVER (ORDER BY month_date) as running_total
    FROM monthly_data
  )
  SELECT 
    to_char(month_date, 'YYYY-MM') as month,
    new_members_count as new_members,
    running_total as total_members
  FROM running_totals;
END;
$$ LANGUAGE plpgsql;

-- Function to get donation trends data
CREATE OR REPLACE FUNCTION get_donation_trends_data(start_date timestamptz, end_date timestamptz)
RETURNS TABLE (
  month text,
  total_amount numeric,
  donation_count bigint,
  average_amount numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(date_trunc('month', donation_date), 'YYYY-MM') as month,
    COALESCE(SUM(amount), 0) as total_amount,
    COUNT(*) as donation_count,
    COALESCE(AVG(amount), 0) as average_amount
  FROM donations 
  WHERE donation_date >= start_date AND donation_date <= end_date
  GROUP BY date_trunc('month', donation_date)
  ORDER BY month;
END;
$$ LANGUAGE plpgsql;

-- Function to get event performance data
CREATE OR REPLACE FUNCTION get_event_performance_data(start_date timestamptz, end_date timestamptz)
RETURNS TABLE (
  month text,
  events_created bigint,
  total_registrations bigint,
  total_revenue numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(date_trunc('month', created_at), 'YYYY-MM') as month,
    COUNT(*) as events_created,
    COALESCE(SUM(current_registrations), 0) as total_registrations,
    COALESCE(SUM(registration_fee * current_registrations), 0) as total_revenue
  FROM events 
  WHERE created_at >= start_date AND created_at <= end_date
  GROUP BY date_trunc('month', created_at)
  ORDER BY month;
END;
$$ LANGUAGE plpgsql;

-- Function to get communication performance data
CREATE OR REPLACE FUNCTION get_communication_performance_data(start_date timestamptz, end_date timestamptz)
RETURNS TABLE (
  month text,
  communications_sent bigint,
  total_recipients bigint,
  average_open_rate numeric,
  average_click_rate numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(date_trunc('month', sent_at), 'YYYY-MM') as month,
    COUNT(*) as communications_sent,
    COALESCE(SUM(total_recipients), 0) as total_recipients,
    COALESCE(AVG(open_rate), 0) as average_open_rate,
    COALESCE(AVG(click_rate), 0) as average_click_rate
  FROM communications 
  WHERE sent_at >= start_date AND sent_at <= end_date AND sent_at IS NOT NULL
  GROUP BY date_trunc('month', sent_at)
  ORDER BY month;
END;
$$ LANGUAGE plpgsql;

-- Function to get member engagement trends
CREATE OR REPLACE FUNCTION get_member_engagement_trends(start_date timestamptz, end_date timestamptz)
RETURNS TABLE (
  month text,
  average_engagement numeric,
  active_members bigint,
  new_activities bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    to_char(date_trunc('month', ma.created_at), 'YYYY-MM') as month,
    COALESCE(AVG(m.engagement_score), 0) as average_engagement,
    COUNT(DISTINCT ma.member_id) as active_members,
    COUNT(*) as new_activities
  FROM member_activities ma
  LEFT JOIN members m ON ma.member_id = m.id
  WHERE ma.created_at >= start_date AND ma.created_at <= end_date
  GROUP BY date_trunc('month', ma.created_at)
  ORDER BY month;
END;
$$ LANGUAGE plpgsql;