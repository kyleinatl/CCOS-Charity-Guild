'use client';

import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, CreditCard } from 'lucide-react';

interface DonationPaymentFormProps {
  donationData: {
    amount: number;
    designation: string;
    donorName: string;
    donorEmail: string;
    isRecurring: boolean;
    recurringFrequency: string;
    anonymous: boolean;
    notes: string;
  };
  onSuccess: (paymentIntent: any) => void;
  onError: (error: string) => void;
  onCancel: () => void;
}

export function DonationPaymentForm({
  donationData,
  onSuccess,
  onError,
  onCancel,
}: DonationPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    onError(''); // Clear any previous errors

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donation/success`,
          receipt_email: donationData.donorEmail,
        },
        redirect: 'if_required',
      });

      if (error) {
        // Payment failed
        console.error('Payment failed:', error);
        onError(error.message || 'Payment failed. Please try again.');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        console.log('Payment succeeded:', paymentIntent);
        onSuccess(paymentIntent);
      } else {
        // Payment requires additional action or is still processing
        console.log('Payment status:', paymentIntent?.status);
        onError('Payment is being processed. Please wait...');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      onError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="p-4 border border-gray-200 rounded-lg">
        <PaymentElement
          options={{
            layout: 'tabs',
            paymentMethodOrder: ['card', 'us_bank_account'],
            fields: {
              billingDetails: {
                name: 'never',
                email: 'never',
              },
            },
            terms: {
              card: 'auto',
              usBankAccount: 'auto',
            },
          }}
        />
      </div>

      {/* Payment Summary */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Payment Summary</h4>
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Donor:</span>
            <span>{donationData.donorName}</span>
          </div>
          <div className="flex justify-between">
            <span>Email:</span>
            <span>{donationData.donorEmail}</span>
          </div>
          <div className="flex justify-between">
            <span>Designation:</span>
            <span>{donationData.designation}</span>
          </div>
          {donationData.isRecurring && (
            <div className="flex justify-between">
              <span>Frequency:</span>
              <span className="capitalize">{donationData.recurringFrequency}</span>
            </div>
          )}
          {donationData.anonymous && (
            <div className="flex justify-between">
              <span>Anonymous:</span>
              <span>Yes</span>
            </div>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="text-xs text-gray-500 flex items-center gap-2">
        <CreditCard className="w-3 h-3" />
        <span>
          Your payment information is secure and encrypted. We never store your payment details.
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        
        <Button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="flex-1 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              {donationData.isRecurring ? 'Set Up Recurring Donation' : 'Complete Donation'}
            </>
          )}
        </Button>
      </div>

      {/* Terms and Conditions */}
      <div className="text-xs text-gray-500">
        <p>
          By completing this donation, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
          . You will receive an email receipt for your donation.
        </p>
        {donationData.isRecurring && (
          <p className="mt-2">
            You can cancel your recurring donation at any time by contacting us or 
            logging into your donor portal.
          </p>
        )}
      </div>
    </form>
  );
}