import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

interface CommunicationData {
  type: 'newsletter' | 'email_campaign' | 'social_media' | 'direct_email';
  subject: string;
  content: string;
  recipient_segments: string[];
  platform?: string;
  scheduled_for?: string;
  from_email?: string;
  reply_to_email?: string;
  tags?: string[];
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search');
    const type = searchParams.get('type');
    const status = searchParams.get('status'); // sent, draft, scheduled
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('communications')
      .select(`
        *,
        communication_recipients(count)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`subject.ilike.%${search}%,content.ilike.%${search}%`);
    }

    if (type) {
      query = query.eq('type', type);
    }

    if (status === 'sent') {
      query = query.not('sent_at', 'is', null);
    } else if (status === 'draft') {
      query = query.is('sent_at', null).is('scheduled_for', null);
    } else if (status === 'scheduled') {
      query = query.is('sent_at', null).not('scheduled_for', 'is', null);
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    const { data: communications, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('communications')
      .select('*', { count: 'exact', head: true });

    if (search) {
      countQuery = countQuery.or(`subject.ilike.%${search}%,content.ilike.%${search}%`);
    }
    if (type) {
      countQuery = countQuery.eq('type', type);
    }
    if (status === 'sent') {
      countQuery = countQuery.not('sent_at', 'is', null);
    } else if (status === 'draft') {
      countQuery = countQuery.is('sent_at', null).is('scheduled_for', null);
    } else if (status === 'scheduled') {
      countQuery = countQuery.is('sent_at', null).not('scheduled_for', 'is', null);
    }
    if (dateFrom) {
      countQuery = countQuery.gte('created_at', dateFrom);
    }
    if (dateTo) {
      countQuery = countQuery.lte('created_at', dateTo);
    }

    const { count } = await countQuery;

    return NextResponse.json({
      communications,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json() as CommunicationData;
    
    // Calculate recipient count based on segments
    let recipientCount = 0;
    
    for (const segment of body.recipient_segments) {
      if (segment === 'all') {
        const { count } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('email_subscribed', true);
        recipientCount = count || 0;
        break; // If 'all' is selected, use total count
      } else if (['bronze', 'silver', 'gold', 'platinum'].includes(segment)) {
        const { count } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('tier', segment)
          .eq('email_subscribed', true);
        recipientCount += count || 0;
      } else if (segment === 'newsletter_subscribers') {
        const { count } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .eq('newsletter_subscribed', true);
        recipientCount += count || 0;
      } else if (segment === 'recent_donors') {
        const { count } = await supabase
          .from('members')
          .select('*', { count: 'exact', head: true })
          .gte('last_donation_date', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString())
          .eq('email_subscribed', true);
        recipientCount += count || 0;
      }
    }

    const communicationData = {
      ...body,
      total_recipients: recipientCount,
      delivery_rate: 0,
      open_rate: 0,
      click_rate: 0,
    };

    const { data: communication, error } = await supabase
      .from('communications')
      .insert([communicationData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If not scheduled, create recipient records immediately
    if (!body.scheduled_for) {
      await createRecipientRecords(supabase, communication.id, body.recipient_segments);
    }

    return NextResponse.json({ communication }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function createRecipientRecords(supabase: any, communicationId: string, segments: string[]) {
  let memberQuery = supabase
    .from('members')
    .select('id')
    .eq('email_subscribed', true);

  // Apply segment filters
  if (segments.includes('all')) {
    // No additional filters needed
  } else {
    const tierSegments = segments.filter(s => ['bronze', 'silver', 'gold', 'platinum'].includes(s));
    const otherSegments = segments.filter(s => !['bronze', 'silver', 'gold', 'platinum'].includes(s));

    let conditions = [];
    
    if (tierSegments.length > 0) {
      conditions.push(`tier.in.(${tierSegments.join(',')})`);
    }
    
    if (otherSegments.includes('newsletter_subscribers')) {
      conditions.push('newsletter_subscribed.eq.true');
    }
    
    if (otherSegments.includes('recent_donors')) {
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      conditions.push(`last_donation_date.gte.${ninetyDaysAgo}`);
    }

    if (conditions.length > 0) {
      memberQuery = memberQuery.or(conditions.join(','));
    }
  }

  const { data: members } = await memberQuery;

  if (members && members.length > 0) {
    const recipients = members.map((member: { id: string }) => ({
      communication_id: communicationId,
      member_id: member.id,
      delivered: false,
      opened: false,
      clicked: false,
      bounced: false,
      unsubscribed: false,
    }));

    await supabase
      .from('communication_recipients')
      .insert(recipients);
  }
}