import { dataService } from '@/lib/data/data-service';

interface DonationAcknowledgmentConfig {
  sendThankYouEmail: boolean;
  thankYouEmailDelay?: number; // minutes
  sendImpactUpdate: boolean;
  impactUpdateDelay?: number; // hours
  sendTaxReceipt: boolean;
  taxReceiptDelay?: number; // minutes
  checkTierUpgrade: boolean;
  tierUpgradeDelay?: number; // minutes
  sendDonorRecognition: boolean;
  recognitionDelay?: number; // days
  personalizedContent: boolean;
  includeImpactStats: boolean;
  createFollowUpTask: boolean;
  taskDelay?: number; // days
}

const defaultConfig: DonationAcknowledgmentConfig = {
  sendThankYouEmail: true,
  thankYouEmailDelay: 0,
  sendImpactUpdate: true,
  impactUpdateDelay: 24,
  sendTaxReceipt: true,
  taxReceiptDelay: 5,
  checkTierUpgrade: true,
  tierUpgradeDelay: 1,
  sendDonorRecognition: false,
  recognitionDelay: 7,
  personalizedContent: true,
  includeImpactStats: true,
  createFollowUpTask: true,
  taskDelay: 30,
};

export class DonationAcknowledgmentWorkflow {
  private config: DonationAcknowledgmentConfig;

  constructor(config: Partial<DonationAcknowledgmentConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async executeDonationAcknowledgment(
    donation: any,
    member: any,
    config?: Partial<DonationAcknowledgmentConfig>
  ): Promise<{
    success: boolean;
    actionsExecuted: string[];
    errors: string[];
    scheduledTasks: Array<{ type: string; scheduledFor: Date }>;
  }> {
    const workflowConfig = { ...this.config, ...config };
    const actionsExecuted: string[] = [];
    const errors: string[] = [];
    const scheduledTasks: Array<{ type: string; scheduledFor: Date }> = [];

    try {
      console.log(`Starting donation acknowledgment workflow for donation ${donation.id}`);

      // 1. Send immediate thank you email
      if (workflowConfig.sendThankYouEmail) {
        try {
          const emailContent = await this.generateThankYouEmailContent(donation, member, workflowConfig);
          
          if (workflowConfig.thankYouEmailDelay && workflowConfig.thankYouEmailDelay > 0) {
            const scheduledTime = new Date(Date.now() + workflowConfig.thankYouEmailDelay * 60 * 1000);
            scheduledTasks.push({ type: 'thank_you_email', scheduledFor: scheduledTime });
            console.log(`Thank you email scheduled for ${scheduledTime.toISOString()}`);
          } else {
            await this.sendEmail('thank_you', member.email, emailContent);
            console.log(`Thank you email sent to ${member.email}`);
          }
          
          actionsExecuted.push('thank_you_email');
        } catch (error) {
          errors.push(`Failed to send thank you email: ${error}`);
        }
      }

      // 2. Generate and send tax receipt
      if (workflowConfig.sendTaxReceipt) {
        try {
          const receiptContent = await this.generateTaxReceiptContent(donation, member);
          
          if (workflowConfig.taxReceiptDelay && workflowConfig.taxReceiptDelay > 0) {
            const scheduledTime = new Date(Date.now() + workflowConfig.taxReceiptDelay * 60 * 1000);
            scheduledTasks.push({ type: 'tax_receipt', scheduledFor: scheduledTime });
            console.log(`Tax receipt scheduled for ${scheduledTime.toISOString()}`);
          } else {
            await this.sendEmail('tax_receipt', member.email, receiptContent);
            console.log(`Tax receipt sent to ${member.email}`);
          }
          
          actionsExecuted.push('tax_receipt');
        } catch (error) {
          errors.push(`Failed to send tax receipt: ${error}`);
        }
      }

      // 3. Check for tier upgrade
      if (workflowConfig.checkTierUpgrade) {
        try {
          const tierUpgrade = await this.checkAndProcessTierUpgrade(donation, member);
          if (tierUpgrade.upgraded) {
            if (workflowConfig.tierUpgradeDelay && workflowConfig.tierUpgradeDelay > 0) {
              const scheduledTime = new Date(Date.now() + workflowConfig.tierUpgradeDelay * 60 * 1000);
              scheduledTasks.push({ type: 'tier_upgrade_celebration', scheduledFor: scheduledTime });
              console.log(`Tier upgrade celebration scheduled for ${scheduledTime.toISOString()}`);
            } else {
              await this.sendTierUpgradeCelebration(member, tierUpgrade.oldTier || 'bronze', tierUpgrade.newTier || 'silver');
              console.log(`Tier upgrade celebration sent for ${member.email}`);
            }
            actionsExecuted.push('tier_upgrade_check');
          }
        } catch (error) {
          errors.push(`Failed to check tier upgrade: ${error}`);
        }
      }

      // 4. Send personalized impact update
      if (workflowConfig.sendImpactUpdate) {
        try {
          const impactContent = await this.generateImpactUpdateContent(donation, member, workflowConfig);
          
          const scheduledTime = new Date(Date.now() + (workflowConfig.impactUpdateDelay || 24) * 60 * 60 * 1000);
          scheduledTasks.push({ type: 'impact_update', scheduledFor: scheduledTime });
          console.log(`Impact update scheduled for ${scheduledTime.toISOString()}`);
          
          actionsExecuted.push('impact_update_scheduled');
        } catch (error) {
          errors.push(`Failed to schedule impact update: ${error}`);
        }
      }

      // 5. Handle donor recognition (for larger donations)
      if (workflowConfig.sendDonorRecognition && donation.amount >= 500) {
        try {
          const recognitionContent = await this.generateDonorRecognitionContent(donation, member);
          
          const scheduledTime = new Date(Date.now() + (workflowConfig.recognitionDelay || 7) * 24 * 60 * 60 * 1000);
          scheduledTasks.push({ type: 'donor_recognition', scheduledFor: scheduledTime });
          console.log(`Donor recognition scheduled for ${scheduledTime.toISOString()}`);
          
          actionsExecuted.push('donor_recognition_scheduled');
        } catch (error) {
          errors.push(`Failed to schedule donor recognition: ${error}`);
        }
      }

      // 6. Create follow-up task for staff
      if (workflowConfig.createFollowUpTask) {
        try {
          await this.createStaffFollowUpTask(donation, member, workflowConfig.taskDelay || 30);
          actionsExecuted.push('staff_follow_up_task');
          console.log(`Staff follow-up task created for donation ${donation.id}`);
        } catch (error) {
          errors.push(`Failed to create staff follow-up task: ${error}`);
        }
      }

      // 7. Update donation record with acknowledgment status
      try {
        await this.updateDonationAcknowledgmentStatus(donation.id, {
          acknowledgment_sent: true,
          acknowledgment_date: new Date().toISOString(),
          workflow_completed: errors.length === 0,
          actions_executed: actionsExecuted,
          scheduled_actions: scheduledTasks.length,
        });
        console.log(`Donation ${donation.id} acknowledgment status updated`);
      } catch (error) {
        errors.push(`Failed to update donation status: ${error}`);
      }

      return {
        success: errors.length === 0,
        actionsExecuted,
        errors,
        scheduledTasks,
      };

    } catch (error) {
      console.error('Donation acknowledgment workflow failed:', error);
      return {
        success: false,
        actionsExecuted,
        errors: [...errors, `Workflow failed: ${error}`],
        scheduledTasks,
      };
    }
  }

  private async generateThankYouEmailContent(
    donation: any,
    member: any,
    config: DonationAcknowledgmentConfig
  ): Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
  }> {
    const memberName = member.first_name || 'Valued Donor';
    const donationAmount = donation.amount.toFixed(2);
    const designation = donation.designation || 'General Fund';
    const isRecurring = donation.is_recurring ? 'recurring ' : '';

    // Generate personalized impact message
    const impactMessage = config.personalizedContent 
      ? await this.generatePersonalizedImpactMessage(donation, member)
      : this.getGenericImpactMessage(donation.designation);

    const subject = `Thank you for your ${isRecurring}donation to ${designation}!`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Thank You, ${memberName}!</h1>
          <p style="font-size: 18px; color: #666;">Your generosity makes a real difference</p>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">Donation Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Amount:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">$${donationAmount}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Designation:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${designation}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Date:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString()}</td>
            </tr>
            ${donation.is_recurring ? `
            <tr>
              <td style="padding: 8px 0; color: #666;">Frequency:</td>
              <td style="padding: 8px 0; font-weight: bold; text-align: right;">${donation.recurring_frequency || 'Monthly'}</td>
            </tr>
            ` : ''}
          </table>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">Your Impact</h2>
          <p style="line-height: 1.6; color: #333;">${impactMessage}</p>
        </div>

        ${config.includeImpactStats ? `
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #065f46; margin-bottom: 15px;">Community Impact This Year</h3>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #047857;">1,247</div>
              <div style="font-size: 14px; color: #065f46;">People Helped</div>
            </div>
            <div style="text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #047857;">$45,230</div>
              <div style="font-size: 14px; color: #065f46;">Total Raised</div>
            </div>
          </div>
        </div>
        ` : ''}

        <div style="text-align: center; margin-bottom: 30px;">
          <p style="color: #666; margin-bottom: 15px;">Want to see more of your impact?</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/donations" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Your Donation History
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>CCOS Charity Guild<br>
          Tax ID: 12-3456789</p>
          <p>Your official tax receipt will be sent separately within 5 minutes.</p>
        </div>
      </div>
    `;

    const textContent = `
Thank you, ${memberName}!

Your ${isRecurring}donation of $${donationAmount} to ${designation} has been received.

${impactMessage}

Donation Details:
- Amount: $${donationAmount}
- Designation: ${designation}
- Date: ${new Date().toLocaleDateString()}
${donation.is_recurring ? `- Frequency: ${donation.recurring_frequency || 'Monthly'}` : ''}

View your donation history: ${process.env.NEXT_PUBLIC_APP_URL}/portal/donations

Your official tax receipt will be sent separately within 5 minutes.

CCOS Charity Guild
Tax ID: 12-3456789
    `;

    return { subject, htmlContent, textContent };
  }

  private async generateTaxReceiptContent(donation: any, member: any): Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
    attachments?: Array<{ filename: string; content: Buffer; contentType: string }>;
  }> {
    const receiptNumber = `RECEIPT-${donation.id.substr(-8).toUpperCase()}-${new Date().getFullYear()}`;
    const memberName = member.first_name && member.last_name 
      ? `${member.first_name} ${member.last_name}` 
      : member.first_name || 'Valued Donor';

    const subject = `Tax Receipt #${receiptNumber} - CCOS Charity Guild`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #2563eb; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 5px;">CCOS Charity Guild</h1>
          <p style="color: #666; margin: 0;">Official Tax Receipt</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; margin-bottom: 15px;">Receipt #${receiptNumber}</h2>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 150px;">Donor:</td>
              <td style="padding: 8px 0; font-weight: bold;">${memberName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Email:</td>
              <td style="padding: 8px 0;">${member.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Date of Gift:</td>
              <td style="padding: 8px 0;">${new Date().toLocaleDateString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Amount:</td>
              <td style="padding: 8px 0; font-weight: bold; font-size: 18px;">$${donation.amount.toFixed(2)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Designation:</td>
              <td style="padding: 8px 0;">${donation.designation || 'General Fund'}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Payment Method:</td>
              <td style="padding: 8px 0;">Credit Card</td>
            </tr>
          </table>
        </div>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-bottom: 15px;">Tax Information</h3>
          <p style="margin-bottom: 10px; color: #333;">
            <strong>CCOS Charity Guild</strong> is a qualified 501(c)(3) tax-exempt organization.
          </p>
          <p style="margin-bottom: 10px; color: #333;">
            <strong>Tax ID:</strong> 12-3456789
          </p>
          <p style="margin-bottom: 0; color: #333;">
            No goods or services were provided in exchange for this contribution. 
            This receipt serves as acknowledgment of your tax-deductible charitable contribution.
          </p>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          <p>Please retain this receipt for your tax records.</p>
          <p>CCOS Charity Guild<br>
          123 Charity Lane<br>
          Community City, ST 12345<br>
          Phone: (555) 123-4567</p>
        </div>
      </div>
    `;

    const textContent = `
CCOS CHARITY GUILD
Official Tax Receipt

Receipt #${receiptNumber}

Donor: ${memberName}
Email: ${member.email}
Date of Gift: ${new Date().toLocaleDateString()}
Amount: $${donation.amount.toFixed(2)}
Designation: ${donation.designation || 'General Fund'}
Payment Method: Credit Card

TAX INFORMATION:
CCOS Charity Guild is a qualified 501(c)(3) tax-exempt organization.
Tax ID: 12-3456789

No goods or services were provided in exchange for this contribution. 
This receipt serves as acknowledgment of your tax-deductible charitable contribution.

Please retain this receipt for your tax records.

CCOS Charity Guild
123 Charity Lane
Community City, ST 12345
Phone: (555) 123-4567
    `;

    return { subject, htmlContent, textContent };
  }

  private async checkAndProcessTierUpgrade(donation: any, member: any): Promise<{
    upgraded: boolean;
    oldTier?: string;
    newTier?: string;
  }> {
    try {
      // Get member's total donations this year
      const currentYear = new Date().getFullYear();
      const donations = await dataService.getMemberDonations(member.id);
      const yearlyTotal = donations
        .filter(d => new Date(d.created_at).getFullYear() === currentYear)
        .reduce((sum, d) => sum + d.amount, 0);

      const currentTier = member.membership_tier;
      let newTier = currentTier;

      // Define tier thresholds
      if (yearlyTotal >= 10000) newTier = 'champion';
      else if (yearlyTotal >= 5000) newTier = 'patron';
      else if (yearlyTotal >= 1000) newTier = 'advocate';
      else if (yearlyTotal >= 500) newTier = 'supporter';
      else if (yearlyTotal >= 100) newTier = 'friend';
      else newTier = 'member';

      if (newTier !== currentTier) {
        // Update member tier
        await dataService.updateMember(member.id, { membership_tier: newTier });
        
        console.log(`Member ${member.id} upgraded from ${currentTier} to ${newTier}`);
        
        return {
          upgraded: true,
          oldTier: currentTier,
          newTier,
        };
      }

      return { upgraded: false };
    } catch (error) {
      console.error('Error checking tier upgrade:', error);
      return { upgraded: false };
    }
  }

  private async sendTierUpgradeCelebration(member: any, oldTier: string, newTier: string): Promise<void> {
    const tierBenefits = this.getTierBenefits(newTier);
    const celebrationContent = {
      subject: `🎉 Congratulations! You've been upgraded to ${newTier.charAt(0).toUpperCase() + newTier.slice(1)}!`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #059669; margin-bottom: 10px;">🎉 Congratulations!</h1>
            <p style="font-size: 18px; color: #666;">You've been upgraded to <strong>${newTier.charAt(0).toUpperCase() + newTier.slice(1)}</strong> status!</p>
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #065f46; margin-bottom: 15px;">Your New Benefits</h2>
            <ul style="color: #047857; line-height: 1.8;">
              ${tierBenefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
          </div>

          <div style="text-align: center;">
            <p style="color: #666; margin-bottom: 15px;">Thank you for your continued support!</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/profile" 
               style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Your Profile
            </a>
          </div>
        </div>
      `,
    };

    await this.sendEmail('tier_upgrade', member.email, celebrationContent);
  }

  private async generateImpactUpdateContent(
    donation: any,
    member: any,
    config: DonationAcknowledgmentConfig
  ): Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
  }> {
    const memberName = member.first_name || 'Valued Donor';
    const designation = donation.designation || 'General Fund';

    const subject = `Your impact in action: ${designation} update`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Your Impact in Action</h1>
          <p style="font-size: 16px; color: #666;">See how your donation to ${designation} is making a difference</p>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #0c4a6e; margin-bottom: 15px;">Recent Updates</h2>
          <p style="color: #0369a1; line-height: 1.6;">
            Thanks to donors like you, our ${designation} has helped 47 families this month with essential resources and support.
            Your contribution is directly funding community programs that provide education, healthcare, and emergency assistance.
          </p>
        </div>
      </div>
    `;

    const textContent = `
Your Impact in Action

Dear ${memberName},

See how your donation to ${designation} is making a difference in our community.

Thanks to donors like you, our ${designation} has helped 47 families this month with essential resources and support.
Your contribution is directly funding community programs that provide education, healthcare, and emergency assistance.

Thank you for being part of our mission!

CCOS Charity Guild
    `;

    return { subject, htmlContent, textContent };
  }

  private async generateDonorRecognitionContent(donation: any, member: any): Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
  }> {
    const memberName = member.first_name || 'Valued Donor';
    
    return {
      subject: 'You are making an extraordinary difference',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #7c3aed;">Dear ${memberName},</h1>
          <p>Your generous donation of $${donation.amount.toFixed(2)} places you among our most valued supporters...</p>
        </div>
      `,
      textContent: `Dear ${memberName}, Your generous donation places you among our most valued supporters...`,
    };
  }

  private async generatePersonalizedImpactMessage(donation: any, member: any): Promise<string> {
    const designation = donation.designation || 'General Fund';
    const amount = donation.amount;

    const impactMessages: Record<string, string> = {
      'General Fund': `Your $${amount.toFixed(2)} donation helps us maintain our core programs and respond to urgent community needs.`,
      'Education Program': `Your $${amount.toFixed(2)} contribution will provide educational resources for ${Math.floor(amount / 25)} students.`,
      'Community Outreach': `Your $${amount.toFixed(2)} gift enables us to reach ${Math.floor(amount / 15)} more community members with essential services.`,
      'Emergency Relief Fund': `Your $${amount.toFixed(2)} donation helps us provide immediate assistance to families in crisis.`,
      'Youth Programs': `Your $${amount.toFixed(2)} investment supports youth development activities for ${Math.floor(amount / 30)} young people.`,
    };

    return impactMessages[designation] || impactMessages['General Fund'];
  }

  private getGenericImpactMessage(designation: string): string {
    return `Your generous donation to ${designation} helps us continue our mission of serving the community and making a positive impact in people's lives.`;
  }

  private getTierBenefits(tier: string): string[] {
    const benefits: Record<string, string[]> = {
      'friend': [
        'Quarterly newsletter updates',
        'Annual impact report',
        'Access to member portal',
      ],
      'supporter': [
        'Monthly newsletter updates',
        'Quarterly impact reports',
        'Member-only events invitation',
        'Priority customer support',
      ],
      'advocate': [
        'Weekly updates and insights',
        'Exclusive advocate events',
        'Direct communication with leadership',
        'Early access to new programs',
      ],
      'patron': [
        'Personal impact reports',
        'VIP event access',
        'One-on-one meetings with leadership',
        'Program naming opportunities',
      ],
      'champion': [
        'Executive briefings',
        'Board meeting invitations',
        'Personal stewardship visits',
        'Legacy program enrollment',
      ],
    };

    return benefits[tier] || benefits['friend'];
  }

  private async createStaffFollowUpTask(donation: any, member: any, delayDays: number): Promise<void> {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + delayDays);

    // This would integrate with your task management system
    console.log(`Creating follow-up task for donation ${donation.id}, due ${dueDate.toISOString()}`);
  }

  private async updateDonationAcknowledgmentStatus(donationId: string, status: any): Promise<void> {
    // Update donation record with acknowledgment information
    console.log(`Updating donation ${donationId} acknowledgment status:`, status);
  }

  private async sendEmail(type: string, recipient: string, content: any): Promise<void> {
    // Integration with email service (SendGrid, AWS SES, etc.)
    console.log(`Sending ${type} email to ${recipient}:`, content.subject);
    
    // For now, we'll log the email content
    // In production, this would integrate with your email service
    return Promise.resolve();
  }

  // Get acknowledgment progress for a donation
  async getAcknowledgmentProgress(donationId: string): Promise<{
    donation: any;
    acknowledgmentSent: boolean;
    actionsCompleted: string[];
    scheduledActions: Array<{ type: string; scheduledFor: Date; completed: boolean }>;
    completionPercentage: number;
  }> {
    try {
      const donation = await dataService.getDonation(donationId);
      
      // This would come from your automation logs in production
      const mockProgress = {
        donation,
        acknowledgmentSent: true,
        actionsCompleted: ['thank_you_email', 'tax_receipt', 'tier_upgrade_check'],
        scheduledActions: [
          { type: 'impact_update', scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), completed: false },
          { type: 'donor_recognition', scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), completed: false },
        ],
        completionPercentage: 60,
      };

      return mockProgress;
    } catch (error) {
      console.error('Error getting acknowledgment progress:', error);
      throw error;
    }
  }
}

export const donationAcknowledgmentWorkflow = new DonationAcknowledgmentWorkflow();