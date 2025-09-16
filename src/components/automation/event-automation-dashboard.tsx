'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  Calendar,
  Users,
  Mail,
  CheckCircle,
  Clock,
  AlertTriangle,
  Play,
  Pause,
  RefreshCw,
  Settings
} from 'lucide-react';

interface EventAutomationStats {
  total: number;
  successful: number;
  failed: number;
  successRate: number;
  byAutomation: Record<string, { total: number; successful: number; failed: number }>;
  recentLogs: Array<{
    id: string;
    automation_id: string;
    member_id: string;
    trigger_data: any;
    success: boolean;
    error_message?: string;
    created_at: string;
  }>;
}

interface EventStats {
  eventId: string;
  eventName: string;
  eventDate: string;
  status: string;
  registrationCount: number;
  capacity?: number;
}

interface WorkflowType {
  type: string;
  description: string;
}

export function EventAutomationDashboard() {
  const [stats, setStats] = useState<EventAutomationStats | null>(null);
  const [eventStats, setEventStats] = useState<EventStats | null>(null);
  const [workflows, setWorkflows] = useState<WorkflowType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [testLoading, setTestLoading] = useState<Record<string, boolean>>({});

  // Test data for demonstration
  const [testMemberId, setTestMemberId] = useState('');
  const [testRegistrationId, setTestRegistrationId] = useState('');

  useEffect(() => {
    loadAutomationStats();
  }, [selectedEventId]);

  const loadAutomationStats = async () => {
    try {
      setLoading(true);
      const url = selectedEventId 
        ? `/api/automation/events?eventId=${selectedEventId}` 
        : '/api/automation/events';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.automationStats);
        setEventStats(data.data.eventStats);
        setWorkflows(data.data.availableWorkflows);
      }
    } catch (error) {
      console.error('Failed to load automation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const triggerTestWorkflow = async (workflowType: string) => {
    if (!selectedEventId || !testMemberId) {
      alert('Please provide Event ID and Member ID for testing');
      return;
    }

    setTestLoading(prev => ({ ...prev, [workflowType]: true }));
    
    try {
      const payload: any = {
        eventId: selectedEventId,
        memberId: testMemberId,
        workflowType
      };

      // Add registration ID for workflows that require it
      if (['registration_confirmation', 'event_reminder', 'check_in', 'post_event_survey'].includes(workflowType)) {
        if (!testRegistrationId) {
          alert('Registration ID is required for this workflow type');
          return;
        }
        payload.registrationId = testRegistrationId;
      }

      // Add reminder type for event reminders
      if (workflowType === 'event_reminder') {
        payload.reminderType = '24h'; // Default for testing
      }

      const response = await fetch('/api/automation/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`${workflowType} workflow triggered successfully!`);
        await loadAutomationStats(); // Refresh stats
      } else {
        alert(`Failed to trigger workflow: ${data.error}`);
      }
    } catch (error) {
      console.error('Failed to trigger workflow:', error);
      alert('Failed to trigger workflow. Check console for details.');
    } finally {
      setTestLoading(prev => ({ ...prev, [workflowType]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (success: boolean) => {
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading automation dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Event Automation Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor event-related automation workflows
          </p>
        </div>
        <Button onClick={loadAutomationStats} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overview Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Executions</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Successful</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.successful}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.successRate}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      <Tabs defaultValue="workflows" className="space-y-4">
        <TabsList>
          <TabsTrigger value="workflows">Available Workflows</TabsTrigger>
          <TabsTrigger value="testing">Test Workflows</TabsTrigger>
          <TabsTrigger value="logs">Recent Activity</TabsTrigger>
          <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Automation Workflows</CardTitle>
              <CardDescription>
                Available automation workflows for event management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {workflows.map((workflow) => (
                <div key={workflow.type} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold capitalize">
                      {workflow.type.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {workflow.description}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">Active</Badge>
                    <Button
                      size="sm"
                      onClick={() => triggerTestWorkflow(workflow.type)}
                      disabled={testLoading[workflow.type]}
                    >
                      {testLoading[workflow.type] ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Event Automations</CardTitle>
              <CardDescription>
                Trigger automation workflows for testing purposes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Event ID</label>
                  <Input
                    placeholder="Enter event ID"
                    value={selectedEventId}
                    onChange={(e) => setSelectedEventId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Member ID</label>
                  <Input
                    placeholder="Enter member ID"
                    value={testMemberId}
                    onChange={(e) => setTestMemberId(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Registration ID</label>
                  <Input
                    placeholder="Enter registration ID"
                    value={testRegistrationId}
                    onChange={(e) => setTestRegistrationId(e.target.value)}
                  />
                </div>
              </div>

              {eventStats && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Current Event</h4>
                  <div className="mt-2 text-sm text-blue-800">
                    <p><strong>Name:</strong> {eventStats.eventName}</p>
                    <p><strong>Date:</strong> {formatDate(eventStats.eventDate)}</p>
                    <p><strong>Status:</strong> {eventStats.status}</p>
                    <p><strong>Registrations:</strong> {eventStats.registrationCount} 
                      {eventStats.capacity && ` / ${eventStats.capacity}`}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {workflows.map((workflow) => (
                  <Button
                    key={workflow.type}
                    onClick={() => triggerTestWorkflow(workflow.type)}
                    disabled={testLoading[workflow.type] || !selectedEventId || !testMemberId}
                    className="h-auto p-4 flex flex-col items-start"
                  >
                    <div className="flex items-center w-full">
                      {testLoading[workflow.type] ? (
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Play className="h-4 w-4 mr-2" />
                      )}
                      <span className="font-semibold capitalize">
                        {workflow.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <span className="text-xs text-left mt-1 opacity-75">
                      {workflow.description}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Automation Activity</CardTitle>
              <CardDescription>
                Latest automation executions and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.recentLogs && stats.recentLogs.length > 0 ? (
                <div className="space-y-2">
                  {stats.recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(log.success)}>
                            {log.success ? 'Success' : 'Failed'}
                          </Badge>
                          <span className="font-medium">{log.automation_id}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(log.created_at)}
                        </p>
                        {log.error_message && (
                          <p className="text-sm text-red-600 mt-1">
                            Error: {log.error_message}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No recent automation activity found
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Automation Statistics by Type</CardTitle>
              <CardDescription>
                Detailed breakdown of automation performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats?.byAutomation && Object.keys(stats.byAutomation).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(stats.byAutomation).map(([automationId, metrics]) => (
                    <div key={automationId} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{automationId}</h4>
                        <Badge variant="outline">
                          {Math.round((metrics.successful / metrics.total) * 100)}% success
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="ml-2 font-medium">{metrics.total}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Successful:</span>
                          <span className="ml-2 font-medium text-green-600">{metrics.successful}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Failed:</span>
                          <span className="ml-2 font-medium text-red-600">{metrics.failed}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No automation statistics available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}