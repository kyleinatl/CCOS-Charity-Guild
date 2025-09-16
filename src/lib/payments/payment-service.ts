import stripe, { calculateStripeProcessingFee } from './stripe-server';
import { createClient } from '@/lib/supabase/client';
import Stripe from 'stripe';
import { automationService } from '@/lib/automation/automation-service';

const supabase = createClient();

export interface CreatePaymentIntentParams {
  amount: number; // Amount in dollars
  currency?: string;
  customerId?: string;
  donorEmail: string;
  donorName: string;
  designation: string;
  metadata?: Record<string, string>;
  paymentMethodTypes?: string[];
  isRecurring?: boolean;
  recurringFrequency?: 'monthly' | 'quarterly' | 'yearly';
}

export interface CreateCustomerParams {
  email: string;
  name: string;
  phone?: string;
  address?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country?: string;
  };
  metadata?: Record<string, string>;
}

export interface ProcessDonationParams {
  memberId: string;
  amount: number;
  paymentIntentId: string;
  designation: string;
  isRecurring?: boolean;
  recurringFrequency?: string;
  anonymous?: boolean;
  notes?: string;
}

export class PaymentService {
  /**
   * Create a new Stripe customer
   */
  static async createCustomer(params: CreateCustomerParams): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email: params.email,
        name: params.name,
        phone: params.phone,
        address: params.address,
        metadata: {
          source: 'ccos-charity-guild',
          ...params.metadata,
        },
      });

      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw new Error('Failed to create customer');
    }
  }

  /**
   * Retrieve or create a customer by email
   */
  static async getOrCreateCustomer(email: string, name: string): Promise<Stripe.Customer> {
    try {
      // First, try to find existing customer
      const existingCustomers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (existingCustomers.data.length > 0) {
        return existingCustomers.data[0];
      }

      // Create new customer if not found
      return await this.createCustomer({ email, name });
    } catch (error) {
      console.error('Error getting or creating customer:', error);
      throw new Error('Failed to get or create customer');
    }
  }

  /**
   * Create a payment intent for one-time donation
   */
  static async createPaymentIntent(params: CreatePaymentIntentParams): Promise<Stripe.PaymentIntent> {
    try {
      const amountCents = Math.round(params.amount * 100); // Convert to cents
      const processingFee = calculateStripeProcessingFee(params.amount);
      
      // Get or create customer
      const customer = await this.getOrCreateCustomer(params.donorEmail, params.donorName);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: params.currency || 'usd',
        customer: customer.id,
        payment_method_types: params.paymentMethodTypes || ['card', 'us_bank_account'],
        metadata: {
          designation: params.designation,
          donor_name: params.donorName,
          donor_email: params.donorEmail,
          processing_fee: processingFee.toString(),
          net_amount: (params.amount - processingFee).toString(),
          source: 'ccos-charity-guild',
          ...params.metadata,
        },
        description: `Donation to ${params.designation}`,
        receipt_email: params.donorEmail,
        setup_future_usage: params.isRecurring ? 'off_session' : undefined,
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  /**
   * Create a subscription for recurring donations
   */
  static async createSubscription(params: CreatePaymentIntentParams): Promise<Stripe.Subscription> {
    if (!params.isRecurring || !params.recurringFrequency) {
      throw new Error('Recurring parameters required for subscription');
    }

    try {
      const customer = await this.getOrCreateCustomer(params.donorEmail, params.donorName);
      
      // Create or get price for the donation amount
      const price = await this.createOrGetPrice(params.amount, params.recurringFrequency);

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: price.id }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          designation: params.designation,
          donor_name: params.donorName,
          donor_email: params.donorEmail,
          source: 'ccos-charity-guild',
          ...params.metadata,
        },
      });

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw new Error('Failed to create subscription');
    }
  }

  /**
   * Create or get a price for recurring donations
   */
  private static async createOrGetPrice(amount: number, frequency: string): Promise<Stripe.Price> {
    const amountCents = Math.round(amount * 100);
    const interval = frequency === 'monthly' ? 'month' : frequency === 'quarterly' ? 'month' : 'year';
    const intervalCount = frequency === 'quarterly' ? 3 : 1;
    
    // Create a price ID based on amount, interval, and interval count
    const priceId = `donation_${amountCents}_${interval}_${intervalCount}`;

    try {
      // Try to retrieve existing price
      const existingPrices = await stripe.prices.list({
        lookup_keys: [priceId],
        limit: 1,
      });

      if (existingPrices.data.length > 0) {
        return existingPrices.data[0];
      }

      // Create new price
      const price = await stripe.prices.create({
        unit_amount: amountCents,
        currency: 'usd',
        recurring: {
          interval: interval as 'month' | 'year',
          interval_count: intervalCount,
        },
        lookup_key: priceId,
        metadata: {
          type: 'donation',
          amount_dollars: amount.toString(),
        },
      });

      return price;
    } catch (error) {
      console.error('Error creating or getting price:', error);
      throw new Error('Failed to create or get price');
    }
  }

  /**
   * Process completed donation and save to database
   */
  static async processDonation(params: ProcessDonationParams): Promise<void> {
    try {
      // Retrieve payment intent to get payment details
      const paymentIntent = await stripe.paymentIntents.retrieve(params.paymentIntentId);
      
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment intent has not succeeded');
      }

      const amount = paymentIntent.amount / 100; // Convert from cents
      const processingFee = parseFloat(paymentIntent.metadata.processing_fee || '0');
      const netAmount = amount - processingFee;

      // Save donation to database
      const { data, error } = await supabase
        .from('donations')
        .insert({
          member_id: params.memberId,
          amount: amount,
          donation_date: new Date().toISOString(),
          method: 'online',
          designation: params.designation,
          transaction_id: paymentIntent.id,
          payment_processor: 'stripe',
          processing_fee: processingFee,
          net_amount: netAmount,
          receipt_sent: true, // Stripe handles receipts
          tax_deductible: true,
          is_recurring: params.isRecurring || false,
          recurring_frequency: params.recurringFrequency || null,
          anonymous: params.anonymous || false,
          notes: params.notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving donation to database:', error);
        throw new Error('Failed to save donation to database');
      }

      // Update member's total donated amount and get member info
      const member = await this.updateMemberDonationTotal(params.memberId);

      // Trigger donation acknowledgment automation
      try {
        if (member) {
          await automationService.triggerDonationAcknowledgment(data, member);
        }
      } catch (automationError) {
        console.error('Error triggering donation acknowledgment automation:', automationError);
        // Don't fail the donation processing if automation fails
      }

      console.log('Donation processed successfully:', data);
    } catch (error) {
      console.error('Error processing donation:', error);
      throw error;
    }
  }

  /**
   * Update member's total donation amount and tier
   */
  private static async updateMemberDonationTotal(memberId: string): Promise<any> {
    try {
      // Get current member info first
      const { data: currentMember, error: memberError } = await supabase
        .from('members')
        .select('*')
        .eq('id', memberId)
        .single();

      if (memberError || !currentMember) {
        throw memberError || new Error('Member not found');
      }

      const oldTier = currentMember.tier;

      // Calculate total donations for member
      const { data: donations, error: donationsError } = await supabase
        .from('donations')
        .select('amount')
        .eq('member_id', memberId);

      if (donationsError) {
        throw donationsError;
      }

      const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);

      // Determine tier based on total donated
      let newTier = 'bronze';
      if (totalDonated >= 10000) newTier = 'platinum';
      else if (totalDonated >= 2500) newTier = 'gold';
      else if (totalDonated >= 500) newTier = 'silver';

      // Update member record
      const { data: updatedMember, error: updateError } = await supabase
        .from('members')
        .update({
          total_donated: totalDonated,
          tier: newTier,
          updated_at: new Date().toISOString(),
        })
        .eq('id', memberId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      // Check if tier was upgraded and trigger automation
      if (oldTier !== newTier) {
        try {
          await automationService.triggerTierUpgrade(updatedMember, oldTier, newTier);
        } catch (automationError) {
          console.error('Error triggering tier upgrade automation:', automationError);
          // Don't fail the member update if automation fails
        }
      }

      console.log(`Updated member ${memberId}: total=${totalDonated}, tier=${newTier}`);
      return updatedMember;
    } catch (error) {
      console.error('Error updating member donation total:', error);
      throw error;
    }
  }

  /**
   * Handle webhook events from Stripe
   */
  static async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
          break;
          
        case 'payment_intent.payment_failed':
          await this.handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionEvent(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error(`Error handling webhook event ${event.type}:`, error);
      throw error;
    }
  }

  private static async handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log('Payment succeeded:', paymentIntent.id);
    // Additional processing if needed
  }

  private static async handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    console.log('Payment failed:', paymentIntent.id);
    // Handle failed payment - notify admins, update records, etc.
  }

  private static async handleSubscriptionEvent(subscription: Stripe.Subscription): Promise<void> {
    console.log('Subscription event:', subscription.id);
    // Handle subscription changes - update recurring donation records
  }

  private static async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice): Promise<void> {
    console.log('Invoice payment succeeded:', invoice.id);
    // Handle recurring payment success
  }

  private static async handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
    console.log('Invoice payment failed:', invoice.id);
    // Handle recurring payment failure
  }

  /**
   * Cancel a subscription
   */
  static async cancelSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    try {
      const subscription = await stripe.subscriptions.cancel(subscriptionId);
      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw new Error('Failed to cancel subscription');
    }
  }

  /**
   * Get customer payment methods
   */
  static async getCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw new Error('Failed to get payment methods');
    }
  }
}