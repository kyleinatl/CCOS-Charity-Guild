import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { CreateEventSchema } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search');
    const status = searchParams.get('status');
    const eventType = searchParams.get('event_type');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const isVirtual = searchParams.get('is_virtual');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('events')
      .select(`
        *,
        registrations:event_registrations(count),
        confirmed_registrations:event_registrations!inner(count)
      `)
      .order('start_date', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,venue_name.ilike.%${search}%`);
    }
    
    if (status) {
      query = query.eq('status', status);
    }
    
    if (eventType) {
      query = query.eq('event_type', eventType);
    }
    
    if (dateFrom) {
      query = query.gte('start_date', dateFrom);
    }
    
    if (dateTo) {
      query = query.lte('start_date', dateTo);
    }
    
    if (isVirtual !== null) {
      query = query.eq('is_virtual', isVirtual === 'true');
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    // Get paginated results with registration counts
    const { data: events, error } = await query.range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate additional metrics for each event
    const enrichedEvents = await Promise.all(events.map(async (event) => {
      // Get confirmed registrations count
      const { count: confirmedCount } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)
        .eq('status', 'confirmed');

      // Get waitlist count if capacity is reached
      const { count: waitlistCount } = await supabase
        .from('event_registrations')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)
        .eq('status', 'pending');

      return {
        ...event,
        confirmed_registrations: confirmedCount || 0,
        waitlist_count: waitlistCount || 0,
        available_spots: event.capacity ? Math.max(0, event.capacity - (confirmedCount || 0)) : null
      };
    }));

    return NextResponse.json({
      events: enrichedEvents,
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
    const body = await request.json();
    
    // Validate request body
    const validatedData = CreateEventSchema.parse(body);
    
    const eventData = {
      ...validatedData,
      current_registrations: 0,
      total_raised: 0,
    };

    const { data: event, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ event }, { status: 201 });
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