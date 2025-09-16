import { Stripe } from 'stripe';

// Mock Stripe for build purposes when keys are not available
export default null;

// Stripe configuration constants
export const STRIPE_CONFIG = {
  // Currency
  CURRENCY: 'usd',
  
  // Payment methods
  PAYMENT_METHODS: ['card', 'us_bank_account'] as const,
  
  // Webhook events we handle
  WEBHOOK_EVENTS: [
    'payment_intent.succeeded',
    'payment_intent.payment_failed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted',
    'invoice.payment_succeeded',
    'invoice.payment_failed',
  ] as const,
  
  // Fee calculation (Stripe standard rates)
  FEES: {
    CARD_RATE: 0.029, // 2.9%
    CARD_FIXED: 0.30, // $0.30
    ACH_RATE: 0.008, // 0.8%
    ACH_FIXED: 5.00, // $5.00 (capped at $5)
    ACH_CAP: 5.00,
  },
} as const;

// Fee calculation utilities
export const calculateStripeProcessingFee = (amount: number, paymentMethod: 'card' | 'ach' = 'card'): number => {
  if (paymentMethod === 'ach') {
    const feeAmount = Math.min(amount * STRIPE_CONFIG.FEES.ACH_RATE + STRIPE_CONFIG.FEES.ACH_FIXED, STRIPE_CONFIG.FEES.ACH_CAP);
    return Math.round(feeAmount * 100) / 100; // Round to nearest cent
  }
  
  // Card processing fee
  const feeAmount = amount * STRIPE_CONFIG.FEES.CARD_RATE + STRIPE_CONFIG.FEES.CARD_FIXED;
  return Math.round(feeAmount * 100) / 100; // Round to nearest cent
};

export const calculateNetAmount = (amount: number, paymentMethod: 'card' | 'ach' = 'card'): number => {
  const fee = calculateStripeProcessingFee(amount, paymentMethod);
  return Math.round((amount - fee) * 100) / 100; // Round to nearest cent
};