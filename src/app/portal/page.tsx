'use client';

import { useState, useEffect } from 'react';
// import { useAuth } from '@/lib/auth/auth-context';
import { MemberPortalLayout } from '@/components/layout/member-portal-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { dataService, logDataSource } from '@/lib/data';
import {
  DollarSign,
  Calendar,
  MessageSquare,
  TrendingUp,
  Heart,
  Trophy,
  Gift,
  Users,
  Clock,
  MapPin,
} from 'lucide-react';

interface DashboardData {
  stats: {
    totalDonated: number;
    donationCount: number;
    eventsAttended: number;
    messagesReceived: number;
    engagementScore: number;
    memberSince: string;
  };
  recentDonations: Array<{
    id: number;
    amount: number;
    date: string;
    campaign: string;
    method: string;
    status: string;
  }>;
  upcomingEvents: Array<{
    id: number;
    title: string;
    date: string;
    time: string;
    location: string;
    registrationStatus: string;
    fee: number;
  }>;
  recentMessages: Array<{
    id: number;
    subject: string;
    preview: string;
    date: string;
    read: boolean;
    type: string;
  }>;
  tierProgress: {
    currentTier: string;
    nextTier: string;
    currentAmount: number;
    nextTierAmount: number;
    progressPercentage: number;
  };
}

function MemberDashboard() {
  // Mock user for demo - in production this would come from useAuth()
  const user = {
    id: 'demo-user-id',
    email: 'john.doe@example.com',
    member_profile: {
      first_name: 'John',
      last_name: 'Doe',
      tier: 'gold',
      total_donated: 1250,
      engagement_score: 85
    }
  };
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (user?.id) {
        try {
          logDataSource('Portal Dashboard');
          const data = await dataService.getDashboardData(user.id);
          setDashboardData(data);
        } catch (error) {
          console.error('Failed to load dashboard data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDashboardData();
  }, [user?.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const memberProfile = user?.member_profile;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {memberProfile?.first_name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Member since {formatDate(dashboardData.stats.memberSince)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            {formatCurrency(dashboardData.stats.totalDonated)}
          </div>
          <p className="text-sm text-gray-600">Total contributed</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Donated
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.stats.totalDonated)}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.stats.donationCount} donations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Events Attended
            </CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.eventsAttended}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Messages
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.messagesReceived}</div>
            <p className="text-xs text-muted-foreground">
              Unread: {dashboardData.recentMessages.filter(m => !m.read).length}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Engagement Score
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.stats.engagementScore}%</div>
            <p className="text-xs text-muted-foreground">
              Above average
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Membership Tier Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="capitalize">
                {dashboardData.tierProgress.currentTier} Member
              </Badge>
              <span className="text-gray-400">→</span>
              <Badge variant="outline" className="capitalize">
                {dashboardData.tierProgress.nextTier} Member
              </Badge>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">
                {formatCurrency(dashboardData.tierProgress.currentAmount)} / {formatCurrency(dashboardData.tierProgress.nextTierAmount)}
              </div>
              <div className="text-xs text-gray-500">
                {formatCurrency(dashboardData.tierProgress.nextTierAmount - dashboardData.tierProgress.currentAmount)} to go
              </div>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${dashboardData.tierProgress.progressPercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Recent Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">{donation.campaign}</div>
                      <div className="text-sm text-gray-500">{formatDate(donation.date)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{formatCurrency(donation.amount)}</div>
                    <div className="text-xs text-gray-500">{donation.method}</div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                View All Donations
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{event.title}</h4>
                    <Badge 
                      variant={event.registrationStatus === 'registered' ? 'default' : 'outline'}
                      className="text-xs"
                    >
                      {event.registrationStatus === 'registered' ? 'Registered' : 'Available'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {formatDate(event.date)} at {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {event.location}
                    </div>
                    {event.fee > 0 && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3" />
                        {formatCurrency(event.fee)}
                      </div>
                    )}
                  </div>
                  {event.registrationStatus !== 'registered' && (
                    <Button size="sm" className="mt-3">
                      Register Now
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full mt-4">
                View All Events
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Messages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-purple-600" />
            Recent Messages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dashboardData.recentMessages.map((message) => (
              <div key={message.id} className={`p-3 rounded-lg border ${!message.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${!message.read ? 'font-semibold' : ''}`}>
                        {message.subject}
                      </h4>
                      {!message.read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{message.preview}</p>
                  </div>
                  <div className="text-xs text-gray-500">{formatDate(message.date)}</div>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              View All Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MemberPortalPage() {
  return (
    <MemberPortalLayout>
      <MemberDashboard />
    </MemberPortalLayout>
  );
}