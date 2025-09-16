import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; registrationId: string }> }
) {
  try {
    const supabase = createClient();
    const body = await request.json();
    
    // Get current registration
    const { data: currentRegistration, error: fetchError } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events:event_id (id, name, capacity, current_registrations)
      `)
      .eq('id', params.registrationId)
      .eq('event_id', params.id)
      .single();

    if (fetchError || !currentRegistration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const { data: registration, error } = await supabase
      .from('event_registrations')
      .update(body)
      .eq('id', params.registrationId)
      .eq('event_id', params.id)
      .select(`
        *,
        members:member_id (
          id,
          first_name,
          last_name,
          email,
          phone,
          tier
        ),
        events:event_id (
          id,
          name,
          capacity,
          current_registrations
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Handle status changes that affect capacity
    if (body.status && body.status !== currentRegistration.status) {
      const event = currentRegistration.events;
      let capacityChange = 0;

      // If changing from confirmed to other status
      if (currentRegistration.status === 'confirmed' && body.status !== 'confirmed') {
        capacityChange = -1;
      }
      // If changing to confirmed from other status
      else if (currentRegistration.status !== 'confirmed' && body.status === 'confirmed') {
        // Check if event has capacity
        if (event.capacity && event.current_registrations >= event.capacity) {
          return NextResponse.json(
            { error: 'Event is at capacity' },
            { status: 400 }
          );
        }
        capacityChange = 1;
      }

      // Update event capacity if needed
      if (capacityChange !== 0) {
        await supabase
          .from('events')
          .update({ 
            current_registrations: Math.max(0, (event.current_registrations || 0) + capacityChange)
          })
          .eq('id', params.id);
      }

      // If someone was confirmed and now cancelled/no-show, try to promote from waitlist
      if (currentRegistration.status === 'confirmed' && 
          (body.status === 'cancelled' || body.status === 'no_show')) {
        
        // Find first pending registration to promote
        const { data: pendingRegistration } = await supabase
          .from('event_registrations')
          .select('id, member_id')
          .eq('event_id', params.id)
          .eq('status', 'pending')
          .order('registration_date', { ascending: true })
          .limit(1)
          .single();

        if (pendingRegistration) {
          await supabase
            .from('event_registrations')
            .update({ status: 'confirmed' })
            .eq('id', pendingRegistration.id);

          // Update capacity back to full
          await supabase
            .from('events')
            .update({ 
              current_registrations: event.current_registrations || 0
            })
            .eq('id', params.id);

          // Log activity for promoted member
          await supabase
            .from('member_activities')
            .insert([{
              member_id: pendingRegistration.member_id,
              activity_type: 'event_registration',
              activity_description: `Promoted from waitlist for event: ${event.name}`,
              related_event_id: params.id
            }]);
        }
      }

      // Log status change activity
      if (body.status === 'cancelled') {
        await supabase
          .from('member_activities')
          .insert([{
            member_id: registration.member_id,
            activity_type: 'event_registration',
            activity_description: `Cancelled registration for event: ${event.name}`,
            related_event_id: params.id
          }]);
      } else if (body.status === 'attended') {
        await supabase
          .from('member_activities')
          .insert([{
            member_id: registration.member_id,
            activity_type: 'event_attendance',
            activity_description: `Attended event: ${event.name}`,
            related_event_id: params.id
          }]);
      }
    }

    return NextResponse.json({ registration });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; registrationId: string }> }
) {
  try {
    const supabase = createClient();
    
    // Get registration details before deletion
    const { data: registration, error: fetchError } = await supabase
      .from('event_registrations')
      .select(`
        *,
        events:event_id (id, name, current_registrations)
      `)
      .eq('id', params.registrationId)
      .eq('event_id', params.id)
      .single();

    if (fetchError || !registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('event_registrations')
      .delete()
      .eq('id', params.registrationId)
      .eq('event_id', params.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update event capacity if registration was confirmed
    if (registration.status === 'confirmed') {
      const event = registration.events;
      await supabase
        .from('events')
        .update({ 
          current_registrations: Math.max(0, (event.current_registrations || 0) - 1)
        })
        .eq('id', params.id);

      // Try to promote someone from waitlist
      const { data: pendingRegistration } = await supabase
        .from('event_registrations')
        .select('id, member_id')
        .eq('event_id', params.id)
        .eq('status', 'pending')
        .order('registration_date', { ascending: true })
        .limit(1)
        .single();

      if (pendingRegistration) {
        await supabase
          .from('event_registrations')
          .update({ status: 'confirmed' })
          .eq('id', pendingRegistration.id);

        // Restore capacity count
        await supabase
          .from('events')
          .update({ 
            current_registrations: event.current_registrations || 0
          })
          .eq('id', params.id);

        // Log promotion activity
        await supabase
          .from('member_activities')
          .insert([{
            member_id: pendingRegistration.member_id,
            activity_type: 'event_registration',
            activity_description: `Promoted from waitlist for event: ${event.name}`,
            related_event_id: params.id
          }]);
      }
    }

    // Log cancellation activity
    await supabase
      .from('member_activities')
      .insert([{
        member_id: registration.member_id,
        activity_type: 'event_registration',
        activity_description: `Registration deleted for event: ${registration.events.name}`,
        related_event_id: params.id
      }]);

    return NextResponse.json({ message: 'Registration deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}