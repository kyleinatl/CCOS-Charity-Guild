'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  FileText,
  TrendingUp,
  Heart,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Receipt,
  Gift,
  Calendar,
  User,
  DollarSign,
} from 'lucide-react';

interface DonationAcknowledgment {
  id: string;
  donation_id: string;
  member_id: string;
  member_name: string;
  member_email: string;
  donation_amount: number;
  donation_designation: string;
  acknowledgment_sent: boolean;
  acknowledgment_date: string;
  thank_you_sent: boolean;
  tax_receipt_sent: boolean;
  tier_upgrade_triggered: boolean;
  impact_update_scheduled: boolean;
  recognition_scheduled: boolean;
  workflow_completed: boolean;
  actions_executed: string[];
  scheduled_actions: number;
  created_at: string;
}

export function DonationAcknowledgmentManager() {
  const [acknowledgments, setAcknowledgments] = useState<DonationAcknowledgment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('recent');
  const [stats, setStats] = useState({
    total_acknowledgments: 0,
    pending_acknowledgments: 0,
    completed_acknowledgments: 0,
    success_rate: 0,
    avg_processing_time: 0,
  });

  useEffect(() => {
    loadAcknowledgments();
    loadStats();
  }, []);

  const loadAcknowledgments = async () => {
    try {
      // In production, this would fetch from your API
      const mockData: DonationAcknowledgment[] = [
        {
          id: '1',
          donation_id: 'don_123',
          member_id: 'mem_456',
          member_name: 'Sarah Johnson',
          member_email: 'sarah@example.com',
          donation_amount: 250.00,
          donation_designation: 'Education Program',
          acknowledgment_sent: true,
          acknowledgment_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          thank_you_sent: true,
          tax_receipt_sent: true,
          tier_upgrade_triggered: false,
          impact_update_scheduled: true,
          recognition_scheduled: false,
          workflow_completed: true,
          actions_executed: ['thank_you_email', 'tax_receipt', 'impact_update_scheduled'],
          scheduled_actions: 1,
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          donation_id: 'don_124',
          member_id: 'mem_457',
          member_name: 'Michael Chen',
          member_email: 'michael@example.com',
          donation_amount: 1000.00,
          donation_designation: 'General Fund',
          acknowledgment_sent: true,
          acknowledgment_date: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          thank_you_sent: true,
          tax_receipt_sent: true,
          tier_upgrade_triggered: true,
          impact_update_scheduled: true,
          recognition_scheduled: true,
          workflow_completed: true,
          actions_executed: ['thank_you_email', 'tax_receipt', 'tier_upgrade_celebration', 'impact_update_scheduled', 'recognition_scheduled'],
          scheduled_actions: 2,
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          donation_id: 'don_125',
          member_id: 'mem_458',
          member_name: 'Emma Rodriguez',
          member_email: 'emma@example.com',
          donation_amount: 75.00,
          donation_designation: 'Community Outreach',
          acknowledgment_sent: false,
          acknowledgment_date: '',
          thank_you_sent: false,
          tax_receipt_sent: false,
          tier_upgrade_triggered: false,
          impact_update_scheduled: false,
          recognition_scheduled: false,
          workflow_completed: false,
          actions_executed: [],
          scheduled_actions: 0,
          created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
      ];

      setAcknowledgments(mockData);
    } catch (error) {
      console.error('Error loading acknowledgments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Mock stats data
      setStats({
        total_acknowledgments: 247,
        pending_acknowledgments: 3,
        completed_acknowledgments: 244,
        success_rate: 98.8,
        avg_processing_time: 2.5,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const retriggerAcknowledgment = async (acknowledgmentId: string) => {
    try {
      setLoading(true);
      // In production, call your API to retrigger the acknowledgment
      console.log('Retriggering acknowledgment:', acknowledgmentId);
      
      // Refresh data
      await loadAcknowledgments();
    } catch (error) {
      console.error('Error retriggering acknowledgment:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStatusBadge = (acknowledgment: DonationAcknowledgment) => {
    if (acknowledgment.workflow_completed) {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    } else if (acknowledgment.acknowledgment_sent) {
      return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const renderActionStatus = (acknowledgment: DonationAcknowledgment) => {
    const actions = [
      { key: 'thank_you_sent', label: 'Thank You', icon: Mail, sent: acknowledgment.thank_you_sent },
      { key: 'tax_receipt_sent', label: 'Tax Receipt', icon: Receipt, sent: acknowledgment.tax_receipt_sent },
      { key: 'tier_upgrade_triggered', label: 'Tier Upgrade', icon: TrendingUp, sent: acknowledgment.tier_upgrade_triggered },
      { key: 'impact_update_scheduled', label: 'Impact Update', icon: Heart, sent: acknowledgment.impact_update_scheduled },
      { key: 'recognition_scheduled', label: 'Recognition', icon: Gift, sent: acknowledgment.recognition_scheduled },
    ];

    return (
      <div className="flex flex-wrap gap-1">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.key}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                action.sent
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Icon className="w-3 h-3" />
              {action.label}
              {action.sent && <CheckCircle className="w-3 h-3" />}
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold">{stats.total_acknowledgments}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending_acknowledgments}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{stats.completed_acknowledgments}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-green-600">{stats.success_rate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Time</p>
                <p className="text-2xl font-bold">{stats.avg_processing_time}m</p>
              </div>
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Donation Acknowledgments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="recent">Recent</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="failed">Failed</TabsTrigger>
            </TabsList>

            <TabsContent value="recent" className="space-y-4">
              <div className="space-y-4">
                {acknowledgments.map((acknowledgment) => (
                  <Card key={acknowledgment.id} className="p-4">
                    <div className="space-y-4">
                      {/* Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{acknowledgment.member_name}</h3>
                            <p className="text-sm text-gray-600">{acknowledgment.member_email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          {renderStatusBadge(acknowledgment)}
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(acknowledgment.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Donation Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-green-600" />
                          <span className="text-sm">
                            <strong>${acknowledgment.donation_amount.toFixed(2)}</strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-600" />
                          <span className="text-sm">{acknowledgment.donation_designation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm">
                            {acknowledgment.acknowledgment_date ? 
                              new Date(acknowledgment.acknowledgment_date).toLocaleDateString() : 
                              'Not processed'}
                          </span>
                        </div>
                      </div>

                      {/* Action Status */}
                      <div>
                        <h4 className="font-medium mb-2">Actions Status</h4>
                        {renderActionStatus(acknowledgment)}
                      </div>

                      {/* Progress Summary */}
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          {acknowledgment.actions_executed.length} actions completed, 
                          {acknowledgment.scheduled_actions} scheduled
                        </div>
                        {!acknowledgment.workflow_completed && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => retriggerAcknowledgment(acknowledgment.id)}
                            className="flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="pending">
              <div className="space-y-4">
                {acknowledgments
                  .filter(a => !a.acknowledgment_sent)
                  .map((acknowledgment) => (
                    <Card key={acknowledgment.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{acknowledgment.member_name}</h3>
                            <p className="text-sm text-gray-600">
                              ${acknowledgment.donation_amount.toFixed(2)} to {acknowledgment.donation_designation}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => retriggerAcknowledgment(acknowledgment.id)}
                          className="flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          Process Now
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="space-y-4">
                {acknowledgments
                  .filter(a => a.workflow_completed)
                  .map((acknowledgment) => (
                    <Card key={acknowledgment.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{acknowledgment.member_name}</h3>
                            <p className="text-sm text-gray-600">
                              ${acknowledgment.donation_amount.toFixed(2)} • Completed {new Date(acknowledgment.acknowledgment_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {acknowledgment.actions_executed.length} actions
                        </Badge>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="failed">
              <div className="text-center py-12">
                <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No failed acknowledgments - Great job!</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}