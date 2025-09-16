'use client';

import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe, stripeElementsOptions } from '@/lib/payments/stripe-client';
import { DonationPaymentForm } from './donation-payment-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { calculateProcessingFee, calculateNetAmount } from '@/lib/payments/utils';
import {
  DollarSign,
  Heart,
  CreditCard,
  Calendar,
  Info,
  CheckCircle,
} from 'lucide-react';

interface DonationFormProps {
  memberId?: string;
  preselectedAmount?: number;
  preselectedDesignation?: string;
  onSuccess?: (donation: any) => void;
  onCancel?: () => void;
}

const designationOptions = [
  'General Fund',
  'Education Program',
  'Community Outreach',
  'Emergency Relief Fund',
  'Youth Programs',
  'Healthcare Initiative',
  'Arts Program',
  'Building Fund',
  'Scholarship Fund',
];

export default function DonationForm({
  memberId,
  preselectedAmount,
  preselectedDesignation,
  onSuccess,
  onCancel,
}: DonationFormProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  const [clientSecret, setClientSecret] = useState<string>('');
  const [paymentIntentId, setPaymentIntentId] = useState<string>('');
  const [donationData, setDonationData] = useState({
    amount: preselectedAmount || 50,
    designation: preselectedDesignation || 'General Fund',
    donorName: '',
    donorEmail: '',
    isRecurring: false,
    recurringFrequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly',
    anonymous: false,
    notes: '',
    coverProcessingFee: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const processingFee = calculateProcessingFee(donationData.amount);
  const netAmount = calculateNetAmount(donationData.amount);
  const totalAmount = donationData.coverProcessingFee ? donationData.amount + processingFee : donationData.amount;

  const handleInputChange = (field: string, value: any) => {
    setDonationData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreatePaymentIntent = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          donorEmail: donationData.donorEmail,
          donorName: donationData.donorName,
          designation: donationData.designation,
          isRecurring: donationData.isRecurring,
          recurringFrequency: donationData.isRecurring ? donationData.recurringFrequency : undefined,
          metadata: {
            member_id: memberId || '',
            anonymous: donationData.anonymous.toString(),
            notes: donationData.notes,
            cover_processing_fee: donationData.coverProcessingFee.toString(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create payment intent');
      }

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setStep('payment');
    } catch (error) {
      console.error('Error creating payment intent:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntent: any) => {
    try {
      // Process the donation in our database
      const response = await fetch('/api/payments/process-donation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          memberId: memberId,
          paymentIntentId: paymentIntent.id,
          designation: donationData.designation,
          isRecurring: donationData.isRecurring,
          recurringFrequency: donationData.isRecurring ? donationData.recurringFrequency : undefined,
          anonymous: donationData.anonymous,
          notes: donationData.notes,
        }),
      });

      if (response.ok) {
        setStep('success');
        onSuccess?.(paymentIntent);
      } else {
        throw new Error('Failed to process donation');
      }
    } catch (error) {
      console.error('Error processing donation:', error);
      setError('Payment succeeded but failed to process donation. Please contact support.');
    }
  };

  const stripePromise = getStripe();

  if (step === 'success') {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">
            Your donation of <strong>${totalAmount.toFixed(2)}</strong> to{' '}
            <strong>{donationData.designation}</strong> has been processed successfully.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You will receive an email receipt shortly.
          </p>
          <Button onClick={onCancel} className="w-full">
            Done
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (step === 'payment') {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Complete Your Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Donation Summary */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Donation Summary</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Donation Amount:</span>
                  <span>${donationData.amount.toFixed(2)}</span>
                </div>
                {donationData.coverProcessingFee && (
                  <div className="flex justify-between">
                    <span>Processing Fee:</span>
                    <span>${processingFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total Charge:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 text-xs">
                  <span>Net to Charity:</span>
                  <span>${donationData.coverProcessingFee ? donationData.amount.toFixed(2) : netAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Stripe Elements */}
            <Elements stripe={stripePromise} options={{
              ...stripeElementsOptions,
              clientSecret,
            }}>
              <DonationPaymentForm
                donationData={donationData}
                onSuccess={handlePaymentSuccess}
                onError={setError}
                onCancel={() => setStep('details')}
              />
            </Elements>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            Make a Donation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Amount Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Donation Amount *
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[25, 50, 100, 250, 500, 1000].map(amount => (
                <Button
                  key={amount}
                  variant={donationData.amount === amount ? 'default' : 'outline'}
                  onClick={() => handleInputChange('amount', amount)}
                  className="text-sm"
                >
                  ${amount}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <Input
                type="number"
                min="1"
                step="0.01"
                value={donationData.amount}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                placeholder="Custom amount"
                className="flex-1"
              />
            </div>
          </div>

          {/* Designation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation *
            </label>
            <select
              value={donationData.designation}
              onChange={(e) => handleInputChange('designation', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              {designationOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Donor Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                value={donationData.donorName}
                onChange={(e) => handleInputChange('donorName', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                value={donationData.donorEmail}
                onChange={(e) => handleInputChange('donorEmail', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Recurring Donation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recurring"
                checked={donationData.isRecurring}
                onChange={(e) => handleInputChange('isRecurring', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
                Make this a recurring donation
              </label>
              <Badge variant="outline" className="text-xs">
                <Calendar className="w-3 h-3 mr-1" />
                Flexible
              </Badge>
            </div>

            {donationData.isRecurring && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frequency
                </label>
                <select
                  value={donationData.recurringFrequency}
                  onChange={(e) => handleInputChange('recurringFrequency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            )}
          </div>

          {/* Processing Fee Option */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="coverFee"
                checked={donationData.coverProcessingFee}
                onChange={(e) => handleInputChange('coverProcessingFee', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="coverFee" className="text-sm font-medium text-gray-700">
                Cover processing fee (${processingFee.toFixed(2)})
              </label>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg text-xs text-gray-600">
              <div className="flex items-start gap-2">
                <Info className="w-3 h-3 mt-0.5 text-gray-400" />
                <div>
                  {donationData.coverProcessingFee ? (
                    <p>
                      Your total charge will be <strong>${totalAmount.toFixed(2)}</strong> and
                      the full <strong>${donationData.amount.toFixed(2)}</strong> will go to {donationData.designation}.
                    </p>
                  ) : (
                    <p>
                      Your charge will be <strong>${donationData.amount.toFixed(2)}</strong> and
                      approximately <strong>${netAmount.toFixed(2)}</strong> will go to {donationData.designation} after processing fees.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={donationData.anonymous}
                onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="anonymous" className="text-sm font-medium text-gray-700">
                Make this donation anonymous
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <Textarea
                value={donationData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add a personal message or special instructions"
                rows={3}
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onCancel && (
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button
              onClick={handleCreatePaymentIntent}
              disabled={loading || !donationData.amount || !donationData.donorName || !donationData.donorEmail}
              className="flex-1"
            >
              {loading ? 'Processing...' : `Continue to Payment - $${totalAmount.toFixed(2)}`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}