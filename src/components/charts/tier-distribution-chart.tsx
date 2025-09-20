'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TierDistributionChartProps {
  data: Array<{
    tier: string;
    count: number;
    percentage: number;
    total_donated: number;
  }>;
}

export function TierDistributionChart({ data }: TierDistributionChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Member Tier Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-green-600">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const tierColors = {
    bronze: 'bg-amber-600',
    silver: 'bg-gray-400',
    gold: 'bg-yellow-500',
    platinum: 'bg-purple-600',
    diamond: 'bg-cyan-500'
  };

  const getTierColor = (tier: string) => {
    return tierColors[tier.toLowerCase() as keyof typeof tierColors] || 'bg-blue-500';
  };

  const getTierEmoji = (tier: string) => {
    const emojis = {
      bronze: '🥉',
      silver: '🥈',
      gold: '🥇',
      platinum: '💎',
      diamond: '💠'
    };
    return emojis[tier.toLowerCase() as keyof typeof emojis] || '⭐';
  };

  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercentage = 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Member Tier Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Pie Chart */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {data.map((item, index) => {
                  const percentage = (item.count / total) * 100;
                  const strokeDasharray = `${percentage * 2.51} ${251 - percentage * 2.51}`;
                  const strokeDashoffset = -cumulativePercentage * 2.51;
                  
                  const color = getTierColor(item.tier);
                  const strokeColor = color.replace('bg-', '').replace('-', '');
                  
                  cumulativePercentage += percentage;
                  
                  return (
                    <circle
                      key={index}
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={`var(--${strokeColor})`}
                      strokeWidth="8"
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      className={`${color.replace('bg-', 'stroke-')}`}
                    />
                  );
                })}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{total}</div>
                  <div className="text-sm text-green-600">Members</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend and Details */}
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 rounded ${getTierColor(item.tier)}`}></div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getTierEmoji(item.tier)}</span>
                    <span className="font-medium capitalize">{item.tier}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{item.count} members</div>
                  <div className="text-sm text-muted-foreground">
                    {item.percentage.toFixed(1)}% • {formatCurrency(item.total_donated)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.reduce((sum, item) => sum + item.total_donated, 0))}
              </div>
              <div className="text-sm text-green-600">Total Donated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(data.reduce((sum, item) => sum + item.total_donated, 0) / total)}
              </div>
              <div className="text-sm text-green-600">Avg per Member</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}