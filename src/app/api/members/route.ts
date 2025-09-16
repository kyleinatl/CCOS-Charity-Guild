import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { CreateMemberSchema } from '@/types';
import { automationService } from '@/lib/automation/automation-service';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search');
    const tier = searchParams.get('tier');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('members')
      .select(`
        *,
        donations:donations(count),
        events:event_registrations(count)
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%`);
    }
    
    if (tier) {
      query = query.eq('tier', tier);
    }
    
    if (status) {
      query = query.eq('status', status);
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('members')
      .select('*', { count: 'exact', head: true });

    // Get paginated results
    const { data: members, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      members,
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
    const validatedData = CreateMemberSchema.parse(body);
    
    const { data: member, error } = await supabase
      .from('members')
      .insert([validatedData])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Trigger member onboarding automation
    try {
      await automationService.triggerMemberOnboarding(member);
    } catch (automationError) {
      console.error('Error triggering member onboarding automation:', automationError);
      // Don't fail the member creation if automation fails
    }

    return NextResponse.json({ member }, { status: 201 });
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