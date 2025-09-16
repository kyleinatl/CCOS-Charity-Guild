import { Member } from '@/types';
import { createClient } from '@/lib/supabase/client';

/**
 * Member Onboarding Workflow Implementation
 * Handles automated welcome sequences and initial member engagement
 */

export interface OnboardingConfig {
  sendWelcomeEmail: boolean;
  welcomeEmailDelay: number; // in minutes
  sendTierIntroduction: boolean;
  tierIntroDelay: number; // in minutes
  sendPortalGuide: boolean;
  portalGuideDelay: number; // in minutes
  createFollowupTask: boolean;
  followupTaskDelay: number; // in hours
  personalizedContent: boolean;
}

export const DEFAULT_ONBOARDING_CONFIG: OnboardingConfig = {
  sendWelcomeEmail: true,
  welcomeEmailDelay: 0, // Immediate
  sendTierIntroduction: true,
  tierIntroDelay: 60, // 1 hour after welcome
  sendPortalGuide: true,
  portalGuideDelay: 180, // 3 hours after welcome
  createFollowupTask: true,
  followupTaskDelay: 72, // 3 days
  personalizedContent: true
};

export class MemberOnboardingWorkflow {
  private supabase = createClient();

  /**
   * Execute the complete member onboarding workflow
   */
  async executeOnboarding(member: Member, config: OnboardingConfig = DEFAULT_ONBOARDING_CONFIG): Promise<void> {
    try {
      console.log(`Starting onboarding workflow for member: ${member.first_name} ${member.last_name}`);

      // Step 1: Send immediate welcome email
      if (config.sendWelcomeEmail) {
        await this.scheduleWelcomeEmail(member, config.welcomeEmailDelay);
      }

      // Step 2: Send tier introduction email
      if (config.sendTierIntroduction) {
        await this.scheduleTierIntroduction(member, config.tierIntroDelay);
      }

      // Step 3: Send portal guide email
      if (config.sendPortalGuide) {
        await this.schedulePortalGuide(member, config.portalGuideDelay);
      }

      // Step 4: Create follow-up task for staff
      if (config.createFollowupTask) {
        await this.scheduleFollowupTask(member, config.followupTaskDelay);
      }

      // Log successful onboarding initiation
      await this.logOnboardingStep(member.id, 'workflow_started', {
        config,
        initiated_at: new Date().toISOString()
      });

      console.log(`Onboarding workflow initiated successfully for: ${member.first_name} ${member.last_name}`);
    } catch (error) {
      console.error('Error executing onboarding workflow:', error);
      await this.logOnboardingStep(member.id, 'workflow_failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        failed_at: new Date().toISOString()
      });
      throw error;
    }
  }

  /**
   * Schedule welcome email
   */
  private async scheduleWelcomeEmail(member: Member, delayMinutes: number): Promise<void> {
    const scheduledTime = new Date(Date.now() + delayMinutes * 60 * 1000);
    
    const emailContent = this.generateWelcomeEmailContent(member);
    
    // In a real implementation, this would integrate with your email service
    // For now, we'll create a communication record
    await this.createScheduledCommunication({
      member_id: member.id,
      type: 'email',
      subject: emailContent.subject,
      content: emailContent.content,
      scheduled_for: scheduledTime.toISOString(),
      template_name: 'member_welcome',
      priority: 'high'
    });

    await this.logOnboardingStep(member.id, 'welcome_email_scheduled', {
      scheduled_for: scheduledTime.toISOString(),
      delay_minutes: delayMinutes
    });
  }

  /**
   * Schedule tier introduction email
   */
  private async scheduleTierIntroduction(member: Member, delayMinutes: number): Promise<void> {
    const scheduledTime = new Date(Date.now() + delayMinutes * 60 * 1000);
    
    const emailContent = this.generateTierIntroductionContent(member);
    
    await this.createScheduledCommunication({
      member_id: member.id,
      type: 'email',
      subject: emailContent.subject,
      content: emailContent.content,
      scheduled_for: scheduledTime.toISOString(),
      template_name: 'tier_introduction',
      priority: 'medium'
    });

    await this.logOnboardingStep(member.id, 'tier_intro_scheduled', {
      scheduled_for: scheduledTime.toISOString(),
      member_tier: member.tier,
      delay_minutes: delayMinutes
    });
  }

  /**
   * Schedule portal guide email
   */
  private async schedulePortalGuide(member: Member, delayMinutes: number): Promise<void> {
    const scheduledTime = new Date(Date.now() + delayMinutes * 60 * 1000);
    
    const emailContent = this.generatePortalGuideContent(member);
    
    await this.createScheduledCommunication({
      member_id: member.id,
      type: 'email',
      subject: emailContent.subject,
      content: emailContent.content,
      scheduled_for: scheduledTime.toISOString(),
      template_name: 'portal_guide',
      priority: 'medium'
    });

    await this.logOnboardingStep(member.id, 'portal_guide_scheduled', {
      scheduled_for: scheduledTime.toISOString(),
      delay_minutes: delayMinutes
    });
  }

  /**
   * Schedule follow-up task for staff
   */
  private async scheduleFollowupTask(member: Member, delayHours: number): Promise<void> {
    const scheduledTime = new Date(Date.now() + delayHours * 60 * 60 * 1000);
    
    // Create a task for staff to follow up with the new member
    await this.createFollowupTask({
      member_id: member.id,
      title: `Follow up with new member: ${member.first_name} ${member.last_name}`,
      description: `Check in with new member, answer any questions, and ensure they're getting the most out of their membership.`,
      scheduled_for: scheduledTime.toISOString(),
      priority: 'medium',
      assigned_to: 'membership_coordinator'
    });

    await this.logOnboardingStep(member.id, 'followup_task_scheduled', {
      scheduled_for: scheduledTime.toISOString(),
      delay_hours: delayHours
    });
  }

  /**
   * Generate personalized welcome email content
   */
  private generateWelcomeEmailContent(member: Member): { subject: string; content: string } {
    const firstName = member.first_name;
    const tier = member.tier;
    const tierBenefits = this.getTierBenefits(tier);

    const subject = `Welcome to CCOS Charity Guild, ${firstName}!`;
    
    const content = `
      <h1>Welcome to CCOS Charity Guild, ${firstName}!</h1>
      
      <p>We're thrilled to have you join our community of passionate supporters. Your membership as a <strong>${tier.charAt(0).toUpperCase() + tier.slice(1)}</strong> member gives you access to exclusive benefits and the opportunity to make a real impact.</p>
      
      <h2>What's Next?</h2>
      <ul>
        <li>Check your email for your personalized member portal login details</li>
        <li>Explore your ${tier} tier benefits</li>
        <li>Connect with other members in our community</li>
        <li>Discover upcoming events and volunteer opportunities</li>
      </ul>
      
      <h2>Your ${tier.charAt(0).toUpperCase() + tier.slice(1)} Member Benefits:</h2>
      <ul>
        ${tierBenefits.map(benefit => `<li>${benefit}</li>`).join('')}
      </ul>
      
      <p>If you have any questions, don't hesitate to reach out to our member services team. We're here to help!</p>
      
      <p>Thank you for choosing to make a difference with CCOS Charity Guild.</p>
      
      <p>Warm regards,<br>
      The CCOS Charity Guild Team</p>
    `;

    return { subject, content };
  }

  /**
   * Generate tier introduction email content
   */
  private generateTierIntroductionContent(member: Member): { subject: string; content: string } {
    const firstName = member.first_name;
    const tier = member.tier;
    const tierBenefits = this.getTierBenefits(tier);
    const exclusivePerks = this.getExclusivePerks(tier);

    const subject = `Your ${tier.charAt(0).toUpperCase() + tier.slice(1)} Member Benefits Await!`;
    
    const content = `
      <h1>Discover Your ${tier.charAt(0).toUpperCase() + tier.slice(1)} Member Benefits, ${firstName}!</h1>
      
      <p>As a ${tier} member, you have access to exclusive benefits designed to enhance your experience and maximize your impact.</p>
      
      <h2>Your Exclusive Benefits:</h2>
      <ul>
        ${tierBenefits.map(benefit => `<li><strong>${benefit}</strong></li>`).join('')}
      </ul>
      
      ${exclusivePerks.length > 0 ? `
        <h2>Special ${tier.charAt(0).toUpperCase() + tier.slice(1)} Perks:</h2>
        <ul>
          ${exclusivePerks.map(perk => `<li>${perk}</li>`).join('')}
        </ul>
      ` : ''}
      
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal" style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Access Your Member Portal</a></p>
      
      <p>Ready to explore? Log into your member portal to start taking advantage of all your benefits!</p>
      
      <p>Best regards,<br>
      The CCOS Charity Guild Team</p>
    `;

    return { subject, content };
  }

  /**
   * Generate portal guide email content
   */
  private generatePortalGuideContent(member: Member): { subject: string; content: string } {
    const firstName = member.first_name;

    const subject = `Your Member Portal Guide - Get the Most Out of Your Membership`;
    
    const content = `
      <h1>Your Member Portal Guide, ${firstName}!</h1>
      
      <p>Now that you've had some time to settle in, let's make sure you're getting the most out of your member portal!</p>
      
      <h2>🏠 Portal Dashboard</h2>
      <p>Your dashboard shows your donation history, upcoming events, and personalized updates.</p>
      
      <h2>💖 Donation History</h2>
      <p>Track all your contributions and see the impact you're making. Download tax receipts anytime!</p>
      
      <h2>📅 Events & Opportunities</h2>
      <p>Register for exclusive member events, volunteer opportunities, and community gatherings.</p>
      
      <h2>👤 Profile Management</h2>
      <p>Keep your information up to date and customize your communication preferences.</p>
      
      <h2>📧 Communication Preferences</h2>
      <p>Choose how and when you'd like to hear from us. You're in control!</p>
      
      <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3>💡 Pro Tip</h3>
        <p>Set up recurring donations in your portal to maximize your impact and qualify for higher tier benefits!</p>
      </div>
      
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/portal" style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Explore Your Portal Now</a></p>
      
      <p>Questions? Our support team is here to help at support@ccoscharityguild.org</p>
      
      <p>Happy exploring!<br>
      The CCOS Charity Guild Team</p>
    `;

    return { subject, content };
  }

  /**
   * Get tier-specific benefits
   */
  private getTierBenefits(tier: string): string[] {
    const benefits = {
      bronze: [
        'Monthly newsletter with impact updates',
        'Annual impact report',
        'Member-only content access',
        'Community forum participation'
      ],
      silver: [
        'All Bronze benefits',
        'Quarterly member meetups',
        'Priority event registration',
        'Direct communication with program managers',
        'Volunteer opportunity matching'
      ],
      gold: [
        'All Silver benefits',
        'Monthly impact calls with leadership',
        'Behind-the-scenes facility tours',
        'Early access to new programs',
        'Personalized impact reports'
      ],
      platinum: [
        'All Gold benefits',
        'Quarterly strategy sessions with board members',
        'VIP event access and recognition',
        'Custom volunteer project opportunities',
        'Annual appreciation dinner invitation'
      ]
    };

    return benefits[tier as keyof typeof benefits] || benefits.bronze;
  }

  /**
   * Get exclusive perks for tier
   */
  private getExclusivePerks(tier: string): string[] {
    const perks = {
      bronze: [],
      silver: [
        'Welcome gift package',
        '10% discount on event merchandise'
      ],
      gold: [
        'Premium welcome gift',
        '15% discount on event merchandise',
        'Complimentary guest passes to select events'
      ],
      platinum: [
        'Exclusive platinum welcome package',
        '20% discount on all merchandise',
        'Unlimited guest passes',
        'Personal thank you call from leadership'
      ]
    };

    return perks[tier as keyof typeof perks] || [];
  }

  /**
   * Create a scheduled communication
   */
  private async createScheduledCommunication(params: {
    member_id: string;
    type: string;
    subject: string;
    content: string;
    scheduled_for: string;
    template_name: string;
    priority: string;
  }): Promise<void> {
    // This would integrate with your communication system
    // For now, we'll log it as a placeholder
    console.log(`Scheduled ${params.type} for member ${params.member_id}: ${params.subject}`);
    
    // In a real implementation, this would create a record in your communications table
    // or integrate with your email service provider
  }

  /**
   * Create a follow-up task
   */
  private async createFollowupTask(params: {
    member_id: string;
    title: string;
    description: string;
    scheduled_for: string;
    priority: string;
    assigned_to: string;
  }): Promise<void> {
    // This would integrate with your task management system
    // For now, we'll log it as a placeholder
    console.log(`Created follow-up task: ${params.title}`);
    
    // In a real implementation, this would create a task record
    // or integrate with your task management system
  }

  /**
   * Log onboarding step
   */
  private async logOnboardingStep(memberId: string, step: string, data: any): Promise<void> {
    try {
      await this.supabase
        .from('member_activities')
        .insert([{
          member_id: memberId,
          activity_type: 'onboarding_step',
          activity_description: `Onboarding: ${step}`,
          activity_value: null,
          metadata: data
        }]);
    } catch (error) {
      console.error('Error logging onboarding step:', error);
    }
  }

  /**
   * Get onboarding progress for a member
   */
  async getOnboardingProgress(memberId: string): Promise<any> {
    try {
      const { data: activities, error } = await this.supabase
        .from('member_activities')
        .select('*')
        .eq('member_id', memberId)
        .eq('activity_type', 'onboarding_step')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      const steps = activities?.map(activity => ({
        step: activity.activity_description?.replace('Onboarding: ', ''),
        completed_at: activity.created_at,
        metadata: activity.metadata
      })) || [];

      return {
        member_id: memberId,
        started: steps.length > 0,
        completed_steps: steps,
        progress_percentage: this.calculateProgressPercentage(steps)
      };
    } catch (error) {
      console.error('Error getting onboarding progress:', error);
      return {
        member_id: memberId,
        started: false,
        completed_steps: [],
        progress_percentage: 0
      };
    }
  }

  /**
   * Calculate onboarding progress percentage
   */
  private calculateProgressPercentage(completedSteps: any[]): number {
    const totalSteps = 4; // welcome_email, tier_intro, portal_guide, followup_task
    return Math.round((completedSteps.length / totalSteps) * 100);
  }
}

// Export singleton instance
export const memberOnboardingWorkflow = new MemberOnboardingWorkflow();