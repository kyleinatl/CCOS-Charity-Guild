'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface RecentActivitiesProps {
  data: Array<{
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
}

export function RecentActivities({ data }: RecentActivitiesProps) {
  const getActivityIcon = (type: string) => {
    const icons = {
      donation: '💰',
      event_registration: '📅',
      communication_sent: '📧',
      profile_update: '👤',
      tier_upgrade: '⬆️',
      login: '🔐',
      default: '📝'
    };
    return icons[type as keyof typeof icons] || icons.default;
  };

  const getActivityColor = (type: string) => {
    const colors = {
      donation: 'bg-green-500',
      event_registration: 'bg-blue-500',
      communication_sent: 'bg-purple-500',
      profile_update: 'bg-orange-500',
      tier_upgrade: 'bg-yellow-500',
      login: 'bg-gray-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No recent activities
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <p className="text-sm text-muted-foreground">
          Latest member activities across the platform
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
              {/* Activity Icon */}
              <div className={`w-10 h-10 rounded-full ${getActivityColor(activity.activity_type)} flex items-center justify-center text-white text-sm`}>
                {getActivityIcon(activity.activity_type)}
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {activity.members 
                        ? `${activity.members.first_name} ${activity.members.last_name}`
                        : 'Unknown Member'
                      }
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {activity.activity_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatTimeAgo(activity.created_at)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}

          {data.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <div className="text-4xl mb-2">📝</div>
              <p>No recent activities to display</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}