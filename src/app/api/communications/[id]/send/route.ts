import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    
    // Get communication details
    const { data: communication, error: fetchError } = await supabase
      .from('communications')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !communication) {
      return NextResponse.json({ error: 'Communication not found' }, { status: 404 });
    }

    // Check if already sent
    if (communication.sent_at) {
      return NextResponse.json(
        { error: 'Communication has already been sent' },
        { status: 400 }
      );
    }

    // Create recipient records if they don't exist (for scheduled communications)
    const { count: recipientCount } = await supabase
      .from('communication_recipients')
      .select('*', { count: 'exact', head: true })
      .eq('communication_id', id);

    if (!recipientCount || recipientCount === 0) {
      await createRecipientRecords(supabase, id, communication.recipient_segments);
    }

    // Get all recipients
    const { data: recipients } = await supabase
      .from('communication_recipients')
      .select(`
        id,
        member_id,
        members(
          email,
          first_name,
          last_name,
          email_subscribed
        )
      `)
      .eq('communication_id', id);

    if (!recipients || recipients.length === 0) {
      return NextResponse.json(
        { error: 'No valid recipients found' },
        { status: 400 }
      );
    }

    // Simulate sending emails (in a real implementation, this would integrate with an email service)
    let deliveredCount = 0;
    let bouncedCount = 0;

    for (const recipient of recipients) {
      if (!recipient.members?.email_subscribed) {
        continue;
      }

      // Simulate email delivery (90% success rate)
      const delivered = Math.random() > 0.1;
      
      if (delivered) {
        deliveredCount++;
        
        // Update recipient as delivered
        await supabase
          .from('communication_recipients')
          .update({
            delivered: true,
            delivered_at: new Date().toISOString()
          })
          .eq('id', recipient.id);

        // Simulate open rate (25% of delivered emails)
        if (Math.random() < 0.25) {
          await supabase
            .from('communication_recipients')
            .update({
              opened: true,
              opened_at: new Date().toISOString()
            })
            .eq('id', recipient.id);

          // Simulate click rate (15% of opened emails)
          if (Math.random() < 0.15) {
            await supabase
              .from('communication_recipients')
              .update({
                clicked: true,
                clicked_at: new Date().toISOString()
              })
              .eq('id', recipient.id);
          }
        }
      } else {
        bouncedCount++;
        
        // Update recipient as bounced
        await supabase
          .from('communication_recipients')
          .update({
            bounced: true
          })
          .eq('id', recipient.id);
      }

      // Add small delay to simulate processing
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    // Calculate final rates
    const totalRecipients = recipients.length;
    const deliveryRate = totalRecipients > 0 ? (deliveredCount / totalRecipients) * 100 : 0;
    
    // Update communication as sent with calculated rates
    const { data: updatedCommunication, error: updateError } = await supabase
      .from('communications')
      .update({
        sent_at: new Date().toISOString(),
        delivery_rate: Math.round(deliveryRate * 100) / 100,
        total_recipients: totalRecipients
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Log activity for members who received the communication
    const memberActivities = recipients
      .filter((r: any) => r.members?.email_subscribed)
      .map((recipient: any) => ({
        member_id: recipient.member_id,
        activity_type: 'communication_received',
        activity_description: `Received ${communication.type}: ${communication.subject}`,
        related_communication_id: id
      }));

    if (memberActivities.length > 0) {
      await supabase
        .from('member_activities')
        .insert(memberActivities);
    }

    return NextResponse.json({
      communication: updatedCommunication,
      delivery_stats: {
        total_recipients: totalRecipients,
        delivered: deliveredCount,
        bounced: bouncedCount,
        delivery_rate: deliveryRate
      }
    });
  } catch (error) {
    console.error('Error sending communication:', error);
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
    const tierSegments = segments.filter((s: string) => ['bronze', 'silver', 'gold', 'platinum'].includes(s));
    const otherSegments = segments.filter((s: string) => !['bronze', 'silver', 'gold', 'platinum'].includes(s));

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