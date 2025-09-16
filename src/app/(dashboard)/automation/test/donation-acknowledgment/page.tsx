'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DollarSign,
  User,
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Clock,
  Receipt,
  Heart,
  TrendingUp,
  Gift,
  FileText,
} from 'lucide-react';

export default function DonationAcknowledgmentTestPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [testData, setTestData] = useState({
    donation_id: 'test_donation_' + Date.now(),
    member_id: 'test_member_' + Date.now(),
    member_name: 'John Doe',
    member_email: 'john.doe@example.com',
    donation_amount: 250.00,
    donation_designation: 'General Fund',
    is_recurring: false,
    member_tier: 'supporter',
  });

  const handleTestAcknowledgment = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/automation/donation-acknowledgment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donation_id: testData.donation_id,
          member_id: testData.member_id,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        error: 'Network error occurred',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAcknowledgments = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/automation/donation-acknowledgment');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        error: 'Failed to load acknowledgments',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  const sampleWorkflowSteps = [
    {
      id: 1,
      name: 'Thank You Email',
      description: 'Send personalized thank you email with donation details',
      icon: Mail,
      color: 'text-blue-600',
      delay: '0 minutes',
      status: 'active',
    },
    {
      id: 2,
      name: 'Tax Receipt',
      description: 'Generate and send official tax-deductible receipt',
      icon: Receipt,
      color: 'text-green-600',
      delay: '2 minutes',
      status: 'active',
    },
    {
      id: 3,
      name: 'Tier Upgrade Check',
      description: 'Check if donation qualifies for membership tier upgrade',
      icon: TrendingUp,
      color: 'text-purple-600',
      delay: '1 minute',
      status: 'active',
    },
    {
      id: 4,
      name: 'Impact Update',
      description: 'Schedule personalized impact update for 24 hours later',
      icon: Heart,
      color: 'text-red-600',
      delay: '24 hours',
      status: 'scheduled',
    },
    {
      id: 5,
      name: 'Donor Recognition',
      description: 'Schedule special recognition for major donors (>=$500)',
      icon: Gift,
      color: 'text-orange-600',
      delay: '7 days',
      status: 'conditional',
    },
    {
      id: 6,
      name: 'Staff Follow-up',
      description: 'Create follow-up task for staff to contact donor',
      icon: User,
      color: 'text-gray-600',
      delay: '30 days',
      status: 'active',
    },
  ];

  const sampleConfigurations = [
    {
      name: 'Standard Acknowledgment',
      description: 'Default workflow for most donations',
      settings: {
        sendThankYouEmail: true,
        thankYouEmailDelay: 0,
        sendTaxReceipt: true,
        taxReceiptDelay: 2,
        checkTierUpgrade: true,
        sendImpactUpdate: true,
        impactUpdateDelay: 24,
        personalizedContent: true,
      },
    },
    {
      name: 'Major Donor VIP',
      description: 'Enhanced workflow for donations >= $1,000',
      settings: {
        sendThankYouEmail: true,
        thankYouEmailDelay: 0,
        sendTaxReceipt: true,
        taxReceiptDelay: 1,
        checkTierUpgrade: true,
        sendImpactUpdate: true,
        impactUpdateDelay: 12,
        sendDonorRecognition: true,
        recognitionDelay: 3,
        personalizedContent: true,
        createFollowUpTask: true,
        taskDelay: 7,
      },
    },
    {
      name: 'Recurring Donor',
      description: 'Streamlined workflow for recurring donations',
      settings: {
        sendThankYouEmail: true,
        thankYouEmailDelay: 0,
        sendTaxReceipt: true,
        taxReceiptDelay: 5,
        checkTierUpgrade: false,
        sendImpactUpdate: true,
        impactUpdateDelay: 168, // 1 week
        personalizedContent: false,
      },
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <DollarSign className="h-8 w-8 text-green-600" />
            Donation Acknowledgment Testing
          </h1>
          <p className="text-gray-600 mt-2">
            Test and validate donation acknowledgment workflows and automations
          </p>
        </div>
      </div>

      <Tabs defaultValue="test" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="test">Test Workflow</TabsTrigger>
          <TabsTrigger value="workflow">Workflow Steps</TabsTrigger>
          <TabsTrigger value="configurations">Configurations</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="test">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 h-5 text-blue-600" />
                  Test Donation Acknowledgment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Member Name</label>
                    <Input
                      value={testData.member_name}
                      onChange={(e) => setTestData(prev => ({ ...prev, member_name: e.target.value }))}
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Member Email</label>
                    <Input
                      type="email"
                      value={testData.member_email}
                      onChange={(e) => setTestData(prev => ({ ...prev, member_email: e.target.value }))}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Donation Amount</label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={testData.donation_amount}
                      onChange={(e) => setTestData(prev => ({ ...prev, donation_amount: parseFloat(e.target.value) || 0 }))}
                      placeholder="250.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Designation</label>
                    <select
                      value={testData.donation_designation}
                      onChange={(e) => setTestData(prev => ({ ...prev, donation_designation: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="General Fund">General Fund</option>
                      <option value="Education Program">Education Program</option>
                      <option value="Community Outreach">Community Outreach</option>
                      <option value="Emergency Relief Fund">Emergency Relief Fund</option>
                      <option value="Youth Programs">Youth Programs</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Member Tier</label>
                    <select
                      value={testData.member_tier}
                      onChange={(e) => setTestData(prev => ({ ...prev, member_tier: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="member">Member</option>
                      <option value="friend">Friend</option>
                      <option value="supporter">Supporter</option>
                      <option value="advocate">Advocate</option>
                      <option value="patron">Patron</option>
                      <option value="champion">Champion</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="recurring"
                      checked={testData.is_recurring}
                      onChange={(e) => setTestData(prev => ({ ...prev, is_recurring: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="recurring" className="text-sm font-medium">
                      Recurring Donation
                    </label>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleTestAcknowledgment}
                    disabled={loading}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Test Acknowledgment
                      </div>
                    )}
                  </Button>
                  <Button
                    onClick={handleLoadAcknowledgments}
                    variant="outline"
                    disabled={loading}
                  >
                    Load History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Test Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    {result.success !== undefined && (
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${
                        result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                      }`}>
                        {result.success ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : (
                          <AlertCircle className="h-5 w-5" />
                        )}
                        <span className="font-medium">
                          {result.success ? 'Workflow Executed Successfully' : 'Workflow Failed'}
                        </span>
                      </div>
                    )}

                    {result.actions_executed && (
                      <div>
                        <h4 className="font-medium mb-2">Actions Executed</h4>
                        <div className="space-y-1">
                          {result.actions_executed.map((action: string, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              {action.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.scheduled_tasks && (
                      <div>
                        <h4 className="font-medium mb-2">Scheduled Tasks</h4>
                        <Badge variant="outline">
                          {result.scheduled_tasks} tasks scheduled
                        </Badge>
                      </div>
                    )}

                    {result.errors && result.errors.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2 text-red-600">Errors</h4>
                        <div className="space-y-1">
                          {result.errors.map((error: string, index: number) => (
                            <div key={index} className="text-sm text-red-600 bg-red-50 p-2 rounded">
                              {error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.acknowledgments && (
                      <div>
                        <h4 className="font-medium mb-2">Recent Acknowledgments</h4>
                        <div className="text-sm text-gray-600">
                          Found {result.acknowledgments.length} acknowledgments
                        </div>
                      </div>
                    )}

                    {result.message && (
                      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                        {result.message}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Test results will appear here</p>
                    <p className="text-sm mt-1">Run a test to see the workflow execution results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Donation Acknowledgment Workflow Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sampleWorkflowSteps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <div className={`p-2 rounded-lg bg-gray-50`}>
                        <step.icon className={`h-5 w-5 ${step.color}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{step.name}</h3>
                        <Badge 
                          variant="outline" 
                          className={
                            step.status === 'active' ? 'text-green-600 border-green-600' :
                            step.status === 'scheduled' ? 'text-blue-600 border-blue-600' :
                            'text-orange-600 border-orange-600'
                          }
                        >
                          {step.status}
                        </Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{step.description}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        Delay: {step.delay}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configurations">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {sampleConfigurations.map((config, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{config.name}</CardTitle>
                  <p className="text-sm text-gray-600">{config.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {Object.entries(config.settings).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="text-gray-600">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </span>
                        <span className={value === true ? 'text-green-600' : value === false ? 'text-gray-400' : 'text-blue-600'}>
                          {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Acknowledgment History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Acknowledgment history will be displayed here</p>
                <p className="text-sm mt-1">Historical data of all processed donation acknowledgments</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}