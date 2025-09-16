'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Filter,
  Heart,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from 'recharts';

// Sample data for charts
const donationTrends = [
  { month: 'Jan', amount: 12000, donors: 45 },
  { month: 'Feb', amount: 15500, donors: 52 },
  { month: 'Mar', amount: 18200, donors: 61 },
  { month: 'Apr', amount: 16800, donors: 58 },
  { month: 'May', amount: 22100, donors: 73 },
  { month: 'Jun', amount: 25400, donors: 84 },
  { month: 'Jul', amount: 28900, donors: 96 },
  { month: 'Aug', amount: 31200, donors: 105 },
];

const memberGrowth = [
  { month: 'Jan', total: 245, new: 12 },
  { month: 'Feb', total: 267, new: 22 },
  { month: 'Mar', total: 289, new: 22 },
  { month: 'Apr', total: 312, new: 23 },
  { month: 'May', total: 338, new: 26 },
  { month: 'Jun', total: 365, new: 27 },
  { month: 'Jul', total: 394, new: 29 },
  { month: 'Aug', total: 426, new: 32 },
];

const tierDistribution = [
  { name: 'Bronze', value: 156, color: '#CD7F32', percentage: 36.6 },
  { name: 'Silver', value: 89, color: '#C0C0C0', percentage: 20.9 },
  { name: 'Gold', value: 67, color: '#FFD700', percentage: 15.7 },
  { name: 'Platinum', value: 114, color: '#E5E4E2', percentage: 26.8 },
];

const recentActivities = [
  { id: 1, type: 'donation', member: 'Sarah Johnson', amount: '$500', time: '2 minutes ago', icon: DollarSign },
  { id: 2, type: 'member', member: 'Michael Chen joined', amount: null, time: '15 minutes ago', icon: Users },
  { id: 3, type: 'event', member: 'Annual Gala registration', amount: '$150', time: '1 hour ago', icon: Calendar },
  { id: 4, type: 'donation', member: 'David Rodriguez', amount: '$250', time: '2 hours ago', icon: DollarSign },
  { id: 5, type: 'member', member: 'Emily Davis upgraded to Gold', amount: null, time: '3 hours ago', icon: TrendingUp },
];

export function DashboardContent() {
  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Here's what's happening with your charity guild.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">426</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +8.2%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$184,290</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                +12.5%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-blue-600">
                3 upcoming this month
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Donation</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$432</div>
            <p className="text-xs text-muted-foreground">
              <span className="inline-flex items-center text-red-600">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                -2.1%
              </span>{' '}
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Donation Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Trends</CardTitle>
            <CardDescription>Monthly donation amounts and donor count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => [
                    name === 'amount' ? `$${value.toLocaleString()}` : value,
                    name === 'amount' ? 'Amount' : 'Donors'
                  ]} />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stackId="1"
                    stroke="#3B82F6"
                    fill="#3B82F6"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Member Growth */}
        <Card>
          <CardHeader>
            <CardTitle>Member Growth</CardTitle>
            <CardDescription>Total members and new members per month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={memberGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={{ fill: '#10B981' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="new"
                    stroke="#F59E0B"
                    strokeWidth={2}
                    dot={{ fill: '#F59E0B' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Member Tier Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Member Tiers</CardTitle>
            <CardDescription>Distribution of members by tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tierDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [
                    `${value} members (${props.payload.percentage}%)`,
                    props.payload.name
                  ]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {tierDistribution.map((tier) => (
                <div key={tier.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: tier.color }}
                    />
                    <span>{tier.name}</span>
                  </div>
                  <span className="font-medium">{tier.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest member activities and donations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <activity.icon className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.member}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  {activity.amount && (
                    <div className="flex-shrink-0">
                      <span className="text-sm font-medium text-green-600">
                        {activity.amount}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span>AI Insights</span>
          </CardTitle>
          <CardDescription>
            Smart recommendations based on your charity's data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <div className="flex items-start space-x-3">
                <Heart className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Engagement Opportunity</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    23 members haven't attended events in 6+ months. Consider sending a re-engagement campaign.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-100">
              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Donation Pattern</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    August donations are 15% higher than usual. Consider launching a matching campaign.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}