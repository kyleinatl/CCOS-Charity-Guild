import { NextRequest, NextResponse } from 'next/server';
import { automationService } from '@/lib/automation/automation-service';

/**
 * Process scheduled workflows - typically called by cron job
 */
export async function POST(request: NextRequest) {
  try {
    // Verify the request is coming from a legitimate source
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CRON_SECRET || 'development-token';
    
    if (authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Processing scheduled workflows...');
    await automationService.processScheduledWorkflows();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Scheduled workflows processed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error processing scheduled workflows:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get workflow status from n8n
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workflowId = searchParams.get('workflow_id');
    
    if (!workflowId) {
      return NextResponse.json(
        { error: 'workflow_id parameter is required' },
        { status: 400 }
      );
    }

    const status = await automationService.getWorkflowStatus(workflowId);
    
    return NextResponse.json({ 
      workflow_id: workflowId,
      status: status || 'unknown'
    });
  } catch (error) {
    console.error('Error getting workflow status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}