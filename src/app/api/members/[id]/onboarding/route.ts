import { NextRequest, NextResponse } from 'next/server';
import { memberOnboardingWorkflow } from '@/lib/automation/workflows/member-onboarding';

/**
 * Get member onboarding progress
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const progress = await memberOnboardingWorkflow.getOnboardingProgress(id);
    
    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error fetching onboarding progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Manually trigger onboarding workflow for a member
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { config } = body;

    // Get member details first
    const memberResponse = await fetch(`${request.nextUrl.origin}/api/members/${id}`);
    if (!memberResponse.ok) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const { member } = await memberResponse.json();

    // Execute onboarding workflow
    await memberOnboardingWorkflow.executeOnboarding(member, config);

    return NextResponse.json({ 
      success: true, 
      message: 'Onboarding workflow triggered successfully' 
    });
  } catch (error) {
    console.error('Error triggering onboarding workflow:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}