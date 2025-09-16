'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import DonationForm from '@/components/payments/donation-form';
import { calculateProcessingFee, formatCurrency, getTierProgress } from '@/lib/payments/utils';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
  Heart,
} from 'lucide-react';

export default function PaymentTestPage() {
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);

  const testAmounts = [10, 25, 50, 100, 250, 500, 1000];

  const runCalculationTest = () => {
    const results = testAmounts.map(amount => {
      const cardFee = calculateProcessingFee(amount, 'card');
      const achFee = calculateProcessingFee(amount, 'ach');
      const tierInfo = getTierProgress(amount);
      
      return {
        amount,
        cardFee,
        achFee,
        cardNet: amount - cardFee,
        achNet: amount - achFee,
        tierInfo,
      };
    });
    
    setTestResults(results);
  };

  const testApiEndpoint = async (endpoint: string, data: any) => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      return {
        endpoint,
        success: response.ok,
        status: response.status,
        data: result,
      };
    } catch (error) {
      return {
        endpoint,
        success: false,
        status: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };

  if (showDonationForm) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowDonationForm(false)}
          >
            ← Back to Test Page
          </Button>
        </div>
        
        <DonationForm
          memberId="test-member-id"
          onSuccess={(donation) => {
            console.log('Test donation successful:', donation);
            setShowDonationForm(false);
          }}
          onCancel={() => setShowDonationForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-900">Payment Integration Test</h1>
        <p className="text-lg text-gray-600">
          Test Stripe payment integration and fee calculations
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            Stripe Integrated
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <CreditCard className="w-3 h-3 text-blue-500" />
            Test Mode
          </Badge>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Test Donation Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Test the complete donation flow with Stripe Elements
            </p>
            <Button 
              onClick={() => setShowDonationForm(true)}
              className="w-full"
            >
              Open Donation Form
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-500" />
              Fee Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Test processing fee calculations for different amounts
            </p>
            <Button 
              onClick={runCalculationTest}
              variant="outline"
              className="w-full"
            >
              Run Calculations
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Environment Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Stripe Keys:</span>
                <Badge variant={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'default' : 'destructive'}>
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Test Mode:</span>
                <Badge variant="outline">
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.includes('pk_test') ? 'Test' : 'Live'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fee Calculation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Amount</th>
                    <th className="text-left py-2">Card Fee</th>
                    <th className="text-left py-2">Card Net</th>
                    <th className="text-left py-2">ACH Fee</th>
                    <th className="text-left py-2">ACH Net</th>
                    <th className="text-left py-2">Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {testResults.map((result, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 font-medium">{formatCurrency(result.amount)}</td>
                      <td className="py-2 text-red-600">{formatCurrency(result.cardFee)}</td>
                      <td className="py-2 text-green-600">{formatCurrency(result.cardNet)}</td>
                      <td className="py-2 text-red-600">{formatCurrency(result.achFee)}</td>
                      <td className="py-2 text-green-600">{formatCurrency(result.achNet)}</td>
                      <td className="py-2">
                        <Badge variant="outline">{result.tierInfo.currentTier}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Stripe Test Cards */}
      <Card>
        <CardHeader>
          <CardTitle>Stripe Test Cards</CardTitle>
          <p className="text-sm text-gray-600">
            Use these test card numbers for testing payment flows
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Successful Payments</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Visa:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">4242 4242 4242 4242</code>
                </div>
                <div className="flex justify-between">
                  <span>Visa (debit):</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">4000 0566 5566 5556</code>
                </div>
                <div className="flex justify-between">
                  <span>Mastercard:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">5555 5555 5555 4444</code>
                </div>
                <div className="flex justify-between">
                  <span>American Express:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">3782 822463 10005</code>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Failed Payments</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Card declined:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">4000 0000 0000 0002</code>
                </div>
                <div className="flex justify-between">
                  <span>Insufficient funds:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">4000 0000 0000 9995</code>
                </div>
                <div className="flex justify-between">
                  <span>Processing error:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">4000 0000 0000 0119</code>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Testing Notes:</p>
                <ul className="mt-1 space-y-1 list-disc list-inside">
                  <li>Use any future expiration date (e.g., 12/34)</li>
                  <li>Use any 3-digit CVC for Visa/Mastercard, 4-digit for Amex</li>
                  <li>Use any valid ZIP code</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>Payment API Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { 
                method: 'POST', 
                endpoint: '/api/payments/create-payment-intent',
                description: 'Create payment intent for one-time or recurring donations'
              },
              { 
                method: 'POST', 
                endpoint: '/api/payments/process-donation',
                description: 'Process completed donation and save to database'
              },
              { 
                method: 'POST', 
                endpoint: '/api/payments/webhook',
                description: 'Handle Stripe webhook events'
              },
              { 
                method: 'POST', 
                endpoint: '/api/payments/cancel-subscription',
                description: 'Cancel recurring donation subscription'
              },
              { 
                method: 'GET', 
                endpoint: '/api/payments/payment-methods',
                description: 'Get customer payment methods'
              },
            ].map((api, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono text-xs">
                      {api.method}
                    </Badge>
                    <code className="text-sm">{api.endpoint}</code>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">{api.description}</p>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Setup Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium">1. Environment Variables</h4>
              <p className="text-sm text-gray-600">
                Add these to your <code className="bg-gray-100 px-1 rounded">.env.local</code> file:
              </p>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                <div>STRIPE_SECRET_KEY=sk_test_...</div>
                <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</div>
                <div>STRIPE_WEBHOOK_SECRET=whsec_...</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. Webhook Setup</h4>
              <p className="text-sm text-gray-600">
                Configure webhook endpoint in Stripe Dashboard:
              </p>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                https://your-domain.com/api/payments/webhook
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">3. Test the Integration</h4>
              <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                <li>Click "Open Donation Form" above</li>
                <li>Fill in donation details</li>
                <li>Use test card number: 4242 4242 4242 4242</li>
                <li>Complete the payment</li>
                <li>Check your Stripe Dashboard for the transaction</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}