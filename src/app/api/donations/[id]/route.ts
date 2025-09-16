import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';
import { CreateDonationSchema } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const { id } = await params;
    
    const { data: donation, error } = await supabase
      .from('donations')
      .select(`
        *,
        members:member_id (
          id,
          first_name,
          last_name,
          email,
          phone,
          address_line1,
          address_line2,
          city,
          state,
          zip_code,
          country,
          tier
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ donation });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    const body = await request.json();
    
    // Get the current donation to calculate the difference
    const { data: currentDonation } = await supabase
      .from('donations')
      .select('amount, member_id')
      .eq('id', id)
      .single();

    if (!currentDonation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    // Validate request body
    const validatedData = CreateDonationSchema.parse(body);
    
    // Calculate net amount
    const netAmount = validatedData.amount - (validatedData.processing_fee || 0);
    
    const updatedData = {
      ...validatedData,
      net_amount: netAmount,
    };

    const { data: donation, error } = await supabase
      .from('donations')
      .update(updatedData)
      .eq('id', id)
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

    // Update member's total donated if amount changed
    if (currentDonation.amount !== validatedData.amount) {
      const { data: member } = await supabase
        .from('members')
        .select('total_donated')
        .eq('id', currentDonation.member_id)
        .single();

      if (member) {
        const amountDifference = validatedData.amount - currentDonation.amount;
        const newTotalDonated = member.total_donated + amountDifference;
        
        // Calculate new tier
        let newTier = 'bronze';
        if (newTotalDonated >= 10000) newTier = 'platinum';
        else if (newTotalDonated >= 5000) newTier = 'gold';
        else if (newTotalDonated >= 1000) newTier = 'silver';
        
        await supabase
          .from('members')
          .update({
            total_donated: newTotalDonated,
            tier: newTier
          })
          .eq('id', currentDonation.member_id);

        // Log member activity
        await supabase
          .from('member_activities')
          .insert([{
            member_id: currentDonation.member_id,
            activity_type: 'donation_updated',
            activity_description: `Donation updated: $${validatedData.amount} to ${validatedData.designation}`,
            activity_value: validatedData.amount,
            related_donation_id: donation.id
          }]);
      }
    }

    return NextResponse.json({ donation });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createClient();
    
    // Get the donation details before deleting
    const { data: donation } = await supabase
      .from('donations')
      .select('amount, member_id')
      .eq('id', id)
      .single();

    if (!donation) {
      return NextResponse.json({ error: 'Donation not found' }, { status: 404 });
    }

    const { error } = await supabase
      .from('donations')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Update member's total donated amount
    const { data: member } = await supabase
      .from('members')
      .select('total_donated')
      .eq('id', donation.member_id)
      .single();

    if (member) {
      const newTotalDonated = Math.max(0, member.total_donated - donation.amount);
      
      // Recalculate tier
      let newTier = 'bronze';
      if (newTotalDonated >= 10000) newTier = 'platinum';
      else if (newTotalDonated >= 5000) newTier = 'gold';
      else if (newTotalDonated >= 1000) newTier = 'silver';
      
      await supabase
        .from('members')
        .update({
          total_donated: newTotalDonated,
          tier: newTier
        })
        .eq('id', donation.member_id);

      // Log member activity
      await supabase
        .from('member_activities')
        .insert([{
          member_id: donation.member_id,
          activity_type: 'donation_deleted',
          activity_description: `Donation of $${donation.amount} was deleted`,
          activity_value: -donation.amount
        }]);
    }

    return NextResponse.json({ message: 'Donation deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}