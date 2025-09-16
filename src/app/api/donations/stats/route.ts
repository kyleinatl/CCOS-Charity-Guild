import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const period = searchParams.get('period') || 'month'; // month, quarter, year

    // Base queries
    let totalQuery = supabase
      .from('donations')
      .select('amount, donation_date');

    let memberQuery = supabase
      .from('donations')
      .select('member_id')
      .not('member_id', 'is', null);

    // Apply date filters
    if (dateFrom) {
      totalQuery = totalQuery.gte('donation_date', dateFrom);
      memberQuery = memberQuery.gte('donation_date', dateFrom);
    }
    
    if (dateTo) {
      totalQuery = totalQuery.lte('donation_date', dateTo);
      memberQuery = memberQuery.lte('donation_date', dateTo);
    }

    // Get total donations and amount
    const { data: donations, error: donationsError } = await totalQuery;
    if (donationsError) throw donationsError;

    // Get unique donors count
    const { data: uniqueDonors, error: donorsError } = await memberQuery;
    if (donorsError) throw donorsError;

    // Calculate basic statistics
    const totalAmount = donations?.reduce((sum, donation) => sum + donation.amount, 0) || 0;
    const totalCount = donations?.length || 0;
    const uniqueDonorCount = new Set(uniqueDonors?.map(d => d.member_id)).size;
    const averageAmount = totalCount > 0 ? totalAmount / totalCount : 0;

    // Get donation trends by period
    const trendsQuery = supabase
      .from('donations')
      .select('amount, donation_date');

    if (dateFrom) trendsQuery.gte('donation_date', dateFrom);
    if (dateTo) trendsQuery.lte('donation_date', dateTo);

    const { data: trendData } = await trendsQuery;

    // Group by period
    const trendsByPeriod = trendData?.reduce((acc: any, donation) => {
      const date = new Date(donation.donation_date);
      let key: string;
      
      switch (period) {
        case 'year':
          key = date.getFullYear().toString();
          break;
        case 'quarter':
          key = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
          break;
        case 'month':
        default:
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          break;
      }
      
      if (!acc[key]) {
        acc[key] = { period: key, amount: 0, count: 0 };
      }
      
      acc[key].amount += donation.amount;
      acc[key].count += 1;
      
      return acc;
    }, {}) || {};

    const trends = Object.values(trendsByPeriod).sort((a: any, b: any) => 
      a.period.localeCompare(b.period)
    );

    // Get top donors
    const { data: topDonorsData } = await supabase
      .from('donations')
      .select(`
        member_id,
        amount,
        members:member_id (
          first_name,
          last_name,
          email
        )
      `)
      .gte('donation_date', dateFrom || '1970-01-01')
      .lte('donation_date', dateTo || '2099-12-31');

    const topDonors = topDonorsData?.reduce((acc: any, donation) => {
      const memberId = donation.member_id;
      if (!acc[memberId]) {
        acc[memberId] = {
          member_id: memberId,
          member: donation.members,
          total_amount: 0,
          donation_count: 0
        };
      }
      acc[memberId].total_amount += donation.amount;
      acc[memberId].donation_count += 1;
      return acc;
    }, {});

    const topDonorsList = Object.values(topDonors || {})
      .sort((a: any, b: any) => b.total_amount - a.total_amount)
      .slice(0, 10);

    // Get donation methods breakdown
    const { data: methodsData } = await supabase
      .from('donations')
      .select('method, amount')
      .gte('donation_date', dateFrom || '1970-01-01')
      .lte('donation_date', dateTo || '2099-12-31');

    const methodsBreakdown = methodsData?.reduce((acc: any, donation) => {
      if (!acc[donation.method]) {
        acc[donation.method] = { method: donation.method, amount: 0, count: 0 };
      }
      acc[donation.method].amount += donation.amount;
      acc[donation.method].count += 1;
      return acc;
    }, {}) || {};

    const methods = Object.values(methodsBreakdown);

    // Get designations breakdown
    const { data: designationsData } = await supabase
      .from('donations')
      .select('designation, amount')
      .gte('donation_date', dateFrom || '1970-01-01')
      .lte('donation_date', dateTo || '2099-12-31');

    const designationsBreakdown = designationsData?.reduce((acc: any, donation) => {
      if (!acc[donation.designation]) {
        acc[donation.designation] = { designation: donation.designation, amount: 0, count: 0 };
      }
      acc[donation.designation].amount += donation.amount;
      acc[donation.designation].count += 1;
      return acc;
    }, {}) || {};

    const designations = Object.values(designationsBreakdown);

    return NextResponse.json({
      summary: {
        totalAmount,
        totalCount,
        uniqueDonorCount,
        averageAmount
      },
      trends,
      topDonors: topDonorsList,
      methodsBreakdown: methods,
      designationsBreakdown: designations
    });
  } catch (error) {
    console.error('Error fetching donation statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}