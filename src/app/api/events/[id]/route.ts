import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { CreateEventSchema } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        registrations:event_registrations(
          id,
          status,
          registration_date,
          number_of_guests,
          amount_paid,
          payment_method,
          dietary_restrictions,
          special_requests,
          checked_in,
          attended,
          notes,
          members:member_id (
            id,
            first_name,
            last_name,
            email,
            phone,
            tier
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate registration statistics
    const registrations = event.registrations || [];
    const confirmedRegistrations = registrations.filter(r => r.status === 'confirmed');
    const pendingRegistrations = registrations.filter(r => r.status === 'pending');
    const cancelledRegistrations = registrations.filter(r => r.status === 'cancelled');
    const attendedCount = registrations.filter(r => r.attended).length;

    const enrichedEvent = {
      ...event,
      registration_stats: {
        total: registrations.length,
        confirmed: confirmedRegistrations.length,
        pending: pendingRegistrations.length,
        cancelled: cancelledRegistrations.length,
        attended: attendedCount,
        available_spots: event.capacity ? Math.max(0, event.capacity - confirmedRegistrations.length) : null
      }
    };

    return NextResponse.json({ event: enrichedEvent });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateEventSchema.parse(body);
    
    const { data: event, error } = await supabase
      .from('events')
      .update(validatedData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ event });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    
    // Check if event has registrations
    const { count: registrationCount } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id);

    if (registrationCount && registrationCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete event with existing registrations. Cancel the event instead.' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}