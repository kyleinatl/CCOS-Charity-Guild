'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CommunicationStats {
  total_communications: number;
  total_recipients: number;
  average_delivery_rate: number;
  average_open_rate: number;
  average_click_rate: number;
  by_type: Record<string, {
    count: number;
    total_recipients: number;
    average_delivery_rate: number;
    average_open_rate: number;
    average_click_rate: number;
  }>;
  recent_performance: Array<{
    id: string;
    subject: string;
    type: string;
    sent_at: string;
    total_recipients: number;
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
  }>;
  engagement_trends: Array<{
    month: string;
    communications_sent: number;
    total_recipients: number;
    average_delivery_rate: number;
    average_open_rate: number;
    average_click_rate: number;
  }>;
  top_performing: Array<{
    id: string;
    subject: string;
    type: string;
    sent_at: string;
    total_recipients: number;
    open_rate: number;
    click_rate: number;
  }>;
  segment_performance: Record<string, {
    total: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    delivery_rate: number;
    open_rate: number;
    click_rate: number;
    bounce_rate: number;
  }>;
}

export function CommunicationAnalytics() {
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('3months');

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      const now = new Date();
      
      if (dateRange === '1month') {
        const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        params.set('date_from', oneMonthAgo.toISOString());
      } else if (dateRange === '3months') {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        params.set('date_from', threeMonthsAgo.toISOString());
      } else if (dateRange === '1year') {
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        params.set('date_from', oneYearAgo.toISOString());
      }

      const response = await fetch(`/api/communications/stats?${params}`);
      const data = await response.json();

      if (response.ok) {
        setStats(data);
      } else {
        console.error('Failed to fetch communication stats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching communication stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100) / 100}%`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      newsletter: { label: 'Newsletter', className: 'bg-purple-100 text-purple-800' },
      email_campaign: { label: 'Campaign', className: 'bg-orange-100 text-orange-800' },
      social_media: { label: 'Social Media', className: 'bg-pink-100 text-pink-800' },
      direct_email: { label: 'Direct Email', className: 'bg-indigo-100 text-indigo-800' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || { label: type, className: 'bg-gray-100 text-gray-800' };
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      bronze: { label: 'Bronze', className: 'bg-amber-100 text-amber-800' },
      silver: { label: 'Silver', className: 'bg-gray-100 text-gray-800' },
      gold: { label: 'Gold', className: 'bg-yellow-100 text-yellow-800' },
      platinum: { label: 'Platinum', className: 'bg-purple-100 text-purple-800' },
    };

    const config = tierConfig[tier as keyof typeof tierConfig] || { label: tier, className: 'bg-gray-100 text-gray-800' };
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Communication Analytics</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Failed to load communication analytics</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Communication Analytics</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-3 py-2 border rounded-md"
        >
          <option value="1month">Last Month</option>
          <option value="3months">Last 3 Months</option>
          <option value="1year">Last Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-sm font-medium text-gray-500">Total Communications</div>
          <div className="text-3xl font-bold text-gray-900">{stats.total_communications}</div>
          <div className="text-sm text-gray-500 mt-1">campaigns sent</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-500">Total Recipients</div>
          <div className="text-3xl font-bold text-blue-600">{stats.total_recipients.toLocaleString()}</div>
          <div className="text-sm text-gray-500 mt-1">emails delivered</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-500">Average Open Rate</div>
          <div className="text-3xl font-bold text-green-600">{formatPercentage(stats.average_open_rate)}</div>
          <div className="text-sm text-gray-500 mt-1">engagement rate</div>
        </Card>

        <Card className="p-6">
          <div className="text-sm font-medium text-gray-500">Average Click Rate</div>
          <div className="text-3xl font-bold text-purple-600">{formatPercentage(stats.average_click_rate)}</div>
          <div className="text-sm text-gray-500 mt-1">action rate</div>
        </Card>
      </div>

      {/* Performance by Type */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Performance by Communication Type</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Count</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Recipients</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Delivery Rate</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Open Rate</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Click Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {Object.entries(stats.by_type).map(([type, data]) => (
                <tr key={type}>
                  <td className="px-4 py-3">
                    {getTypeBadge(type)}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium">{data.count}</td>
                  <td className="px-4 py-3 text-sm">{data.total_recipients.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm">{formatPercentage(data.average_delivery_rate)}</td>
                  <td className="px-4 py-3 text-sm">{formatPercentage(data.average_open_rate)}</td>
                  <td className="px-4 py-3 text-sm">{formatPercentage(data.average_click_rate)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Top Performing Communications */}
      {stats.top_performing.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Communications</h3>
          <div className="space-y-4">
            {stats.top_performing.map((communication) => (
              <div key={communication.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{communication.subject}</div>
                  <div className="text-sm text-gray-500">
                    {getTypeBadge(communication.type)} • {formatDate(communication.sent_at)} • {communication.total_recipients} recipients
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {formatPercentage(communication.open_rate)} open • {formatPercentage(communication.click_rate)} click
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Performance */}
      {stats.recent_performance.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Communications</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Subject</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Sent</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Recipients</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Performance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recent_performance.map((communication) => (
                  <tr key={communication.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium">{communication.subject}</div>
                    </td>
                    <td className="px-4 py-3">
                      {getTypeBadge(communication.type)}
                    </td>
                    <td className="px-4 py-3 text-sm">{formatDate(communication.sent_at)}</td>
                    <td className="px-4 py-3 text-sm">{communication.total_recipients}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="space-x-2">
                        <span>📨 {formatPercentage(communication.delivery_rate)}</span>
                        <span>👁️ {formatPercentage(communication.open_rate)}</span>
                        <span>🖱️ {formatPercentage(communication.click_rate)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Segment Performance */}
      {Object.keys(stats.segment_performance).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance by Member Tier</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Tier</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Delivery Rate</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Open Rate</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Click Rate</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Bounce Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Object.entries(stats.segment_performance).map(([tier, data]) => (
                  <tr key={tier}>
                    <td className="px-4 py-3">
                      {getTierBadge(tier)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">{data.total}</td>
                    <td className="px-4 py-3 text-sm">{formatPercentage(data.delivery_rate)}</td>
                    <td className="px-4 py-3 text-sm">{formatPercentage(data.open_rate)}</td>
                    <td className="px-4 py-3 text-sm">{formatPercentage(data.click_rate)}</td>
                    <td className="px-4 py-3 text-sm">{formatPercentage(data.bounce_rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Monthly Trends */}
      {stats.engagement_trends.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Monthly Engagement Trends</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Month</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Communications</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Recipients</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Avg Delivery</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Avg Open</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Avg Click</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.engagement_trends.slice(-6).map((trend) => (
                  <tr key={trend.month}>
                    <td className="px-4 py-3 text-sm font-medium">
                      {new Date(trend.month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-4 py-3 text-sm">{trend.communications_sent}</td>
                    <td className="px-4 py-3 text-sm">{trend.total_recipients.toLocaleString()}</td>
                    <td className="px-4 py-3 text-sm">{formatPercentage(trend.average_delivery_rate)}</td>
                    <td className="px-4 py-3 text-sm">{formatPercentage(trend.average_open_rate)}</td>
                    <td className="px-4 py-3 text-sm">{formatPercentage(trend.average_click_rate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}