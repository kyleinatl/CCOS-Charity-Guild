'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Activity, 
  Clock, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Settings
} from 'lucide-react';
import { Automation } from '@/types';

interface AutomationDataTableProps {
  onEditAutomation?: (automation: Automation) => void;
  onDeleteAutomation?: (automation: Automation) => void;
  onTriggerAutomation?: (automation: Automation) => void;
  onViewLogs?: (automation: Automation) => void;
}

export function AutomationDataTable({ 
  onEditAutomation, 
  onDeleteAutomation, 
  onTriggerAutomation,
  onViewLogs 
}: AutomationDataTableProps) {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [triggering, setTriggering] = useState<string | null>(null);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/automation');
      if (response.ok) {
        const data = await response.json();
        setAutomations(data.automations || []);
      }
    } catch (error) {
      console.error('Error fetching automations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusToggle = async (automation: Automation) => {
    try {
      const newStatus = automation.status === 'active' ? 'paused' : 'active';
      const response = await fetch(`/api/automation/${automation.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchAutomations(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating automation status:', error);
    }
  };

  const handleTriggerAutomation = async (automation: Automation) => {
    try {
      setTriggering(automation.id);
      const response = await fetch(`/api/automation/${automation.id}/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trigger_data: {
            manual_trigger: true,
            triggered_at: new Date().toISOString()
          }
        })
      });

      if (response.ok) {
        await fetchAutomations(); // Refresh to update run count
        if (onTriggerAutomation) {
          onTriggerAutomation(automation);
        }
      }
    } catch (error) {
      console.error('Error triggering automation:', error);
    } finally {
      setTriggering(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Paused</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Error</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">{status}</Badge>;
    }
  };

  const getTriggerTypeLabel = (triggerType: string) => {
    const labels: { [key: string]: string } = {
      'member_onboarding': 'Member Onboarding',
      'donation_acknowledgment': 'Donation Acknowledgment',
      'tier_upgrade': 'Tier Upgrade',
      'event_reminder': 'Event Reminder',
      'weekly_newsletter': 'Weekly Newsletter',
      'daily_report': 'Daily Report',
      'monthly_tier_review': 'Monthly Tier Review'
    };
    return labels[triggerType] || triggerType;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Automation Workflows</h3>
          <p className="text-sm text-gray-600">Manage and monitor your automated workflows</p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Settings className="h-4 w-4 mr-2" />
          Create Automation
        </Button>
      </div>

      {automations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Activity className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No automations found</h3>
            <p className="text-gray-500 text-center max-w-sm">
              Create your first automation workflow to start automating your member communications and processes.
            </p>
            <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
              Create Your First Automation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {automations.map((automation) => (
            <Card key={automation.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-medium">{automation.name}</h4>
                      {getStatusBadge(automation.status)}
                      <Badge variant="outline" className="text-xs">
                        {getTriggerTypeLabel(automation.trigger_type)}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {automation.description || 'No description provided'}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Activity className="h-4 w-4" />
                        <span>Runs: {automation.run_count || 0}</span>
                      </div>
                      
                      {automation.last_run && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Last run: {new Date(automation.last_run).toLocaleDateString()}</span>
                        </div>
                      )}

                      {automation.next_run && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>Next run: {new Date(automation.next_run).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusToggle(automation)}
                      className="flex items-center gap-1"
                    >
                      {automation.status === 'active' ? (
                        <>
                          <Pause className="h-4 w-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4" />
                          Activate
                        </>
                      )}
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTriggerAutomation(automation)}
                      disabled={automation.status !== 'active' || triggering === automation.id}
                      className="flex items-center gap-1"
                    >
                      {triggering === automation.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      Trigger
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onViewLogs?.(automation)}
                      className="flex items-center gap-1"
                    >
                      <BarChart3 className="h-4 w-4" />
                      Logs
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onEditAutomation?.(automation)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onDeleteAutomation?.(automation)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}