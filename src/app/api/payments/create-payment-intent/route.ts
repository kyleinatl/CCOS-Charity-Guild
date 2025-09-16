import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payments/payment-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      amount,
      donorEmail,
      donorName,
      designation,
      isRecurring,
      recurringFrequency,
      metadata,
    } = body;

    // Validation
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Valid amount is required' },
        { status: 400 }
      );
    }

    if (!donorEmail || !donorName) {
      return NextResponse.json(
        { error: 'Donor email and name are required' },
        { status: 400 }
      );
    }

    if (!designation) {
      return NextResponse.json(
        { error: 'Designation is required' },
        { status: 400 }
      );
    }

    // Create payment intent or subscription based on donation type
    if (isRecurring && recurringFrequency) {
      const subscription = await PaymentService.createSubscription({
        amount,
        donorEmail,
        donorName,
        designation,
        isRecurring: true,
        recurringFrequency,
        metadata,
      });

      // Get the payment intent from the subscription
      const latestInvoice = subscription.latest_invoice as any;
      const paymentIntent = latestInvoice?.payment_intent;

      return NextResponse.json({
        clientSecret: paymentIntent?.client_secret,
        subscriptionId: subscription.id,
        type: 'subscription',
      });
    } else {
      const paymentIntent = await PaymentService.createPaymentIntent({
        amount,
        donorEmail,
        donorName,
        designation,
        metadata,
      });

      return NextResponse.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        type: 'one-time',
      });
    }
  } catch (error) {
    console.error('Error creating payment intent:', error);
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}