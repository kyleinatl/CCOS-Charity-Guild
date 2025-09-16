import { dataService } from '@/lib/data/data-service';

interface EventAutomationConfig {
  sendRegistrationConfirmation: boolean;
  confirmationDelay?: number; // minutes
  sendEventReminders: boolean;
  reminderSchedule?: number[]; // hours before event [168, 24, 1] = 1 week, 1 day, 1 hour
  sendCapacityAlerts: boolean;
  capacityThresholds?: number[]; // percentages [75, 90, 100]
  sendWaitlistNotifications: boolean;
  waitlistDelay?: number; // minutes
  sendCheckInNotifications: boolean;
  checkInDelay?: number; // minutes
  sendPostEventSurvey: boolean;
  surveyDelay?: number; // hours after event
  sendEventThankYou: boolean;
  thankYouDelay?: number; // hours after event
  sendEventDigest: boolean;
  digestDelay?: number; // days after event
  personalizedContent: boolean;
  includeEventDetails: boolean;
  includeDirections: boolean;
  includeCalendarInvite: boolean;
  createStaffTasks: boolean;
  notifyEventStaff: boolean;
}

const defaultConfig: EventAutomationConfig = {
  sendRegistrationConfirmation: true,
  confirmationDelay: 0,
  sendEventReminders: true,
  reminderSchedule: [168, 24, 1], // 1 week, 1 day, 1 hour
  sendCapacityAlerts: true,
  capacityThresholds: [75, 90, 100],
  sendWaitlistNotifications: true,
  waitlistDelay: 2,
  sendCheckInNotifications: true,
  checkInDelay: 0,
  sendPostEventSurvey: true,
  surveyDelay: 24,
  sendEventThankYou: true,
  thankYouDelay: 2,
  sendEventDigest: true,
  digestDelay: 7,
  personalizedContent: true,
  includeEventDetails: true,
  includeDirections: true,
  includeCalendarInvite: true,
  createStaffTasks: true,
  notifyEventStaff: true,
};

export class EventManagementWorkflow {
  private config: EventAutomationConfig;

  constructor(config: Partial<EventAutomationConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Execute registration confirmation workflow
   * Triggered when a member registers for an event
   */
  async executeRegistrationConfirmation(
    event: any,
    member: any,
    registration: any,
    config?: Partial<EventAutomationConfig>
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
      console.log(`Starting registration confirmation workflow for event ${event.id}, member ${member.id}`);

      // 1. Send immediate registration confirmation
      if (workflowConfig.sendRegistrationConfirmation) {
        try {
          const confirmationContent = await this.generateRegistrationConfirmationContent(
            event, member, registration, workflowConfig
          );

          if (workflowConfig.confirmationDelay && workflowConfig.confirmationDelay > 0) {
            const scheduledTime = new Date(Date.now() + workflowConfig.confirmationDelay * 60 * 1000);
            scheduledTasks.push({ type: 'registration_confirmation', scheduledFor: scheduledTime });
          } else {
            await this.sendEmail('registration_confirmation', member.email, confirmationContent);
            console.log(`Registration confirmation sent to ${member.email}`);
          }

          actionsExecuted.push('registration_confirmation');
        } catch (error) {
          errors.push(`Failed to send registration confirmation: ${error}`);
        }
      }

      // 2. Schedule event reminders
      if (workflowConfig.sendEventReminders && workflowConfig.reminderSchedule) {
        try {
          const eventDate = new Date(event.start_date);
          
          for (const hoursBeforeEvent of workflowConfig.reminderSchedule) {
            const reminderTime = new Date(eventDate.getTime() - hoursBeforeEvent * 60 * 60 * 1000);
            
            if (reminderTime > new Date()) {
              scheduledTasks.push({
                type: `event_reminder_${hoursBeforeEvent}h`,
                scheduledFor: reminderTime
              });
            }
          }

          console.log(`Scheduled ${scheduledTasks.length} event reminders`);
          actionsExecuted.push('event_reminders_scheduled');
        } catch (error) {
          errors.push(`Failed to schedule event reminders: ${error}`);
        }
      }

      // 3. Check capacity and send alerts if needed
      if (workflowConfig.sendCapacityAlerts) {
        try {
          await this.checkAndSendCapacityAlerts(event, registration, workflowConfig);
          actionsExecuted.push('capacity_check');
        } catch (error) {
          errors.push(`Failed to check capacity: ${error}`);
        }
      }

      // 4. Handle waitlist if event is full
      if (registration.status === 'waitlisted' && workflowConfig.sendWaitlistNotifications) {
        try {
          const waitlistContent = await this.generateWaitlistNotificationContent(event, member, registration);
          
          if (workflowConfig.waitlistDelay && workflowConfig.waitlistDelay > 0) {
            const scheduledTime = new Date(Date.now() + workflowConfig.waitlistDelay * 60 * 1000);
            scheduledTasks.push({ type: 'waitlist_notification', scheduledFor: scheduledTime });
          } else {
            await this.sendEmail('waitlist_notification', member.email, waitlistContent);
          }

          actionsExecuted.push('waitlist_notification');
        } catch (error) {
          errors.push(`Failed to send waitlist notification: ${error}`);
        }
      }

      // 5. Notify event staff
      if (workflowConfig.notifyEventStaff) {
        try {
          await this.notifyEventStaff(event, member, registration, 'new_registration');
          actionsExecuted.push('staff_notification');
        } catch (error) {
          errors.push(`Failed to notify event staff: ${error}`);
        }
      }

      // 6. Create staff tasks if needed
      if (workflowConfig.createStaffTasks) {
        try {
          await this.createEventStaffTasks(event, registration, 'registration');
          actionsExecuted.push('staff_tasks_created');
        } catch (error) {
          errors.push(`Failed to create staff tasks: ${error}`);
        }
      }

      // 7. Schedule post-event workflows
      try {
        const eventEndDate = new Date(event.end_date || event.start_date);
        
        if (workflowConfig.sendPostEventSurvey) {
          const surveyTime = new Date(eventEndDate.getTime() + (workflowConfig.surveyDelay || 24) * 60 * 60 * 1000);
          scheduledTasks.push({ type: 'post_event_survey', scheduledFor: surveyTime });
        }

        if (workflowConfig.sendEventThankYou) {
          const thankYouTime = new Date(eventEndDate.getTime() + (workflowConfig.thankYouDelay || 2) * 60 * 60 * 1000);
          scheduledTasks.push({ type: 'event_thank_you', scheduledFor: thankYouTime });
        }

        if (workflowConfig.sendEventDigest) {
          const digestTime = new Date(eventEndDate.getTime() + (workflowConfig.digestDelay || 7) * 24 * 60 * 60 * 1000);
          scheduledTasks.push({ type: 'event_digest', scheduledFor: digestTime });
        }

        actionsExecuted.push('post_event_workflows_scheduled');
      } catch (error) {
        errors.push(`Failed to schedule post-event workflows: ${error}`);
      }

      return {
        success: errors.length === 0,
        actionsExecuted,
        errors,
        scheduledTasks,
      };

    } catch (error) {
      console.error('Registration confirmation workflow failed:', error);
      return {
        success: false,
        actionsExecuted,
        errors: [...errors, `Workflow failed: ${error}`],
        scheduledTasks,
      };
    }
  }

  /**
   * Execute event reminder workflow
   */
  async executeEventReminder(
    event: any,
    member: any,
    registration: any,
    reminderType: string,
    config?: Partial<EventAutomationConfig>
  ): Promise<{
    success: boolean;
    actionsExecuted: string[];
    errors: string[];
  }> {
    const workflowConfig = { ...this.config, ...config };
    const actionsExecuted: string[] = [];
    const errors: string[] = [];

    try {
      console.log(`Sending ${reminderType} reminder for event ${event.id} to member ${member.id}`);

      const reminderContent = await this.generateEventReminderContent(
        event, member, registration, reminderType, workflowConfig
      );

      await this.sendEmail('event_reminder', member.email, reminderContent);
      actionsExecuted.push(`${reminderType}_reminder_sent`);

      console.log(`${reminderType} reminder sent successfully to ${member.email}`);

      return {
        success: true,
        actionsExecuted,
        errors,
      };

    } catch (error) {
      console.error(`Event reminder workflow failed:`, error);
      return {
        success: false,
        actionsExecuted,
        errors: [`Reminder failed: ${error}`],
      };
    }
  }

  /**
   * Execute check-in notification workflow
   */
  async executeCheckInNotification(
    event: any,
    member: any,
    registration: any,
    config?: Partial<EventAutomationConfig>
  ): Promise<{
    success: boolean;
    actionsExecuted: string[];
    errors: string[];
  }> {
    const workflowConfig = { ...this.config, ...config };
    const actionsExecuted: string[] = [];
    const errors: string[] = [];

    try {
      console.log(`Processing check-in notification for event ${event.id}, member ${member.id}`);

      if (workflowConfig.sendCheckInNotifications) {
        const checkInContent = await this.generateCheckInNotificationContent(event, member, registration);

        if (workflowConfig.checkInDelay && workflowConfig.checkInDelay > 0) {
          // Schedule delayed check-in notification
          console.log(`Check-in notification scheduled for ${workflowConfig.checkInDelay} minutes`);
        } else {
          await this.sendEmail('check_in_notification', member.email, checkInContent);
          console.log(`Check-in notification sent to ${member.email}`);
        }

        actionsExecuted.push('check_in_notification');
      }

      // Update registration status
      await this.updateRegistrationStatus(registration.id, 'checked_in');
      actionsExecuted.push('registration_status_updated');

      // Notify event staff
      if (workflowConfig.notifyEventStaff) {
        await this.notifyEventStaff(event, member, registration, 'check_in');
        actionsExecuted.push('staff_check_in_notification');
      }

      return {
        success: true,
        actionsExecuted,
        errors,
      };

    } catch (error) {
      console.error('Check-in notification workflow failed:', error);
      return {
        success: false,
        actionsExecuted,
        errors: [`Check-in workflow failed: ${error}`],
      };
    }
  }

  /**
   * Execute post-event survey workflow
   */
  async executePostEventSurvey(
    event: any,
    member: any,
    registration: any,
    config?: Partial<EventAutomationConfig>
  ): Promise<{
    success: boolean;
    actionsExecuted: string[];
    errors: string[];
  }> {
    const workflowConfig = { ...this.config, ...config };
    const actionsExecuted: string[] = [];
    const errors: string[] = [];

    try {
      console.log(`Sending post-event survey for event ${event.id} to member ${member.id}`);

      if (workflowConfig.sendPostEventSurvey) {
        const surveyContent = await this.generatePostEventSurveyContent(event, member, registration);

        await this.sendEmail('post_event_survey', member.email, surveyContent);
        actionsExecuted.push('post_event_survey_sent');

        console.log(`Post-event survey sent to ${member.email}`);
      }

      return {
        success: true,
        actionsExecuted,
        errors,
      };

    } catch (error) {
      console.error('Post-event survey workflow failed:', error);
      return {
        success: false,
        actionsExecuted,
        errors: [`Survey workflow failed: ${error}`],
      };
    }
  }

  private async generateRegistrationConfirmationContent(
    event: any,
    member: any,
    registration: any,
    config: EventAutomationConfig
  ): Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
    attachments?: Array<{ filename: string; content: Buffer; contentType: string }>;
  }> {
    const memberName = member.first_name || 'Valued Member';
    const eventName = event.name || event.title;
    const eventDate = new Date(event.start_date);
    const eventLocation = event.location || 'Location TBD';
    const registrationFee = registration.amount_paid || event.registration_fee || 0;

    const subject = `Registration Confirmed: ${eventName}`;

    const calendarInviteData = config.includeCalendarInvite ? 
      await this.generateCalendarInvite(event) : null;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Registration Confirmed!</h1>
          <p style="font-size: 18px; color: #666;">You're all set for ${eventName}</p>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #0c4a6e; margin-bottom: 15px;">Event Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; width: 120px;">Event:</td>
              <td style="padding: 8px 0; font-weight: bold;">${eventName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Date & Time:</td>
              <td style="padding: 8px 0; font-weight: bold;">${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Location:</td>
              <td style="padding: 8px 0;">${eventLocation}</td>
            </tr>
            ${registrationFee > 0 ? `
            <tr>
              <td style="padding: 8px 0; color: #666;">Registration Fee:</td>
              <td style="padding: 8px 0; font-weight: bold;">$${registrationFee.toFixed(2)}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; color: #666;">Registration ID:</td>
              <td style="padding: 8px 0; font-family: monospace;">${registration.id}</td>
            </tr>
          </table>
        </div>

        ${config.includeEventDetails && event.description ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-bottom: 15px;">About This Event</h3>
          <p style="line-height: 1.6; color: #333;">${event.description}</p>
        </div>
        ` : ''}

        ${config.includeDirections && event.location_details ? `
        <div style="margin-bottom: 30px;">
          <h3 style="color: #1e40af; margin-bottom: 15px;">Getting There</h3>
          <p style="line-height: 1.6; color: #333;">${event.location_details}</p>
          <p style="margin-top: 10px;">
            <a href="https://maps.google.com/?q=${encodeURIComponent(eventLocation)}" 
               style="color: #2563eb; text-decoration: none;">📍 View on Google Maps</a>
          </p>
        </div>
        ` : ''}

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #065f46; margin-bottom: 15px;">What to Expect</h3>
          <ul style="color: #047857; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Check-in opens 30 minutes before the event</li>
            <li>Please bring a photo ID for check-in</li>
            <li>Light refreshments will be provided</li>
            <li>Event materials will be available for download</li>
          </ul>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <p style="color: #666; margin-bottom: 15px;">Need to make changes to your registration?</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/events" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Manage Registration
          </a>
        </div>

        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>CCOS Charity Guild<br>
          We look forward to seeing you at ${eventName}!</p>
          <p style="margin-top: 15px;">
            Questions? Contact us at events@ccoscharityguild.org or (555) 123-4567
          </p>
        </div>
      </div>
    `;

    const textContent = `
Registration Confirmed: ${eventName}

Dear ${memberName},

You're all set for ${eventName}!

Event Details:
- Event: ${eventName}
- Date & Time: ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString()}
- Location: ${eventLocation}
${registrationFee > 0 ? `- Registration Fee: $${registrationFee.toFixed(2)}` : ''}
- Registration ID: ${registration.id}

What to Expect:
- Check-in opens 30 minutes before the event
- Please bring a photo ID for check-in
- Light refreshments will be provided
- Event materials will be available for download

Manage your registration: ${process.env.NEXT_PUBLIC_APP_URL}/portal/events

Questions? Contact us at events@ccoscharityguild.org or (555) 123-4567

CCOS Charity Guild
We look forward to seeing you at ${eventName}!
    `;

    const result = { subject, htmlContent, textContent };
    
    if (calendarInviteData) {
      return {
        ...result,
        attachments: [{
          filename: `${eventName.replace(/[^a-zA-Z0-9]/g, '_')}.ics`,
          content: Buffer.from(calendarInviteData),
          contentType: 'text/calendar'
        }]
      };
    }

    return result;
  }

  private async generateEventReminderContent(
    event: any,
    member: any,
    registration: any,
    reminderType: string,
    config: EventAutomationConfig
  ): Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
  }> {
    const memberName = member.first_name || 'Valued Member';
    const eventName = event.name || event.title;
    const eventDate = new Date(event.start_date);
    const eventLocation = event.location || 'Location TBD';

    const timeMap: Record<string, string> = {
      'event_reminder_168h': 'next week',
      'event_reminder_24h': 'tomorrow',
      'event_reminder_1h': 'in 1 hour',
    };

    const timeFrame = timeMap[reminderType] || 'soon';
    const subject = `Reminder: ${eventName} is ${timeFrame}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">Event Reminder</h1>
          <p style="font-size: 18px; color: #666;">${eventName} is ${timeFrame}!</p>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #f59e0b;">
          <h2 style="color: #92400e; margin-bottom: 15px;">Quick Details</h2>
          <p style="color: #78350f; margin: 0;"><strong>When:</strong> ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString()}</p>
          <p style="color: #78350f; margin: 8px 0 0 0;"><strong>Where:</strong> ${eventLocation}</p>
        </div>

        ${reminderType === 'event_reminder_24h' ? `
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #065f46; margin-bottom: 15px;">Don't Forget</h3>
          <ul style="color: #047857; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Bring a photo ID for check-in</li>
            <li>Arrive 15-30 minutes early</li>
            <li>Check the weather and dress accordingly</li>
            <li>Parking information is available on our website</li>
          </ul>
        </div>
        ` : ''}

        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/events" 
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Event Details
          </a>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>Looking forward to seeing you there!</p>
          <p>Questions? Contact us at events@ccoscharityguild.org</p>
        </div>
      </div>
    `;

    const textContent = `
Event Reminder: ${eventName} is ${timeFrame}!

Dear ${memberName},

Just a friendly reminder that ${eventName} is ${timeFrame}.

When: ${eventDate.toLocaleDateString()} at ${eventDate.toLocaleTimeString()}
Where: ${eventLocation}

${reminderType === 'event_reminder_24h' ? `
Don't forget to:
- Bring a photo ID for check-in
- Arrive 15-30 minutes early
- Check the weather and dress accordingly
- Parking information is available on our website
` : ''}

View event details: ${process.env.NEXT_PUBLIC_APP_URL}/portal/events

Looking forward to seeing you there!

Questions? Contact us at events@ccoscharityguild.org

CCOS Charity Guild
    `;

    return { subject, htmlContent, textContent };
  }

  private async generateWaitlistNotificationContent(
    event: any,
    member: any,
    registration: any
  ): Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
  }> {
    const memberName = member.first_name || 'Valued Member';
    const eventName = event.name || event.title;

    const subject = `Waitlisted: ${eventName}`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #f59e0b; margin-bottom: 10px;">You're on the Waitlist</h1>
          <p style="font-size: 18px; color: #666;">We'll notify you if a spot opens for ${eventName}</p>
        </div>

        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #92400e; margin-bottom: 15px;">What happens next?</h2>
          <ul style="color: #78350f; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>We'll contact you immediately if a spot becomes available</li>
            <li>You'll have 24 hours to confirm your attendance</li>
            <li>Your waitlist position is secured based on registration time</li>
          </ul>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal/events" 
             style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Waitlist Status
          </a>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>Thank you for your interest in ${eventName}!</p>
          <p>Questions? Contact us at events@ccoscharityguild.org</p>
        </div>
      </div>
    `;

    const textContent = `
You're on the Waitlist: ${eventName}

Dear ${memberName},

Thank you for your interest in ${eventName}. The event is currently full, but we've added you to our waitlist.

What happens next?
- We'll contact you immediately if a spot becomes available
- You'll have 24 hours to confirm your attendance  
- Your waitlist position is secured based on registration time

View your waitlist status: ${process.env.NEXT_PUBLIC_APP_URL}/portal/events

Thank you for your interest in ${eventName}!

Questions? Contact us at events@ccoscharityguild.org

CCOS Charity Guild
    `;

    return { subject, htmlContent, textContent };
  }

  private async generateCheckInNotificationContent(
    event: any,
    member: any,
    registration: any
  ): Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
  }> {
    const memberName = member.first_name || 'Valued Member';
    const eventName = event.name || event.title;

    const subject = `Welcome to ${eventName}!`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #059669; margin-bottom: 10px;">Welcome!</h1>
          <p style="font-size: 18px; color: #666;">Thanks for checking in to ${eventName}</p>
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h2 style="color: #065f46; margin-bottom: 15px;">Event Resources</h2>
          <ul style="color: #047857; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>Event materials are available at the registration desk</li>
            <li>Wi-Fi: CCOS-Events, Password: Welcome2025</li>
            <li>Restrooms are located near the main entrance</li>
            <li>Emergency exits are clearly marked</li>
          </ul>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>Enjoy the event!</p>
          <p>Questions? Find a CCOS staff member</p>
        </div>
      </div>
    `;

    const textContent = `
Welcome to ${eventName}!

Dear ${memberName},

Thanks for checking in to ${eventName}.

Event Resources:
- Event materials are available at the registration desk
- Wi-Fi: CCOS-Events, Password: Welcome2025  
- Restrooms are located near the main entrance
- Emergency exits are clearly marked

Enjoy the event!

Questions? Find a CCOS staff member

CCOS Charity Guild
    `;

    return { subject, htmlContent, textContent };
  }

  private async generatePostEventSurveyContent(
    event: any,
    member: any,
    registration: any
  ): Promise<{
    subject: string;
    htmlContent: string;
    textContent: string;
  }> {
    const memberName = member.first_name || 'Valued Member';
    const eventName = event.name || event.title;
    const surveyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/survey/event/${event.id}?member=${member.id}`;

    const subject = `How was ${eventName}? Share your feedback`;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin-bottom: 10px;">How was ${eventName}?</h1>
          <p style="font-size: 18px; color: #666;">Your feedback helps us improve</p>
        </div>

        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <p style="color: #0369a1; line-height: 1.6; margin: 0;">
            Thank you for attending ${eventName}! We hope you found it valuable and engaging. 
            Your feedback is important to us and helps us plan better events in the future.
          </p>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <a href="${surveyUrl}" 
             style="background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-size: 16px;">
            Take the Survey (2 minutes)
          </a>
        </div>

        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
          <h3 style="color: #065f46; margin-bottom: 15px;">What to Expect</h3>
          <ul style="color: #047857; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li>5 quick questions about your experience</li>
            <li>Optional space for additional comments</li>
            <li>Completely anonymous responses</li>
            <li>Takes less than 2 minutes to complete</li>
          </ul>
        </div>

        <div style="text-align: center; color: #666; font-size: 14px;">
          <p>Thank you for being part of our community!</p>
          <p>Questions? Contact us at events@ccoscharityguild.org</p>
        </div>
      </div>
    `;

    const textContent = `
How was ${eventName}? Share your feedback

Dear ${memberName},

Thank you for attending ${eventName}! We hope you found it valuable and engaging.

Your feedback is important to us and helps us plan better events in the future.

Take the survey: ${surveyUrl}

What to expect:
- 5 quick questions about your experience
- Optional space for additional comments  
- Completely anonymous responses
- Takes less than 2 minutes to complete

Thank you for being part of our community!

Questions? Contact us at events@ccoscharityguild.org

CCOS Charity Guild
    `;

    return { subject, htmlContent, textContent };
  }

  private async checkAndSendCapacityAlerts(
    event: any,
    registration: any,
    config: EventAutomationConfig
  ): Promise<void> {
    if (!config.capacityThresholds) return;

    const currentRegistrations = event.current_registrations || 0;
    const maxCapacity = event.max_capacity || 100;
    const capacityPercentage = (currentRegistrations / maxCapacity) * 100;

    for (const threshold of config.capacityThresholds) {
      if (capacityPercentage >= threshold && !event[`alert_${threshold}_sent`]) {
        await this.sendCapacityAlert(event, threshold, capacityPercentage);
        // In production, mark this threshold as alerted
        console.log(`Capacity alert sent for ${threshold}% threshold`);
      }
    }
  }

  private async sendCapacityAlert(event: any, threshold: number, currentPercentage: number): Promise<void> {
    const alertContent = {
      subject: `Capacity Alert: ${event.name} is ${threshold}% full`,
      htmlContent: `Event ${event.name} has reached ${threshold}% capacity (${currentPercentage.toFixed(1)}%)`,
    };

    // Send to event staff/administrators
    await this.sendEmail('capacity_alert', 'events@ccoscharityguild.org', alertContent);
  }

  private async generateCalendarInvite(event: any): Promise<string> {
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date || event.start_date);
    
    // Add 2 hours to end date if not specified
    if (!event.end_date) {
      endDate.setHours(endDate.getHours() + 2);
    }

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CCOS Charity Guild//Event Calendar//EN
BEGIN:VEVENT
UID:${event.id}@ccoscharityguild.org
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${event.name || event.title}
DESCRIPTION:${event.description || ''}
LOCATION:${event.location || ''}
ORGANIZER:CN=CCOS Charity Guild:MAILTO:events@ccoscharityguild.org
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
  }

  private async notifyEventStaff(
    event: any,
    member: any,
    registration: any,
    notificationType: string
  ): Promise<void> {
    const staffEmail = 'events@ccoscharityguild.org';
    const memberName = `${member.first_name} ${member.last_name}`;
    
    const notifications: Record<string, any> = {
      'new_registration': {
        subject: `New Registration: ${event.name}`,
        content: `${memberName} has registered for ${event.name}. Current registrations: ${event.current_registrations + 1}/${event.max_capacity}`,
      },
      'check_in': {
        subject: `Check-In: ${event.name}`,
        content: `${memberName} has checked in to ${event.name}.`,
      },
    };

    const notification = notifications[notificationType];
    if (notification) {
      await this.sendEmail('staff_notification', staffEmail, {
        subject: notification.subject,
        htmlContent: notification.content,
        textContent: notification.content,
      });
    }
  }

  private async createEventStaffTasks(event: any, registration: any, taskType: string): Promise<void> {
    const tasks: Record<string, string> = {
      'registration': `Follow up with new registration for ${event.name}`,
      'capacity_alert': `Review capacity management for ${event.name}`,
      'post_event': `Process post-event activities for ${event.name}`,
    };

    const taskDescription = tasks[taskType];
    if (taskDescription) {
      console.log(`Creating staff task: ${taskDescription}`);
      // In production, this would create actual task records in the database
    }
  }

  private async updateRegistrationStatus(registrationId: string, status: string): Promise<void> {
    console.log(`Updating registration ${registrationId} status to ${status}`);
    // In production, this would update the registration record in the database
  }

  private async sendEmail(type: string, recipient: string, content: any): Promise<void> {
    console.log(`Sending ${type} email to ${recipient}:`, content.subject);
    // In production, this would integrate with your email service
    return Promise.resolve();
  }

  // Get event automation progress for an event
  async getEventAutomationProgress(eventId: string): Promise<{
    event: any;
    registrations: any[];
    automationStats: {
      confirmations_sent: number;
      reminders_scheduled: number;
      check_ins_processed: number;
      surveys_sent: number;
      total_participants: number;
    };
    upcomingTasks: Array<{ type: string; scheduledFor: Date; count: number }>;
  }> {
    try {
      // In production, this would fetch real data from the database
      const mockData = {
        event: {
          id: eventId,
          name: 'Annual Charity Gala',
          start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Grand Ballroom, Downtown Hotel',
          max_capacity: 200,
          current_registrations: 156,
        },
        registrations: [],
        automationStats: {
          confirmations_sent: 156,
          reminders_scheduled: 468, // 156 * 3 reminders each
          check_ins_processed: 0,
          surveys_sent: 0,
          total_participants: 156,
        },
        upcomingTasks: [
          { type: 'event_reminder_168h', scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000), count: 156 },
          { type: 'event_reminder_24h', scheduledFor: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), count: 156 },
          { type: 'event_reminder_1h', scheduledFor: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000), count: 156 },
        ],
      };

      return mockData;
    } catch (error) {
      console.error('Error getting event automation progress:', error);
      throw error;
    }
  }
}

export const eventManagementWorkflow = new EventManagementWorkflow();