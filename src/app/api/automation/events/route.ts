import { NextRequest, NextResponse } from 'next/server';
import { AutomationService } from '@/lib/automation/automation-service';
import { createClient } from '@/lib/supabase/client';

const automationService = new AutomationService();
const supabase = createClient();

/**
 * API endpoint for event automation workflows
 * Handles triggering of event-related automations
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { eventId, memberId, registrationId, workflowType, ...additionalData } = body;

    // Validate required parameters
    if (!eventId || !memberId || !workflowType) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required parameters: eventId, memberId, workflowType',
          message: 'Event ID, Member ID, and workflow type are required'
        },
        { status: 400 }
      );
    }

    // Get event and member data
    const [eventResult, memberResult, registrationResult] = await Promise.all([
      (supabase as any).from('events').select('*').eq('id', eventId).single(),
      (supabase as any).from('members').select('*').eq('id', memberId).single(),
      registrationId ? (supabase as any).from('event_registrations').select('*').eq('id', registrationId).single() : Promise.resolve({ data: null, error: null })
    ]);

    const event = eventResult.data as any;
    const member = memberResult.data as any;
    const registration = registrationResult.data as any;

    if (!event) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Event not found',
          message: `Event with ID ${eventId} not found`
        },
        { status: 404 }
      );
    }

    if (!member) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Member not found',
          message: `Member with ID ${memberId} not found`
        },
        { status: 404 }
      );
    }

    let result;

    // Execute the appropriate workflow based on type
    switch (workflowType) {
      case 'registration_confirmation':
        if (!registration) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Registration not found',
              message: 'Registration data is required for registration confirmation workflow'
            },
            { status: 400 }
          );
        }
        await automationService.triggerEventRegistrationConfirmation(event, member, registration);
        result = { 
          message: 'Event registration confirmation workflow triggered successfully',
          workflow: 'registration_confirmation',
          eventName: event.name,
          memberName: `${member.first_name} ${member.last_name}`
        };
        break;

      case 'event_reminder':
        if (!registration) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Registration not found',
              message: 'Registration data is required for event reminder workflow'
            },
            { status: 400 }
          );
        }
        const reminderType = additionalData.reminderType || '24h';
        await automationService.triggerEventReminder(event, member, registration, reminderType);
        result = { 
          message: `Event reminder (${reminderType}) triggered successfully`,
          workflow: 'event_reminder',
          reminderType,
          eventName: event.name,
          memberName: `${member.first_name} ${member.last_name}`
        };
        break;

      case 'check_in':
        if (!registration) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Registration not found',
              message: 'Registration data is required for check-in workflow'
            },
            { status: 400 }
          );
        }
        await automationService.triggerEventCheckIn(event, member, registration);
        result = { 
          message: 'Event check-in workflow triggered successfully',
          workflow: 'check_in',
          eventName: event.name,
          memberName: `${member.first_name} ${member.last_name}`
        };
        break;

      case 'post_event_survey':
        if (!registration) {
          return NextResponse.json(
            { 
              success: false, 
              error: 'Registration not found',
              message: 'Registration data is required for post-event survey workflow'
            },
            { status: 400 }
          );
        }
        await automationService.triggerPostEventSurvey(event, member, registration);
        result = { 
          message: 'Post-event survey workflow triggered successfully',
          workflow: 'post_event_survey',
          eventName: event.name,
          memberName: `${member.first_name} ${member.last_name}`
        };
        break;

      default:
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid workflow type',
            message: `Workflow type '${workflowType}' is not supported. Valid types: registration_confirmation, event_reminder, check_in, post_event_survey`
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: 'Event automation workflow executed successfully'
    });

  } catch (error) {
    console.error('Event automation API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to execute event automation workflow'
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Get event automation status and statistics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');
    const automationType = searchParams.get('type');

    // Get automation statistics
    const stats = await automationService.getAutomationStats(
      automationType || undefined
    );

    // If specific event requested, get event-specific data
    let eventStats = null;
    if (eventId) {
      try {
        const { data: event } = await (supabase as any).from('events').select('*').eq('id', eventId).single();
        if (event) {
          eventStats = {
            eventId: event.id,
            eventName: event.name,
            eventDate: event.start_date,
            status: event.status,
            registrationCount: event.current_registrations,
            capacity: event.capacity
          };
        }
      } catch (error) {
        console.warn('Could not fetch event stats:', error);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        automationStats: stats,
        eventStats,
        availableWorkflows: [
          {
            type: 'registration_confirmation',
            description: 'Sends confirmation email with event details and calendar invite'
          },
          {
            type: 'event_reminder',
            description: 'Sends reminder emails at scheduled intervals (1 week, 24h, 1h before)'
          },
          {
            type: 'check_in',
            description: 'Processes check-in and sends welcome notification'
          },
          {
            type: 'post_event_survey',
            description: 'Sends post-event survey and thank you message'
          }
        ]
      },
      message: 'Event automation status retrieved successfully'
    });

  } catch (error) {
    console.error('Event automation status API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error',
        message: 'Failed to retrieve event automation status'
      },
      { status: 500 }
    );
  }
}