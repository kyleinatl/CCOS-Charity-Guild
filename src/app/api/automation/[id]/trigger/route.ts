import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { automationService } from '@/lib/automation/automation-service';

/**
 * Manually trigger an automation
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { id } = await params;

    // Get the automation
    const { data: automation, error: automationError } = await supabase
      .from('automations')
      .select('*')
      .eq('id', id)
      .single();

    if (automationError) {
      if (automationError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Automation not found' }, { status: 404 });
      }
      return NextResponse.json({ error: automationError.message }, { status: 500 });
    }

    if (!automation || automation.status !== 'active') {
      return NextResponse.json(
        { error: 'Automation is not active' },
        { status: 400 }
      );
    }

    // Get trigger data from request body
    const triggerData = body.trigger_data || {};
    
    try {
      // Execute the automation based on its type
      switch (automation.trigger_type) {
        case 'member_onboarding':
          if (!triggerData.member_id) {
            return NextResponse.json(
              { error: 'member_id is required for member onboarding trigger' },
              { status: 400 }
            );
          }
          
          // Get member data
          const { data: member, error: memberError } = await supabase
            .from('members')
            .select('*')
            .eq('id', triggerData.member_id)
            .single();

          if (memberError || !member) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
          }

          await automationService.triggerMemberOnboarding(member);
          break;

        case 'donation_acknowledgment':
          if (!triggerData.donation_id || !triggerData.member_id) {
            return NextResponse.json(
              { error: 'donation_id and member_id are required for donation acknowledgment trigger' },
              { status: 400 }
            );
          }

          // Get donation and member data
          const [donationResult, memberResult] = await Promise.all([
            supabase.from('donations').select('*').eq('id', triggerData.donation_id).single(),
            supabase.from('members').select('*').eq('id', triggerData.member_id).single()
          ]);

          if (donationResult.error || !donationResult.data) {
            return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
          }
          if (memberResult.error || !memberResult.data) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
          }

          await automationService.triggerDonationAcknowledgment(donationResult.data, memberResult.data);
          break;

        case 'event_reminder':
          if (!triggerData.event_id || !triggerData.member_id || !triggerData.reminder_type) {
            return NextResponse.json(
              { error: 'event_id, member_id, and reminder_type are required for event reminder trigger' },
              { status: 400 }
            );
          }

          // Get event and member data
          const [eventResult, memberEventResult] = await Promise.all([
            supabase.from('events').select('*').eq('id', triggerData.event_id).single(),
            supabase.from('members').select('*').eq('id', triggerData.member_id).single()
          ]);

          if (eventResult.error || !eventResult.data) {
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
          }
          if (memberEventResult.error || !memberEventResult.data) {
            return NextResponse.json({ error: 'Member not found' }, { status: 404 });
          }

          await automationService.triggerEventReminder(
            eventResult.data,
            memberEventResult.data,
            triggerData.reminder_type
          );
          break;

        default:
          return NextResponse.json(
            { error: `Unsupported automation trigger type: ${automation.trigger_type}` },
            { status: 400 }
          );
      }

      // Update automation run count
      await supabase
        .from('automations')
        .update({
          last_run: new Date().toISOString(),
          run_count: automation.run_count + 1
        })
        .eq('id', params.id);

      return NextResponse.json({ 
        success: true, 
        message: `Automation "${automation.name}" triggered successfully` 
      });

    } catch (executionError) {
      console.error('Error executing automation:', executionError);
      
      // Log the failed execution
      const errorMessage = executionError instanceof Error ? executionError.message : 'Unknown error';
      await supabase
        .from('automation_logs')
        .insert([{
          automation_id: params.id,
          member_id: triggerData.member_id || null,
          trigger_data: triggerData,
          success: false,
          error_message: errorMessage
        }]);

      return NextResponse.json(
        { error: `Automation execution failed: ${errorMessage}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error triggering automation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}