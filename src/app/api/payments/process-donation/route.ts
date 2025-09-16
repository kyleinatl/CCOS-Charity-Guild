import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/lib/payments/payment-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const {
      memberId,
      paymentIntentId,
      designation,
      isRecurring,
      recurringFrequency,
      anonymous,
      notes,
    } = body;

    // Validation
    if (!memberId || !paymentIntentId || !designation) {
      return NextResponse.json(
        { error: 'Member ID, payment intent ID, and designation are required' },
        { status: 400 }
      );
    }

    // Process the donation
    await PaymentService.processDonation({
      memberId,
      amount: 0, // Amount will be retrieved from payment intent
      paymentIntentId,
      designation,
      isRecurring,
      recurringFrequency,
      anonymous,
      notes,
    });

    return NextResponse.json({
      success: true,
      message: 'Donation processed successfully',
    });
  } catch (error) {
    console.error('Error processing donation:', error);
    
    return NextResponse.json(
      { error: 'Failed to process donation' },
      { status: 500 }
    );
  }
}