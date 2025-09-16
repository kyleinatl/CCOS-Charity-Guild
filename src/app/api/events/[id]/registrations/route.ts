import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

interface RegistrationData {
  event_id: string;
  member_id: string;
  number_of_guests?: number;
  dietary_restrictions?: string;
  special_requests?: string;
  notes?: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('event_registrations')
      .select(`
        *,
        members:member_id (
          id,
          first_name,
          last_name,
          email,
          phone,
          tier
        )
      `)
      .eq('event_id', id)
      .order('registration_date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: registrations, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get total count
    const { count } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id);

    return NextResponse.json({
      registrations,
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = createClient();
    const body = await request.json() as RegistrationData;
    
    // Get event details to check capacity
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('capacity, current_registrations, status, registration_deadline')
      .eq('id', id)
      .single();

    if (eventError || !event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Check if event is open for registration
    if (event.status !== 'published' && event.status !== 'active') {
      return NextResponse.json(
        { error: 'Event is not open for registration' },
        { status: 400 }
      );
    }

    // Check registration deadline
    if (event.registration_deadline) {
      const deadline = new Date(event.registration_deadline);
      if (new Date() > deadline) {
        return NextResponse.json(
          { error: 'Registration deadline has passed' },
          { status: 400 }
        );
      }
    }

    // Check if member is already registered
    const { data: existingRegistration } = await supabase
      .from('event_registrations')
      .select('id, status')
      .eq('event_id', id)
      .eq('member_id', body.member_id)
      .single();

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Member is already registered for this event' },
        { status: 400 }
      );
    }

    // Get current confirmed registrations count
    const { count: confirmedCount } = await supabase
      .from('event_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', id)
      .eq('status', 'confirmed');

    // Determine registration status based on capacity
    let registrationStatus = 'confirmed';
    if (event.capacity && confirmedCount && confirmedCount >= event.capacity) {
      registrationStatus = 'pending'; // Add to waitlist
    }

    const registrationData = {
      event_id: id,
      member_id: body.member_id,
      status: registrationStatus,
      registration_date: new Date().toISOString(),
      number_of_guests: body.number_of_guests || 0,
      total_attendees: 1 + (body.number_of_guests || 0),
      dietary_restrictions: body.dietary_restrictions,
      special_requests: body.special_requests,
      notes: body.notes,
    };

    const { data: registration, error } = await supabase
      .from('event_registrations')
      .insert([registrationData])
      .select(`
        *,
        members:member_id (
          id,
          first_name,
          last_name,
          email,
          phone,
          tier
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update event's current registrations count if confirmed
    if (registrationStatus === 'confirmed') {
      await supabase
        .from('events')
        .update({ current_registrations: (event.current_registrations || 0) + 1 })
        .eq('id', id);
    }

    // Log member activity
    await supabase
      .from('member_activities')
      .insert([{
        member_id: body.member_id,
        activity_type: 'event_registration',
        activity_description: `Registered for event: ${event.name || 'Event'}`,
        related_event_id: id
      }]);

    return NextResponse.json({ 
      registration,
      message: registrationStatus === 'pending' 
        ? 'Added to waitlist - event is at capacity'
        : 'Registration confirmed'
    }, { status: 201 });
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