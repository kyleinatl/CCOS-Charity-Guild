import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const { id } = await params;
    
    const { data: communication, error } = await supabase
      .from('communications')
      .select(`
        *,
        communication_recipients(
          id,
          delivered,
          delivered_at,
          opened,
          opened_at,
          clicked,
          clicked_at,
          bounced,
          unsubscribed,
          created_at,
          members(
            id,
            first_name,
            last_name,
            email,
            tier
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    // Calculate analytics
    const recipients = communication.communication_recipients || [];
    const totalRecipients = recipients.length;
    const delivered = recipients.filter((r: any) => r.delivered).length;
    const opened = recipients.filter((r: any) => r.opened).length;
    const clicked = recipients.filter((r: any) => r.clicked).length;
    const bounced = recipients.filter((r: any) => r.bounced).length;
    const unsubscribed = recipients.filter((r: any) => r.unsubscribed).length;

    const analytics = {
      total_recipients: totalRecipients,
      delivered_count: delivered,
      opened_count: opened,
      clicked_count: clicked,
      bounced_count: bounced,
      unsubscribed_count: unsubscribed,
      delivery_rate: totalRecipients > 0 ? (delivered / totalRecipients) * 100 : 0,
      open_rate: delivered > 0 ? (opened / delivered) * 100 : 0,
      click_rate: opened > 0 ? (clicked / opened) * 100 : 0,
      bounce_rate: totalRecipients > 0 ? (bounced / totalRecipients) * 100 : 0,
    };

    return NextResponse.json({
      communication,
      analytics
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { id } = await params;
    
    const { data: communication, error } = await supabase
      .from('communications')
      .update(body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ communication });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const { id } = await params;
    
    // Check if communication has been sent
    const { data: communication } = await supabase
      .from('communications')
      .select('sent_at')
      .eq('id', id)
      .single();

    if (communication?.sent_at) {
      return NextResponse.json(
        { error: 'Cannot delete sent communications' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('communications')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Communication deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}