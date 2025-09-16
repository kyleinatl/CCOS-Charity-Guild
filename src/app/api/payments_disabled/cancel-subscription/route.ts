import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payments/payment-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subscriptionId } = body;

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    const subscription = await PaymentService.cancelSubscription(subscriptionId);

    return NextResponse.json({
      success: true,
      subscription: {
        id: subscription.id,
        status: subscription.status,
        canceled_at: subscription.canceled_at,
      },
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    );
  }
}