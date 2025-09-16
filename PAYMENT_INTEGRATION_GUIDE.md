# Payment Integration Documentation

## Overview

The CCOS Charity Guild payment system provides a complete Stripe integration for processing donations and event payments. The system supports both one-time and recurring donations with comprehensive fee calculation and database integration.

## Architecture

### Core Components

1. **Payment Service Layer** (`/src/lib/payments/payment-service.ts`)
   - Handles all Stripe API interactions  
   - Manages customer creation and retrieval
   - Processes payment intents and subscriptions
   - Handles webhook events

2. **Stripe Configuration** 
   - **Server-side** (`/src/lib/payments/stripe-server.ts`): Stripe instance and fee calculations
   - **Client-side** (`/src/lib/payments/stripe-client.ts`): Stripe Elements configuration

3. **Payment Components**
   - **DonationForm** (`/src/components/payments/donation-form.tsx`): Multi-step donation form
   - **DonationPaymentForm** (`/src/components/payments/donation-payment-form.tsx`): Stripe Elements form

4. **API Endpoints** (`/src/app/api/payments/`)
   - `create-payment-intent/`: Create payment intents and subscriptions
   - `process-donation/`: Save completed donations to database
   - `webhook/`: Handle Stripe webhook events
   - `cancel-subscription/`: Cancel recurring donations
   - `payment-methods/`: Manage customer payment methods

## Features

### ✅ One-Time Donations
- Secure card and ACH payments
- Processing fee calculation and optional coverage
- Anonymous donation support
- Custom donation amounts and designations
- Automatic tier calculation and updates

### ✅ Recurring Donations  
- Monthly, quarterly, and yearly frequencies
- Subscription management
- Automatic tier progression
- Easy cancellation

### ✅ Payment Processing
- Stripe-native security and PCI compliance
- Real-time payment validation
- Comprehensive error handling
- Automatic receipt generation

### ✅ Database Integration
- Automatic donation record creation
- Member tier calculation and updates
- Transaction tracking and audit trail
- Supabase integration

### ✅ Fee Management
- Transparent fee calculation (2.9% + $0.30 for cards, 0.8% + $5 capped for ACH)
- Optional fee coverage by donors
- Net amount tracking

## Configuration

### Environment Variables

```bash
# Required Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...                    # Stripe secret key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...   # Stripe publishable key
STRIPE_WEBHOOK_SECRET=whsec_...                  # Webhook endpoint secret
```

### Stripe Dashboard Setup

1. **Create Stripe Account**: Set up test and live accounts
2. **API Keys**: Copy test keys to environment variables
3. **Webhook Configuration**:
   - Endpoint: `https://your-domain.com/api/payments/webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `customer.subscription.*`, `invoice.payment_*`
4. **Payment Methods**: Enable cards and US bank accounts

## Usage

### Basic Donation Form

```tsx
import DonationForm from '@/components/payments/donation-form';

function MyComponent() {
  return (
    <DonationForm
      memberId="user-id"
      preselectedAmount={100}
      preselectedDesignation="General Fund"
      onSuccess={(donation) => console.log('Success:', donation)}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

### Processing Fee Calculation

```tsx
import { calculateProcessingFee, calculateNetAmount } from '@/lib/payments/utils';

const amount = 100;
const cardFee = calculateProcessingFee(amount, 'card');     // $3.20
const achFee = calculateProcessingFee(amount, 'ach');       // $5.00 (capped)
const netAmount = calculateNetAmount(amount, 'card');       // $96.80
```

### API Integration

```typescript
// Create payment intent
const response = await fetch('/api/payments/create-payment-intent', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    amount: 100,
    donorEmail: 'donor@example.com',
    donorName: 'John Doe',
    designation: 'General Fund',
    isRecurring: false,
  }),
});

const { clientSecret, paymentIntentId } = await response.json();
```

## Testing

### Test Page
Visit `/test/payments` for comprehensive testing interface including:
- Live donation form testing
- Fee calculation verification
- API endpoint testing
- Stripe test card information

### Stripe Test Cards

**Successful Payments:**
- Visa: `4242 4242 4242 4242`
- Visa Debit: `4000 0566 5566 5556`
- Mastercard: `5555 5555 5555 4444`
- American Express: `3782 822463 10005`

**Failed Payments:**
- Card Declined: `4000 0000 0000 0002`
- Insufficient Funds: `4000 0000 0000 9995`
- Processing Error: `4000 0000 0000 0119`

Use any future expiration date, any valid CVC, and any ZIP code.

## Database Schema

### Donations Table Updates
The payment system automatically populates these fields:

```sql
-- Payment processing fields
payment_processor: 'stripe'
transaction_id: 'pi_...' or 'sub_...'
processing_fee: calculated_fee
net_amount: amount - processing_fee

-- Recurring donation fields  
is_recurring: boolean
recurring_frequency: 'monthly' | 'quarterly' | 'yearly'

-- Automation fields
receipt_sent: true (Stripe handles receipts)
tax_deductible: true
```

### Member Tier Updates
Payment processing automatically updates member tiers:

- **Bronze**: $0 - $499
- **Silver**: $500 - $2,499  
- **Gold**: $2,500 - $9,999
- **Platinum**: $10,000+

## Security

### PCI Compliance
- All payment data handled by Stripe (PCI Level 1 compliant)
- No payment information stored locally
- Tokenized payment methods only

### Data Protection
- Encrypted API communications (HTTPS/TLS)
- Webhook signature verification
- Environment variable security
- Database RLS policies

### Error Handling
- Comprehensive payment failure handling
- User-friendly error messages
- Admin notification system
- Audit logging

## Webhook Events

The system handles these Stripe webhook events:

```typescript
// Successful one-time payment
'payment_intent.succeeded' → Update donation record

// Failed payment
'payment_intent.payment_failed' → Log failure, notify admin

// Subscription events
'customer.subscription.created' → Create recurring donation record
'customer.subscription.updated' → Update subscription details
'customer.subscription.deleted' → Mark subscription as cancelled

// Recurring payment events
'invoice.payment_succeeded' → Create new donation record
'invoice.payment_failed' → Handle failed recurring payment
```

## Monitoring

### Key Metrics to Track
- Payment success rate
- Processing fee efficiency
- Recurring donation retention
- Average donation amount
- Tier progression rates

### Logging
- All payment attempts logged
- Webhook event processing
- Error tracking and alerting
- Performance monitoring

## Production Deployment

### Pre-Launch Checklist

1. **Stripe Configuration**
   - [ ] Switch to live API keys
   - [ ] Update webhook endpoint to production URL
   - [ ] Configure live webhook events
   - [ ] Test live payment flow

2. **Database**
   - [ ] Verify donation table schema
   - [ ] Test member tier calculations
   - [ ] Confirm RLS policies

3. **Security**
   - [ ] Verify HTTPS configuration
   - [ ] Test webhook signature validation
   - [ ] Confirm environment variable security

4. **Testing**
   - [ ] End-to-end payment testing
   - [ ] Webhook event processing
   - [ ] Error handling verification
   - [ ] Performance testing

### Go-Live Process

1. Update environment variables to live Stripe keys
2. Configure production webhook endpoint
3. Test small live transactions
4. Monitor initial payments closely
5. Gradually increase transaction volume

## Support

### Common Issues

**Payment Failures:**
- Check Stripe Dashboard for decline reasons
- Verify webhook endpoint accessibility
- Confirm API key configuration

**Database Issues:**
- Verify member_id exists in members table
- Check donation table constraints
- Confirm Supabase connection

**Integration Issues:**
- Test API endpoints individually
- Verify webhook signature validation
- Check environment variable configuration

### Development Workflow

1. Use test mode for all development
2. Test webhook events using Stripe CLI
3. Verify database integration thoroughly
4. Test error scenarios comprehensively
5. Monitor payment success rates

## Future Enhancements

### Planned Features
- [ ] Apple Pay / Google Pay integration
- [ ] Donation campaign tracking
- [ ] Advanced reporting dashboard
- [ ] Donor portal enhancements
- [ ] Mobile app payment integration

### Performance Optimizations
- [ ] Payment method caching
- [ ] Webhook event queuing
- [ ] Database query optimization
- [ ] CDN integration for assets

The payment system is production-ready and provides a comprehensive foundation for processing donations securely and efficiently.