'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface OverviewCardsProps {
  data: {
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
  monthlyComparison?: {
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
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

const formatPercentage = (rate: number) => {
  return `${rate.toFixed(1)}%`;
};

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};

const GrowthIndicator = ({ value }: { value: number }) => {
  const isPositive = value > 0;
  const isNeutral = value === 0;
  
  return (
    <Badge 
      variant={isPositive ? "default" : isNeutral ? "secondary" : "destructive"}
      className="ml-2"
    >
      {isPositive ? "↗" : isNeutral ? "→" : "↘"} {formatPercentage(Math.abs(value))}
    </Badge>
  );
};

export function OverviewCards({ data, monthlyComparison }: OverviewCardsProps) {
  const cards = [
    {
      title: "Total Members",
      value: formatNumber(data.total_members),
      subtitle: `${data.new_members_this_month} new this month`,
      growth: monthlyComparison?.members.growth_rate,
      icon: "👥"
    },
    {
      title: "Total Donations",
      value: formatCurrency(data.total_donations_amount),
      subtitle: `${formatCurrency(data.donations_this_month)} this month`,
      growth: monthlyComparison?.donations.growth_rate,
      icon: "💰"
    },
    {
      title: "Average Donation",
      value: formatCurrency(data.average_donation),
      subtitle: `From ${formatNumber(data.total_donations_amount / data.average_donation || 0)} donations`,
      icon: "📊"
    },
    {
      title: "Active Events",
      value: formatNumber(data.active_events),
      subtitle: `${data.total_event_registrations} total registrations`,
      icon: "📅"
    },
    {
      title: "Event Revenue",
      value: formatCurrency(data.event_revenue),
      subtitle: `From ${data.total_events} events`,
      icon: "🎟️"
    },
    {
      title: "Communications Sent",
      value: formatNumber(data.total_communications),
      subtitle: `${formatNumber(data.total_recipients_reached)} recipients reached`,
      icon: "📧"
    },
    {
      title: "Email Open Rate",
      value: formatPercentage(data.average_open_rate),
      subtitle: "Average across all campaigns",
      icon: "📬"
    },
    {
      title: "Member Engagement",
      value: formatPercentage(data.average_engagement_score),
      subtitle: "Average engagement score",
      icon: "⭐"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              {card.title}
            </CardTitle>
            <span className="text-2xl">{card.icon}</span>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{card.value}</div>
              {card.growth !== undefined && (
                <GrowthIndicator value={card.growth} />
              )}
            </div>
                        <p className="text-xs text-green-600 mt-1">
              {card.subtitle}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}