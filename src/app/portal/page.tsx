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
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-100">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-green-700 font-medium">Loading your member dashboard...</p>
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent">
                Welcome back, {memberProfile?.first_name}!
              </h1>
              <p className="text-green-600 mt-2 font-medium">
                Country Club of the South Charity Guild Member since {formatDate(dashboardData.stats.memberSince)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold bg-gradient-to-r from-amber-500 to-yellow-600 bg-clip-text text-transparent">
                {formatCurrency(dashboardData.stats.totalDonated)}
              </div>
              <p className="text-green-700 font-semibold">Total contributed</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-green-600 to-emerald-700 text-white hover:shadow-2xl transition-all hover:scale-105 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-green-100">
                Total Donated
              </CardTitle>
              <DollarSign className="h-5 w-5 text-amber-300" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{formatCurrency(dashboardData.stats.totalDonated)}</div>
              <p className="text-xs text-green-200">
                {dashboardData.stats.donationCount} donations
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white hover:shadow-2xl transition-all hover:scale-105 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-amber-100">
                Events Attended
              </CardTitle>
              <Calendar className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData.stats.eventsAttended}</div>
              <p className="text-xs text-amber-200">
                This year
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white hover:shadow-2xl transition-all hover:scale-105 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-emerald-100">
                Messages
              </CardTitle>
              <MessageSquare className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData.stats.messagesReceived}</div>
              <p className="text-xs text-emerald-200">
                Unread: {dashboardData.recentMessages.filter(m => !m.read).length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white hover:shadow-2xl transition-all hover:scale-105 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-semibold text-yellow-100">
                Engagement Score
              </CardTitle>
              <Trophy className="h-5 w-5 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{dashboardData.stats.engagementScore}%</div>
              <p className="text-xs text-yellow-200">
                Above average
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tier Progress */}
        <Card className="bg-white/90 backdrop-blur-sm border border-green-100 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber-200" />
              Membership Tier Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Badge className="capitalize bg-gradient-to-r from-amber-500 to-yellow-600 text-white">
                  {dashboardData.tierProgress.currentTier} Member
                </Badge>
                <span className="text-green-400 font-bold">→</span>
                <Badge variant="outline" className="capitalize border-green-300 text-green-700">
                  {dashboardData.tierProgress.nextTier} Member
                </Badge>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-green-800">
                  {formatCurrency(dashboardData.tierProgress.currentAmount)} / {formatCurrency(dashboardData.tierProgress.nextTierAmount)}
                </div>
                <div className="text-xs text-green-600">
                  {formatCurrency(dashboardData.tierProgress.nextTierAmount - dashboardData.tierProgress.currentAmount)} to next tier
                </div>
              </div>
            </div>
            <div className="w-full bg-green-100 rounded-full h-3 shadow-inner">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all shadow-sm"
                style={{ width: `${dashboardData.tierProgress.progressPercentage}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Donations */}
          <Card className="bg-white/90 backdrop-blur-sm border border-green-100 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-amber-200" />
                Recent Donations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {dashboardData.recentDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                        <DollarSign className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-green-800">{donation.campaign}</div>
                        <div className="text-sm text-green-600">{formatDate(donation.date)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-amber-600">{formatCurrency(donation.amount)}</div>
                      <div className="text-xs text-green-500 font-medium">{donation.method}</div>
                    </div>
                  </div>
                ))}
                <Button className="w-full mt-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700">
                  View All Donations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-white/90 backdrop-blur-sm border border-amber-100 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-white" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {dashboardData.upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-100 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-green-800">{event.title}</h4>
                      <Badge 
                        className={event.registrationStatus === 'registered' ? 
                          'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 
                          'border-amber-300 text-amber-700 bg-white'}
                      >
                        {event.registrationStatus === 'registered' ? 'Registered' : 'Available'}
                      </Badge>
                    </div>
                    <div className="text-sm text-green-700 space-y-2">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-amber-600" />
                        {formatDate(event.date)} at {event.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-amber-600" />
                        {event.location}
                      </div>
                      {event.fee > 0 && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-amber-600" />
                          {formatCurrency(event.fee)}
                        </div>
                      )}
                    </div>
                    {event.registrationStatus !== 'registered' && (
                      <Button size="sm" className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700">
                        Register Now
                      </Button>
                    )}
                  </div>
                ))}
                <Button className="w-full mt-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700">
                  View All Events
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Messages */}
        <Card className="bg-white/90 backdrop-blur-sm border border-emerald-100 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-white" />
              Recent Messages
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {dashboardData.recentMessages.map((message) => (
                <div key={message.id} className={`p-4 rounded-xl border transition-all hover:shadow-md ${!message.read ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100'}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-semibold text-green-800 ${!message.read ? 'font-bold' : ''}`}>
                          {message.subject}
                        </h4>
                        {!message.read && (
                          <Badge className="text-xs bg-gradient-to-r from-emerald-500 to-teal-600 text-white">New</Badge>
                        )}
                      </div>
                      <p className="text-sm text-green-700 mt-1">{message.preview}</p>
                    </div>
                    <div className="text-xs text-green-600 font-medium">{formatDate(message.date)}</div>
                  </div>
                </div>
              ))}
              <Button className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700">
                View All Messages
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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