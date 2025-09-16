import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const type = searchParams.get('type');

    // Base query for communications
    let communicationsQuery = supabase
      .from('communications')
      .select('*')
      .not('sent_at', 'is', null);

    // Apply filters
    if (dateFrom) {
      communicationsQuery = communicationsQuery.gte('sent_at', dateFrom);
    }
    if (dateTo) {
      communicationsQuery = communicationsQuery.lte('sent_at', dateTo);
    }
    if (type) {
      communicationsQuery = communicationsQuery.eq('type', type);
    }

    const { data: communications } = await communicationsQuery;

    if (!communications) {
      return NextResponse.json({
        total_communications: 0,
        total_recipients: 0,
        average_delivery_rate: 0,
        average_open_rate: 0,
        average_click_rate: 0,
        by_type: {},
        recent_performance: [],
        engagement_trends: []
      });
    }

    // Calculate overall statistics
    const totalCommunications = communications.length;
    const totalRecipients = communications.reduce((sum, comm) => sum + (comm.total_recipients || 0), 0);
    const averageDeliveryRate = communications.length > 0 
      ? communications.reduce((sum, comm) => sum + (comm.delivery_rate || 0), 0) / communications.length 
      : 0;
    const averageOpenRate = communications.length > 0 
      ? communications.reduce((sum, comm) => sum + (comm.open_rate || 0), 0) / communications.length 
      : 0;
    const averageClickRate = communications.length > 0 
      ? communications.reduce((sum, comm) => sum + (comm.click_rate || 0), 0) / communications.length 
      : 0;

    // Group by type
    const byType = communications.reduce((acc, comm) => {
      const type = comm.type;
      if (!acc[type]) {
        acc[type] = {
          count: 0,
          total_recipients: 0,
          average_delivery_rate: 0,
          average_open_rate: 0,
          average_click_rate: 0
        };
      }
      acc[type].count++;
      acc[type].total_recipients += comm.total_recipients || 0;
      acc[type].average_delivery_rate += comm.delivery_rate || 0;
      acc[type].average_open_rate += comm.open_rate || 0;
      acc[type].average_click_rate += comm.click_rate || 0;
      return acc;
    }, {} as Record<string, any>);

    // Calculate averages for each type
    Object.keys(byType).forEach(type => {
      const count = byType[type].count;
      byType[type].average_delivery_rate = byType[type].average_delivery_rate / count;
      byType[type].average_open_rate = byType[type].average_open_rate / count;
      byType[type].average_click_rate = byType[type].average_click_rate / count;
    });

    // Recent performance (last 12 communications)
    const recentCommunications = communications
      .sort((a, b) => new Date(b.sent_at).getTime() - new Date(a.sent_at).getTime())
      .slice(0, 12)
      .map(comm => ({
        id: comm.id,
        subject: comm.subject,
        type: comm.type,
        sent_at: comm.sent_at,
        total_recipients: comm.total_recipients,
        delivery_rate: comm.delivery_rate,
        open_rate: comm.open_rate,
        click_rate: comm.click_rate
      }));

    // Monthly engagement trends (last 12 months)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyTrends = await Promise.all(
      Array.from({ length: 12 }, async (_, i) => {
        const monthStart = new Date();
        monthStart.setMonth(monthStart.getMonth() - (11 - i));
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);

        const monthEnd = new Date(monthStart);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        monthEnd.setDate(0);
        monthEnd.setHours(23, 59, 59, 999);

        const { data: monthlyComms } = await supabase
          .from('communications')
          .select('total_recipients, delivery_rate, open_rate, click_rate')
          .not('sent_at', 'is', null)
          .gte('sent_at', monthStart.toISOString())
          .lte('sent_at', monthEnd.toISOString());

        const monthlyStats = {
          month: monthStart.toISOString().substring(0, 7), // YYYY-MM format
          communications_sent: monthlyComms?.length || 0,
          total_recipients: monthlyComms?.reduce((sum, comm) => sum + (comm.total_recipients || 0), 0) || 0,
          average_delivery_rate: (monthlyComms && monthlyComms.length > 0)
            ? monthlyComms.reduce((sum, comm) => sum + (comm.delivery_rate || 0), 0) / monthlyComms.length 
            : 0,
          average_open_rate: (monthlyComms && monthlyComms.length > 0)
            ? monthlyComms.reduce((sum, comm) => sum + (comm.open_rate || 0), 0) / monthlyComms.length 
            : 0,
          average_click_rate: (monthlyComms && monthlyComms.length > 0)
            ? monthlyComms.reduce((sum, comm) => sum + (comm.click_rate || 0), 0) / monthlyComms.length 
            : 0,
        };

        return monthlyStats;
      })
    );

    // Get top performing communications
    const topPerforming = communications
      .filter(comm => comm.open_rate > 0)
      .sort((a, b) => (b.open_rate || 0) - (a.open_rate || 0))
      .slice(0, 5)
      .map(comm => ({
        id: comm.id,
        subject: comm.subject,
        type: comm.type,
        sent_at: comm.sent_at,
        total_recipients: comm.total_recipients,
        open_rate: comm.open_rate,
        click_rate: comm.click_rate
      }));

    // Get segment performance
    const { data: segmentData } = await supabase
      .from('communication_recipients')
      .select(`
        delivered,
        opened,
        clicked,
        bounced,
        members(tier)
      `);

    const segmentPerformance = segmentData?.reduce((acc, recipient) => {
      const tier = recipient.members?.tier || 'unknown';
      if (!acc[tier]) {
        acc[tier] = {
          total: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          bounced: 0
        };
      }
      acc[tier].total++;
      if (recipient.delivered) acc[tier].delivered++;
      if (recipient.opened) acc[tier].opened++;
      if (recipient.clicked) acc[tier].clicked++;
      if (recipient.bounced) acc[tier].bounced++;
      return acc;
    }, {} as Record<string, any>) || {};

    // Calculate rates for each segment
    Object.keys(segmentPerformance).forEach(tier => {
      const segment = segmentPerformance[tier];
      segment.delivery_rate = segment.total > 0 ? (segment.delivered / segment.total) * 100 : 0;
      segment.open_rate = segment.delivered > 0 ? (segment.opened / segment.delivered) * 100 : 0;
      segment.click_rate = segment.opened > 0 ? (segment.clicked / segment.opened) * 100 : 0;
      segment.bounce_rate = segment.total > 0 ? (segment.bounced / segment.total) * 100 : 0;
    });

    return NextResponse.json({
      total_communications: totalCommunications,
      total_recipients: totalRecipients,
      average_delivery_rate: Math.round(averageDeliveryRate * 100) / 100,
      average_open_rate: Math.round(averageOpenRate * 100) / 100,
      average_click_rate: Math.round(averageClickRate * 100) / 100,
      by_type: byType,
      recent_performance: recentCommunications,
      engagement_trends: monthlyTrends,
      top_performing: topPerforming,
      segment_performance: segmentPerformance
    });
  } catch (error) {
    console.error('Error fetching communication statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}