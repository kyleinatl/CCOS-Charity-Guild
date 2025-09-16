import { loadStripe, Stripe } from '@stripe/stripe-js';

// Client-side Stripe promise
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Stripe Elements appearance configuration
export const stripeElementsOptions = {
  appearance: {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#111827',
      colorDanger: '#dc2626',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '6px',
    },
    rules: {
      '.Tab': {
        border: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
      },
      '.Tab:hover': {
        backgroundColor: '#f3f4f6',
      },
      '.Tab--selected': {
        backgroundColor: '#2563eb',
        color: '#ffffff',
      },
      '.Input': {
        border: '1px solid #d1d5db',
        borderRadius: '6px',
        padding: '12px',
      },
      '.Input:focus': {
        borderColor: '#2563eb',
        boxShadow: '0 0 0 1px #2563eb',
      },
    },
  },
};

// Common payment element options
export const paymentElementOptions = {
  layout: 'tabs' as const,
  paymentMethodOrder: ['card', 'us_bank_account'],
  fields: {
    billingDetails: {
      name: 'auto' as const,
      email: 'auto' as const,
    },
  },
  terms: {
    card: 'auto' as const,
    usBankAccount: 'auto' as const,
  },
};