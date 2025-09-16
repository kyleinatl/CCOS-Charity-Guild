'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AutomationDataTable } from '@/components/automation/automation-data-table';
import { AutomationStats } from '@/components/automation/automation-stats';
import { DonationAcknowledgmentManager } from '@/components/automation/donation-acknowledgment-manager';
import { 
  Zap, 
  Settings, 
  Play, 
  BarChart3, 
  Clock, 
  Users,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Plus
} from 'lucide-react';
import { Automation } from '@/types';

export default function AutomationPage() {
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLogsModal, setShowLogsModal] = useState(false);

  const handleEditAutomation = (automation: Automation) => {
    setSelectedAutomation(automation);
    setShowCreateModal(true);
  };

  const handleDeleteAutomation = (automation: Automation) => {
    if (confirm(`Are you sure you want to delete "${automation.name}"?`)) {
      // TODO: Implement delete functionality
      console.log('Delete automation:', automation.id);
    }
  };

  const handleTriggerAutomation = (automation: Automation) => {
    console.log('Automation triggered:', automation.name);
  };

  const handleViewLogs = (automation: Automation) => {
    setSelectedAutomation(automation);
    setShowLogsModal(true);
  };

  const quickActions = [
    {
      title: 'Member Onboarding',
      description: 'Welcome new members with automated email sequences',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      action: () => console.log('Create member onboarding automation')
    },
    {
      title: 'Donation Thank You',
      description: 'Send personalized thank you messages for donations',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
      action: () => console.log('Create donation thank you automation')
    },
    {
      title: 'Event Reminders',
      description: 'Automated event notifications and follow-ups',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600',
      action: () => console.log('Create event reminder automation')
    },
    {
      title: 'Newsletter Automation',
      description: 'Automated newsletter generation and distribution',
      icon: Mail,
      color: 'bg-orange-50 text-orange-600',
      action: () => console.log('Create newsletter automation')
    }
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Zap className="h-8 w-8 text-blue-600" />
            Automation & Workflows
          </h1>
          <p className="text-gray-600 mt-2">
            Automate member communications, donation processing, and engagement workflows
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-600" />
            Quick Start Templates
          </CardTitle>
          <CardDescription>
            Get started quickly with pre-built automation templates for common workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <div
                key={index}
                onClick={action.action}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className={`p-3 rounded-lg ${action.color} w-fit mb-3 group-hover:scale-110 transition-transform`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">{action.title}</h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="automations" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Automations
          </TabsTrigger>
          <TabsTrigger value="donations" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Donations
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Activity Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AutomationStats />
        </TabsContent>

        <TabsContent value="automations">
          <AutomationDataTable
            onEditAutomation={handleEditAutomation}
            onDeleteAutomation={handleDeleteAutomation}
            onTriggerAutomation={handleTriggerAutomation}
            onViewLogs={handleViewLogs}
          />
        </TabsContent>

        <TabsContent value="donations">
          <DonationAcknowledgmentManager />
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Automation Activity Logs
              </CardTitle>
              <CardDescription>
                Detailed logs of all automation executions and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Activity Logs</h3>
                <p>Detailed automation logs will be displayed here</p>
                <p className="text-sm mt-2">Including execution history, success rates, and error details</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Automations</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
                <p className="text-xs text-green-600 mt-1">+2 this week</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Play className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month Executions</p>
                <p className="text-2xl font-bold text-gray-900">1,247</p>
                <p className="text-xs text-blue-600 mt-1">+18% from last month</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">97.3%</p>
                <p className="text-xs text-green-600 mt-1">+1.2% improvement</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}