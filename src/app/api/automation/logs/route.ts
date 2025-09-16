import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { automationService } from '@/lib/automation/automation-service';

/**
 * Get automation logs with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const automationId = searchParams.get('automation_id');
    const memberId = searchParams.get('member_id');
    const success = searchParams.get('success');
    
    const supabase = createClient();
    
    let query = supabase
      .from('automation_logs')
      .select(`
        *,
        automation:automations(name, trigger_type),
        member:members(first_name, last_name, email)
      `, { count: 'exact' })
      .order('created_at', { ascending: false });

    // Apply filters
    if (automationId) {
      query = query.eq('automation_id', automationId);
    }
    
    if (memberId) {
      query = query.eq('member_id', memberId);
    }

    if (success !== null && success !== undefined) {
      query = query.eq('success', success === 'true');
    }

    // Apply pagination
    const offset = (page - 1) * limit;
    query = query.range(offset, offset + limit - 1);

    const { data: logs, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching automation logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Get automation statistics
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const automationId = body.automation_id;
    
    const stats = await automationService.getAutomationStats(automationId);
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error getting automation stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}