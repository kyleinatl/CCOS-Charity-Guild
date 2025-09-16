'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  CheckCircle, 
  XCircle, 
  Users, 
  DollarSign, 
  Calendar,
  Zap,
  Settings
} from 'lucide-react';

export default function AutomationTestPage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const testAutomations = [
    {
      id: 'member_onboarding',
      name: 'Member Onboarding Test',
      description: 'Test the member onboarding workflow with sample data',
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      testData: {
        member: {
          id: 'test-member-001',
          email: 'test@example.com',
          first_name: 'John',
          last_name: 'Doe',
          tier: 'bronze',
          created_at: new Date().toISOString()
        }
      }
    },
    {
      id: 'donation_acknowledgment',
      name: 'Donation Thank You Test',
      description: 'Test donation acknowledgment workflow',
      icon: DollarSign,
      color: 'bg-green-50 text-green-600',
      testData: {
        donation: {
          id: 'test-donation-001',
          amount: 100,
          designation: 'General Fund',
          created_at: new Date().toISOString()
        },
        member: {
          id: 'test-member-001',
          email: 'test@example.com',
          first_name: 'Jane',
          last_name: 'Smith',
          tier: 'silver'
        }
      }
    },
    {
      id: 'tier_upgrade',
      name: 'Tier Upgrade Test',
      description: 'Test tier upgrade celebration workflow',
      icon: Zap,
      color: 'bg-purple-50 text-purple-600',
      testData: {
        member: {
          id: 'test-member-002',
          email: 'upgrade@example.com',
          first_name: 'Alice',
          last_name: 'Johnson',
          tier: 'gold',
          total_donated: 2500
        },
        oldTier: 'silver',
        newTier: 'gold'
      }
    },
    {
      id: 'event_reminder',
      name: 'Event Reminder Test',
      description: 'Test event reminder workflow',
      icon: Calendar,
      color: 'bg-orange-50 text-orange-600',
      testData: {
        event: {
          id: 'test-event-001',
          name: 'Annual Charity Gala',
          start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          venue_name: 'Grand Ballroom'
        },
        member: {
          id: 'test-member-003',
          email: 'attendee@example.com',
          first_name: 'Bob',
          last_name: 'Wilson',
          tier: 'platinum'
        },
        reminderType: 'reminder_24h'
      }
    }
  ];

  const runTest = async (automation: any) => {
    setLoading(automation.id);
    
    try {
      let response;
      
      switch (automation.id) {
        case 'member_onboarding':
          // Test member onboarding
          response = await fetch('/api/automation/member_onboarding/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trigger_data: automation.testData
            })
          });
          break;
          
        case 'donation_acknowledgment':
          // Test donation acknowledgment
          response = await fetch('/api/automation/donation_acknowledgment/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trigger_data: automation.testData
            })
          });
          break;
          
        case 'tier_upgrade':
          // Test tier upgrade
          response = await fetch('/api/automation/tier_upgrade/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trigger_data: automation.testData
            })
          });
          break;
          
        case 'event_reminder':
          // Test event reminder
          response = await fetch('/api/automation/event_reminder/trigger', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              trigger_data: automation.testData
            })
          });
          break;
          
        default:
          throw new Error('Unknown automation type');
      }

      const result = await response.json();
      
      const testResult = {
        id: automation.id,
        name: automation.name,
        success: response.ok,
        result: result,
        timestamp: new Date().toISOString(),
        testData: automation.testData
      };

      setResults(prev => [testResult, ...prev]);
      
    } catch (error) {
      const testResult = {
        id: automation.id,
        name: automation.name,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
        testData: automation.testData
      };

      setResults(prev => [testResult, ...prev]);
    } finally {
      setLoading(null);
    }
  };

  const runAllTests = async () => {
    for (const automation of testAutomations) {
      await runTest(automation);
      // Add a small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="h-8 w-8 text-blue-600" />
            Automation Testing
          </h1>
          <p className="text-gray-600 mt-2">
            Test automation workflows with sample data to ensure they're working correctly
          </p>
        </div>
        <Button onClick={runAllTests} disabled={loading !== null} className="bg-blue-600 hover:bg-blue-700">
          <Play className="h-4 w-4 mr-2" />
          Run All Tests
        </Button>
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {testAutomations.map((automation) => (
          <Card key={automation.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${automation.color}`}>
                  <automation.icon className="h-6 w-6" />
                </div>
                {automation.name}
              </CardTitle>
              <CardDescription>{automation.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Test Data Preview */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Test Data:</h4>
                  <pre className="text-xs text-gray-600 overflow-x-auto">
                    {JSON.stringify(automation.testData, null, 2)}
                  </pre>
                </div>

                {/* Test Button */}
                <Button
                  onClick={() => runTest(automation)}
                  disabled={loading === automation.id}
                  className="w-full"
                  variant="outline"
                >
                  {loading === automation.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {loading === automation.id ? 'Running Test...' : 'Run Test'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Test Results */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Test Results
            </CardTitle>
            <CardDescription>Results from automation workflow tests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{result.name}</h4>
                      <Badge className={result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {result.success ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Success
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 mr-1" />
                            Failed
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleString()}
                    </div>
                  </div>

                  {result.success ? (
                    <div className="bg-green-50 p-3 rounded-lg">
                      <pre className="text-xs text-green-700 overflow-x-auto">
                        {JSON.stringify(result.result, null, 2)}
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-red-50 p-3 rounded-lg">
                      <p className="text-sm text-red-700">
                        Error: {result.error || 'Unknown error occurred'}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}