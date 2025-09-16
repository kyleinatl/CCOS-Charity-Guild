import { NextRequest, NextResponse } from 'next/server';
import { donationAcknowledgmentWorkflow } from '@/lib/automation/workflows/donation-acknowledgment';
import { dataService } from '@/lib/data/data-service';

// GET /api/automation/donation-acknowledgment - Get acknowledgment history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const donationId = searchParams.get('donation_id');
    const memberId = searchParams.get('member_id');
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // For demo purposes, return mock acknowledgment data
    const mockAcknowledgments = [
      {
        id: 'ack_1',
        donation_id: 'don_123',
        member_id: 'mem_456',
        member_name: 'Sarah Johnson',
        member_email: 'sarah@example.com',
        donation_amount: 250.00,
        donation_designation: 'Education Program',
        acknowledgment_sent: true,
        acknowledgment_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        thank_you_sent: true,
        tax_receipt_sent: true,
        tier_upgrade_triggered: false,
        impact_update_scheduled: true,
        recognition_scheduled: false,
        workflow_completed: true,
        actions_executed: ['thank_you_email', 'tax_receipt', 'impact_update_scheduled'],
        scheduled_actions: 1,
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: 'ack_2',
        donation_id: 'don_124',
        member_id: 'mem_457',
        member_name: 'Michael Chen',
        member_email: 'michael@example.com',  
        donation_amount: 1000.00,
        donation_designation: 'General Fund',
        acknowledgment_sent: true,
        acknowledgment_date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        thank_you_sent: true,
        tax_receipt_sent: true,
        tier_upgrade_triggered: true,
        impact_update_scheduled: true,
        recognition_scheduled: true,
        workflow_completed: true,
        actions_executed: ['thank_you_email', 'tax_receipt', 'tier_upgrade_celebration', 'impact_update_scheduled', 'recognition_scheduled'],
        scheduled_actions: 2,
        created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },
      {
        id: 'ack_3',
        donation_id: 'don_125',
        member_id: 'mem_458',
        member_name: 'Emma Rodriguez',
        member_email: 'emma@example.com',
        donation_amount: 75.00,
        donation_designation: 'Community Outreach',
        acknowledgment_sent: false,
        acknowledgment_date: '',
        thank_you_sent: false,
        tax_receipt_sent: false,
        tier_upgrade_triggered: false,
        impact_update_scheduled: false,
        recognition_scheduled: false,
        workflow_completed: false,
        actions_executed: [],
        scheduled_actions: 0,
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },
    ];

    // Filter by status if provided
    let filteredAcknowledgments = mockAcknowledgments;
    if (status === 'pending') {
      filteredAcknowledgments = mockAcknowledgments.filter(a => !a.acknowledgment_sent);
    } else if (status === 'completed') {
      filteredAcknowledgments = mockAcknowledgments.filter(a => a.workflow_completed);
    } else if (status === 'failed') {
      filteredAcknowledgments = mockAcknowledgments.filter(a => a.acknowledgment_sent && !a.workflow_completed);
    }

    // Apply pagination
    const paginatedResults = filteredAcknowledgments.slice(offset, offset + limit);

    return NextResponse.json({
      acknowledgments: paginatedResults,
      total: filteredAcknowledgments.length,
      stats: {
        total_acknowledgments: mockAcknowledgments.length,
        pending_acknowledgments: mockAcknowledgments.filter(a => !a.acknowledgment_sent).length,
        completed_acknowledgments: mockAcknowledgments.filter(a => a.workflow_completed).length,
        success_rate: ((mockAcknowledgments.filter(a => a.workflow_completed).length / mockAcknowledgments.length) * 100).toFixed(1),
        avg_processing_time: 2.5,
      }
    });
  } catch (error) {
    console.error('Error fetching donation acknowledgments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donation acknowledgments' },
      { status: 500 }
    );
  }
}

// POST /api/automation/donation-acknowledgment - Manually trigger acknowledgment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { donation_id, member_id, retrigger = false } = body;

    if (!donation_id || !member_id) {
      return NextResponse.json(
        { error: 'Donation ID and Member ID are required' },
        { status: 400 }
      );
    }

    // For demo purposes, create mock donation and member data
    const donation = {
      id: donation_id,
      member_id: member_id,
      amount: 250.00,
      designation: 'General Fund',
      is_recurring: false,
      created_at: new Date().toISOString(),
    };

    const member = {
      id: member_id,
      first_name: 'Demo',
      last_name: 'User',
      email: 'demo@example.com',
      membership_tier: 'supporter',
      created_at: new Date().toISOString(),
    };

    // Execute the acknowledgment workflow
    const result = await donationAcknowledgmentWorkflow.executeDonationAcknowledgment(
      donation,
      member,
      {
        sendThankYouEmail: true,
        thankYouEmailDelay: 0,
        sendTaxReceipt: true,
        taxReceiptDelay: 2,
        checkTierUpgrade: true,
        tierUpgradeDelay: 1,
        sendImpactUpdate: true,
        impactUpdateDelay: 24,
        personalizedContent: true,
        createFollowUpTask: true,
      }
    );

    return NextResponse.json({
      success: result.success,
      donation_id,
      member_id,
      actions_executed: result.actionsExecuted,
      scheduled_tasks: result.scheduledTasks.length,
      errors: result.errors,
      message: result.success 
        ? 'Donation acknowledgment workflow executed successfully'
        : 'Donation acknowledgment workflow completed with errors',
    });
  } catch (error) {
    console.error('Error triggering donation acknowledgment:', error);
    return NextResponse.json(
      { error: 'Failed to trigger donation acknowledgment' },
      { status: 500 }
    );
  }
}

// PUT /api/automation/donation-acknowledgment/[id] - Update acknowledgment status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { acknowledgment_id, status, notes } = body;

    if (!acknowledgment_id) {
      return NextResponse.json(
        { error: 'Acknowledgment ID is required' },
        { status: 400 }
      );
    }

    // In production, update the acknowledgment record in database
    console.log(`Updating acknowledgment ${acknowledgment_id}:`, { status, notes });

    return NextResponse.json({
      success: true,
      acknowledgment_id,
      status,
      updated_at: new Date().toISOString(),
      message: 'Acknowledgment status updated successfully',
    });
  } catch (error) {
    console.error('Error updating acknowledgment status:', error);
    return NextResponse.json(
      { error: 'Failed to update acknowledgment status' },
      { status: 500 }
    );
  }
}