'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Users, 
  TrendingUp, 
  MessageSquare, 
  Send, 
  Target, 
  Activity,
  Clock,
  BarChart3,
  Settings,
  PlayCircle,
  PauseCircle,
  Eye,
  MousePointer
} from 'lucide-react';

interface CommunicationStats {
  totalNewslettersSent: number;
  openRate: number;
  clickRate: number;
  activeCampaigns: number;
  scheduledEmails: number;
  engagementScore: number;
  segmentedAudiences: number;
  behavioralTriggers: number;
  reEngagementCampaigns: number;
  dripSequences: number;
}

interface Campaign {
  id: number;
  name: string;
  type: string;
  status: string;
  scheduledFor: string | null;
  audience: number;
  openRate: number;
  clickRate: number;
}

interface SegmentationRule {
  id: number;
  name: string;
  condition: string;
  weight: number;
  memberCount: number;
}

interface EngagementMetrics {
  averageEngagementScore: number;
  engagementTrends: Array<{ month: string; score: number }>;
  topPerformingCampaigns: Array<{ name: string; openRate: number; clickRate: number }>;
  channelPerformance: {
    email: { sent: number; opened: number; clicked: number };
    sms: { sent: number; opened: number; clicked: number };
    push: { sent: number; opened: number; clicked: number };
  };
}

export default function CommunicationAutomationDashboard() {
  const [stats, setStats] = useState<CommunicationStats | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [segmentationRules, setSegmentationRules] = useState<SegmentationRule[]>([]);
  const [engagementMetrics, setEngagementMetrics] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchCommunicationData();
  }, []);

  const fetchCommunicationData = async () => {
    try {
      setLoading(true);

      // Fetch all communication data in parallel
      const [statsRes, campaignsRes, rulesRes, metricsRes] = await Promise.all([
        fetch('/api/automation/communications?action=communication_stats'),
        fetch('/api/automation/communications?action=active_campaigns'),
        fetch('/api/automation/communications?action=segmentation_rules'),
        fetch('/api/automation/communications?action=engagement_metrics')
      ]);

      const [statsData, campaignsData, rulesData, metricsData] = await Promise.all([
        statsRes.json(),
        campaignsRes.json(),
        rulesRes.json(),
        metricsRes.json()
      ]);

      setStats(statsData);
      setCampaigns(campaignsData);
      setSegmentationRules(rulesData);
      setEngagementMetrics(metricsData);

    } catch (error) {
      console.error('Failed to fetch communication data:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerWorkflow = async (workflowType: string, data: any) => {
    try {
      const response = await fetch('/api/automation/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowType, data })
      });

      if (response.ok) {
        alert(`${workflowType} triggered successfully!`);
        fetchCommunicationData(); // Refresh data
      } else {
        alert('Failed to trigger workflow');
      }
    } catch (error) {
      console.error('Failed to trigger workflow:', error);
      alert('Failed to trigger workflow');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'newsletter': return <Mail className="w-4 h-4" />;
      case 'drip_campaign': return <Clock className="w-4 h-4" />;
      case 'behavioral': return <Activity className="w-4 h-4" />;
      case 'reengagement': return <Target className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading communication dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Communication Automation</h2>
          <p className="text-gray-600">Manage automated communication workflows and campaigns</p>
        </div>
        <Button onClick={fetchCommunicationData} className="flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Refresh Data
        </Button>
      </div>

      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Newsletters Sent</p>
                <h3 className="text-2xl font-bold">{stats.totalNewslettersSent.toLocaleString()}</h3>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Open Rate</p>
                <h3 className="text-2xl font-bold">{stats.openRate}%</h3>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Click Rate</p>
                <h3 className="text-2xl font-bold">{stats.clickRate}%</h3>
              </div>
              <MousePointer className="w-8 h-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Campaigns</p>
                <h3 className="text-2xl font-bold">{stats.activeCampaigns}</h3>
              </div>
              <Activity className="w-8 h-8 text-orange-600" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Score</p>
                <h3 className="text-2xl font-bold">{stats.engagementScore}</h3>
              </div>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="segmentation">Segmentation</TabsTrigger>
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => triggerWorkflow('newsletter_automation', { 
                    newsletterData: { subject: 'Monthly Update', content: 'Test content' },
                    segmentationRules: []
                  })}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Newsletter
                </Button>
                <Button 
                  onClick={() => triggerWorkflow('reengagement_campaign', { 
                    inactivityThreshold: 90 
                  })}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Target className="w-4 h-4" />
                  Re-engagement
                </Button>
                <Button 
                  onClick={() => triggerWorkflow('behavioral_trigger', {
                    member: { id: 1, first_name: 'Test', last_name: 'User' },
                    behaviorEvent: 'donation_made',
                    context: { conditions: {}, delay: 0 }
                  })}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Activity className="w-4 h-4" />
                  Test Behavioral
                </Button>
                <Button 
                  onClick={() => triggerWorkflow('drip_campaign', {
                    member: { id: 1, first_name: 'Test', last_name: 'User' },
                    campaignType: 'new_member_onboarding',
                    customData: {}
                  })}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4" />
                  Start Drip
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Scheduled Emails</span>
                  <Badge variant="outline">{stats?.scheduledEmails || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Behavioral Triggers</span>
                  <Badge variant="outline">{stats?.behavioralTriggers || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Drip Sequences</span>
                  <Badge variant="outline">{stats?.dripSequences || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Segmented Audiences</span>
                  <Badge variant="outline">{stats?.segmentedAudiences || 0}</Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Active Campaigns</h3>
              <Button className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                New Campaign
              </Button>
            </div>
            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getCampaignTypeIcon(campaign.type)}
                    <div>
                      <h4 className="font-medium">{campaign.name}</h4>
                      <p className="text-sm text-gray-600">
                        {campaign.audience.toLocaleString()} recipients
                        {campaign.scheduledFor && (
                          <span className="ml-2">
                            • Scheduled for {new Date(campaign.scheduledFor).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                      <span className="block">Open: {campaign.openRate}%</span>
                      <span className="block">Click: {campaign.clickRate}%</span>
                    </div>
                    <Badge className={`${getStatusColor(campaign.status)} text-white`}>
                      {campaign.status}
                    </Badge>
                    <div className="flex gap-2">
                      {campaign.status === 'active' ? (
                        <Button size="sm" variant="outline">
                          <PauseCircle className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline">
                          <PlayCircle className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Segmentation Tab */}
        <TabsContent value="segmentation" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Segmentation Rules</h3>
              <Button className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                New Segment
              </Button>
            </div>
            <div className="space-y-3">
              {segmentationRules.map((rule) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{rule.name}</h4>
                    <p className="text-sm text-gray-600">{rule.condition}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-gray-600">
                      <span className="block">Weight: {rule.weight}</span>
                      <span className="block">{rule.memberCount} members</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Newsletter Automation</h3>
              <p className="text-gray-600 mb-4">
                Automatically segment members and send personalized newsletters
              </p>
              <Button 
                onClick={() => triggerWorkflow('newsletter_automation', { 
                  newsletterData: { 
                    subject: 'Monthly Impact Report',
                    content: 'Your monthly update on our mission progress'
                  },
                  segmentationRules: [
                    { name: 'High Engagement', condition: 'high_engagement', weight: 10, matched: false },
                    { name: 'Recent Donors', condition: 'recent_donor', weight: 8, matched: false }
                  ]
                })}
                className="w-full"
              >
                Trigger Newsletter Automation
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Re-engagement Campaign</h3>
              <p className="text-gray-600 mb-4">
                Automatically identify and re-engage inactive members
              </p>
              <Button 
                onClick={() => triggerWorkflow('reengagement_campaign', { 
                  inactivityThreshold: 90 
                })}
                className="w-full"
              >
                Start Re-engagement Campaign
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Behavioral Triggers</h3>
              <p className="text-gray-600 mb-4">
                Respond to member actions with targeted communication sequences
              </p>
              <Button 
                onClick={() => triggerWorkflow('behavioral_trigger', {
                  member: { id: 1, first_name: 'Demo', last_name: 'User', email: 'demo@example.com' },
                  behaviorEvent: 'donation_made',
                  context: { 
                    conditions: { min_engagement_score: 50 },
                    delay: 24,
                    donation_amount: 100
                  }
                })}
                className="w-full"
              >
                Test Behavioral Trigger
              </Button>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Drip Campaigns</h3>
              <p className="text-gray-600 mb-4">
                Create time-based email sequences with conditional logic
              </p>
              <Button 
                onClick={() => triggerWorkflow('drip_campaign', {
                  member: { id: 1, first_name: 'Demo', last_name: 'User', email: 'demo@example.com' },
                  campaignType: 'new_member_onboarding',
                  customData: { signup_source: 'website' }
                })}
                className="w-full"
              >
                Start Drip Campaign
              </Button>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          {engagementMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Engagement Trends</h3>
                <div className="space-y-2">
                  {engagementMetrics.engagementTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{trend.month}</span>
                      <span className="font-medium">{trend.score}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Top Performing Campaigns</h3>
                <div className="space-y-3">
                  {engagementMetrics.topPerformingCampaigns.map((campaign, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{campaign.name}</span>
                        <span className="text-sm text-gray-600">{campaign.openRate}% open</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${campaign.openRate}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4">Channel Performance</h3>
                <div className="grid grid-cols-3 gap-6">
                  {Object.entries(engagementMetrics.channelPerformance).map(([channel, data]) => (
                    <div key={channel} className="text-center">
                      <h4 className="font-medium capitalize mb-2">{channel}</h4>
                      <div className="space-y-1">
                        <p className="text-2xl font-bold">{data.sent.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Sent</p>
                        <p className="text-sm">
                          {((data.opened / data.sent) * 100).toFixed(1)}% opened
                        </p>
                        <p className="text-sm">
                          {((data.clicked / data.sent) * 100).toFixed(1)}% clicked
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}