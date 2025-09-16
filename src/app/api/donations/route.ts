import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { CreateDonationSchema } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const search = searchParams.get('search');
    const method = searchParams.get('method');
    const designation = searchParams.get('designation');
    const memberId = searchParams.get('member_id');
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const minAmount = searchParams.get('min_amount');
    const maxAmount = searchParams.get('max_amount');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabase
      .from('donations')
      .select(`
        *,
        members:member_id (
          id,
          first_name,
          last_name,
          email,
          tier
        )
      `)
      .order('donation_date', { ascending: false });

    // Apply filters
    if (search) {
      // Search by member name, email, or transaction ID
      query = query.or(`transaction_id.ilike.%${search}%,members.first_name.ilike.%${search}%,members.last_name.ilike.%${search}%,members.email.ilike.%${search}%`);
    }
    
    if (method) {
      query = query.eq('method', method);
    }
    
    if (designation) {
      query = query.eq('designation', designation);
    }
    
    if (memberId) {
      query = query.eq('member_id', memberId);
    }
    
    if (dateFrom) {
      query = query.gte('donation_date', dateFrom);
    }
    
    if (dateTo) {
      query = query.lte('donation_date', dateTo);
    }
    
    if (minAmount) {
      query = query.gte('amount', parseFloat(minAmount));
    }
    
    if (maxAmount) {
      query = query.lte('amount', parseFloat(maxAmount));
    }

    // Get total count for pagination
    const { count } = await supabase
      .from('donations')
      .select('*', { count: 'exact', head: true });

    // Get paginated results
    const { data: donations, error } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Calculate total amount for current filtered results
    const { data: totalData } = await supabase
      .from('donations')
      .select('amount')
      .eq('member_id', memberId || '');

    const totalAmount = totalData?.reduce((sum, donation) => sum + donation.amount, 0) || 0;

    return NextResponse.json({
      donations,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      },
      summary: {
        totalAmount,
        totalCount: count || 0
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
    const validatedData = CreateDonationSchema.parse(body);
    
    // Calculate net amount (subtract processing fee)
    const netAmount = validatedData.amount - (validatedData.processing_fee || 0);
    
    // Generate receipt number
    const receiptNumber = `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const donationData = {
      ...validatedData,
      net_amount: netAmount,
      receipt_number: receiptNumber,
      donation_date: validatedData.donation_date || new Date().toISOString(),
    };

    const { data: donation, error } = await supabase
      .from('donations')
      .insert([donationData])
      .select(`
        *,
        members:member_id (
          id,
          first_name,
          last_name,
          email,
          tier
        )
      `)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update member's total donated amount and potentially their tier
    const { data: member } = await supabase
      .from('members')
      .select('total_donated')
      .eq('id', validatedData.member_id)
      .single();

    if (member) {
      const newTotalDonated = member.total_donated + validatedData.amount;
      
      // Calculate new tier based on total donated
      let newTier = 'bronze';
      if (newTotalDonated >= 10000) newTier = 'platinum';
      else if (newTotalDonated >= 5000) newTier = 'gold';
      else if (newTotalDonated >= 1000) newTier = 'silver';
      
      await supabase
        .from('members')
        .update({
          total_donated: newTotalDonated,
          last_donation_date: donationData.donation_date,
          tier: newTier
        })
        .eq('id', validatedData.member_id);

      // Log member activity
      await supabase
        .from('member_activities')
        .insert([{
          member_id: validatedData.member_id,
          activity_type: 'donation',
          activity_description: `Donated $${validatedData.amount} to ${validatedData.designation}`,
          activity_value: validatedData.amount,
          related_donation_id: donation.id
        }]);
    }

    return NextResponse.json({ donation }, { status: 201 });
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