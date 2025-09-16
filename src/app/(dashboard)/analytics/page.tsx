'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OverviewCards } from '@/components/charts/overview-cards';
import { MemberGrowthChart } from '@/components/charts/member-growth-chart';
import { DonationTrendsChart } from '@/components/charts/donation-trends-chart';
import { TierDistributionChart } from '@/components/charts/tier-distribution-chart';
import { RecentActivities } from '@/components/charts/recent-activities';

interface AnalyticsData {
  overview: {
    total_members: number;
    new_members_this_month: number;
    total_donations_amount: number;
    donations_this_month: number;
    average_donation: number;
    total_events: number;
    active_events: number;
    total_event_registrations: number;
    event_revenue: number;
    total_communications: number;
    total_recipients_reached: number;
    average_open_rate: number;
    average_engagement_score: number;
  };
  growth_data: Array<{
    month: string;
    new_members: number;
    total_members: number;
  }>;
  donation_trends: Array<{
    month: string;
    total_amount: number;
    donation_count: number;
    average_amount: number;
  }>;
  tier_distribution: Array<{
    tier: string;
    count: number;
    percentage: number;
    total_donated: number;
  }>;
  top_donors: Array<{
    member_id: string;
    total_donated: number;
    tier: string;
  }>;
  donations_by_method: Record<string, number>;
  monthly_comparison: {
    members: {
      current: number;
      previous: number;
      growth_rate: number;
    };
    donations: {
      current: number;
      previous: number;
      growth_rate: number;
    };
  };
  recent_activities: Array<{
    id: string;
    member_id: string;
    activity_type: string;
    description: string;
    created_at: string;
    members?: {
      first_name: string;
      last_name: string;
    };
  }>;
  date_range: {
    from: string;
    to: string;
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchAnalytics = async (from?: string, to?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (from) params.append('date_from', from);
      if (to) params.append('date_to', to);

      const response = await fetch(`/api/analytics?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set default date range (last 12 months)
    const now = new Date();
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(now.getMonth() - 12);

    setDateFrom(twelveMonthsAgo.toISOString().split('T')[0]);
    setDateTo(now.toISOString().split('T')[0]);

    fetchAnalytics();
  }, []);

  const handleDateRangeUpdate = () => {
    fetchAnalytics(dateFrom, dateTo);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-center text-red-600">
              <p className="text-lg font-semibold">Error Loading Analytics</p>
              <p className="text-sm mt-2">{error}</p>
              <Button 
                onClick={() => fetchAnalytics()} 
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analyticsData) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your organization's performance
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-auto"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-auto"
          />
          <Button onClick={handleDateRangeUpdate} variant="outline">
            Update
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <OverviewCards 
        data={analyticsData.overview} 
        monthlyComparison={analyticsData.monthly_comparison}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MemberGrowthChart data={analyticsData.growth_data} />
        <DonationTrendsChart data={analyticsData.donation_trends} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TierDistributionChart data={analyticsData.tier_distribution} />
        <RecentActivities data={analyticsData.recent_activities} />
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Donors */}
        <Card>
          <CardHeader>
            <CardTitle>Top Donors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.top_donors.slice(0, 5).map((donor, index) => (
                <div key={donor.member_id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium">Member {donor.member_id.slice(-6)}</div>
                      <div className="text-sm text-muted-foreground capitalize">{donor.tier} Tier</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(donor.total_donated)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Donations by Method */}
        <Card>
          <CardHeader>
            <CardTitle>Donations by Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analyticsData.donations_by_method).map(([method, amount]) => (
                <div key={method} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
                      {method === 'credit_card' ? '💳' : 
                       method === 'paypal' ? '🏦' :
                       method === 'bank_transfer' ? '🏛️' : '💰'}
                    </div>
                    <span className="font-medium capitalize">{method.replace('_', ' ')}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}