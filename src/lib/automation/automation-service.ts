import { createClient } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/database.types';
import { Member, Automation, AutomationLog, Donation, Event, Communication } from '@/types';
import { dataService } from '@/lib/data/data-service';
import { MemberOnboardingWorkflow } from './workflows/member-onboarding';
import { DonationAcknowledgmentWorkflow } from './workflows/donation-acknowledgment';
import { EventManagementWorkflow } from './workflows/event-management';
import { CommunicationWorkflowEngine } from './workflows/communication-workflow';

type SupabaseClient = ReturnType<typeof createClient>;

/**
 * Core Automation Service - Man      // Grou      // Group by automation type for overview
      const byAutomation: any = {};
      for (const log of logs as any[]) {
        const key = log.automation_id;
        if (!byAutomation[key]) {
          byAutomation[key] = { total: 0, successful: 0, failed: 0 };
        }
        byAutomation[key].total++;
        if (log.success) {
          byAutomation[key].successful++;
        } else {
          byAutomation[key].failed++;
        }
      }n
      const byAutomation = logs.reduce((acc: any, log: any) => {
        const key = log.automation_id;
        if (!acc[key]) {
          acc[key] = { total: 0, successful: 0, failed: 0 };
        }
        acc[key].total++;
        if (log.success) {
          acc[key].successful++;
        } else {
          acc[key].failed++;
        }
        return acc;
      }, {} as any);ated workflows and triggers
 * Handles n8n integration, workflow execution, and automation logging
 */
export class AutomationService {
  private supabase = createClient();
  private n8nBaseUrl = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678';
  private n8nApiKey = process.env.N8N_API_KEY || '';
  
  // Workflow instances
  private memberOnboarding: MemberOnboardingWorkflow;
  private donationAcknowledgment: DonationAcknowledgmentWorkflow;
  private eventManagement: EventManagementWorkflow;
  private communicationEngine: CommunicationWorkflowEngine;

  constructor() {
    // Initialize workflow instances
    this.memberOnboarding = new MemberOnboardingWorkflow();
    this.donationAcknowledgment = new DonationAcknowledgmentWorkflow();
    this.eventManagement = new EventManagementWorkflow();
    this.communicationEngine = new CommunicationWorkflowEngine();
  }

  // ============================
  // WORKFLOW TRIGGER METHODS
  // ============================

  /**
   * Trigger member onboarding workflow
   * Called when a new member registers
   */
  async triggerMemberOnboarding(member: Member): Promise<void> {
    try {
      const automation = await this.getAutomationByType('member_onboarding');
      if (!automation || automation.status !== 'active') {
        console.log('Member onboarding automation not active or not found');
        return;
      }

      const triggerData = {
        member_id: member.id,
        member_email: member.email,
        member_name: `${member.first_name} ${member.last_name}`,
        member_tier: member.tier,
        registration_date: member.created_at,
        trigger_type: 'member_onboarding'
      };

      // Execute local onboarding workflow first (immediate processing)
      await this.memberOnboarding.executeOnboarding(member);

      // Send to n8n workflow for any additional external integrations
      if (this.n8nBaseUrl) {
        await this.executeN8nWorkflow('member-onboarding', triggerData);
      }

      // Log the automation execution
      await this.logAutomationExecution(automation.id, member.id, triggerData, true);

      console.log(`Member onboarding workflow triggered for: ${member.first_name} ${member.last_name}`);
    } catch (error) {
      console.error('Error triggering member onboarding:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const automation = await this.getAutomationByType('member_onboarding');
      await this.logAutomationExecution(automation?.id || 'member_onboarding', member.id, { error: errorMessage }, false, errorMessage);
    }
  }

  /**
   * Trigger donation acknowledgment workflow
   * Called when a payment is successful
   */
  async triggerDonationAcknowledgment(donation: Donation, member: Member): Promise<void> {
    try {
      const automation = await this.getAutomationByType('donation_acknowledgment');
      if (!automation || automation.status !== 'active') {
        console.log('Donation acknowledgment automation not active or not found');
        return;
      }

      const triggerData = {
        donation_id: donation.id,
        member_id: member.id,
        member_email: member.email,
        member_name: `${member.first_name} ${member.last_name}`,
        member_tier: member.tier,
        donation_amount: donation.amount,
        donation_designation: donation.designation,
        is_recurring: donation.is_recurring,
        donation_date: donation.created_at,
        trigger_type: 'donation_acknowledgment'
      };

      // Execute comprehensive donation acknowledgment workflow
      const workflowResult = await this.donationAcknowledgment.executeDonationAcknowledgment(donation, member);
      
      // Send to n8n workflow for any additional external integrations
      if (this.n8nBaseUrl) {
        await this.executeN8nWorkflow('donation-acknowledgment', triggerData);
      }

      // Log the automation execution with detailed results
      await this.logAutomationExecution(
        automation.id, 
        member.id, 
        {
          ...triggerData,
          workflow_result: workflowResult,
          actions_executed: workflowResult.actionsExecuted,
          scheduled_tasks: workflowResult.scheduledTasks.length
        }, 
        workflowResult.success,
        workflowResult.errors.length > 0 ? workflowResult.errors.join('; ') : undefined
      );

      console.log(`Donation acknowledgment workflow completed for: ${member.first_name} ${member.last_name} - $${donation.amount}`);
      console.log(`Actions executed: ${workflowResult.actionsExecuted.join(', ')}`);
      console.log(`Scheduled tasks: ${workflowResult.scheduledTasks.length}`);
      
      if (workflowResult.errors.length > 0) {
        console.warn('Workflow completed with errors:', workflowResult.errors);
      }
      
    } catch (error) {
      console.error('Error triggering donation acknowledgment:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const automation = await this.getAutomationByType('donation_acknowledgment');
      await this.logAutomationExecution(automation?.id || 'donation_acknowledgment', member.id, { error: errorMessage }, false, errorMessage);
    }
  }

  /**
   * Trigger tier upgrade workflow
   * Called when member's tier changes
   */
  async triggerTierUpgrade(member: Member, oldTier: string, newTier: string): Promise<void> {
    try {
      const automation = await this.getAutomationByType('tier_upgrade');
      if (!automation || automation.status !== 'active') return;

      const triggerData = {
        member_id: member.id,
        member_email: member.email,
        member_name: `${member.first_name} ${member.last_name}`,
        old_tier: oldTier,
        new_tier: newTier,
        total_donated: member.total_donated,
        upgrade_date: new Date().toISOString(),
        trigger_type: 'tier_upgrade'
      };

      // Send to n8n workflow
      await this.executeN8nWorkflow('tier-upgrade', triggerData);

      // Log the automation execution
      await this.logAutomationExecution(automation.id, member.id, triggerData, true);

      console.log(`Tier upgrade workflow triggered for: ${member.first_name} ${member.last_name} - ${oldTier} → ${newTier}`);
    } catch (error) {
      console.error('Error triggering tier upgrade:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.logAutomationExecution('tier_upgrade', member.id, { error: errorMessage }, false, errorMessage);
    }
  }

  /**
   * Trigger event registration confirmation workflow
   * Called when a member registers for an event
   */
  async triggerEventRegistrationConfirmation(event: Event, member: Member, registration: any): Promise<void> {
    try {
      const automation = await this.getAutomationByType('event_registration');
      if (!automation || automation.status !== 'active') {
        console.log('Event registration automation not active or not found');
        return;
      }

      const triggerData = {
        event_id: event.id,
        member_id: member.id,
        registration_id: registration.id,
        member_email: member.email,
        member_name: `${member.first_name} ${member.last_name}`,
        event_title: event.name,
        event_date: event.start_date,
        event_location: event.venue_name || 'Location TBD',
        registration_status: registration.status,
        amount_paid: registration.amount_paid || 0,
        trigger_type: 'event_registration'
      };

      // Execute comprehensive registration confirmation workflow
      const workflowResult = await this.eventManagement.executeRegistrationConfirmation(
        event, member, registration
      );

      // Send to n8n workflow for external integrations
      if (this.n8nBaseUrl) {
        await this.executeN8nWorkflow('event-registration', triggerData);
      }

      // Log the automation execution with detailed results
      await this.logAutomationExecution(
        automation.id,
        member.id,
        {
          ...triggerData,
          workflow_result: workflowResult,
          actions_executed: workflowResult.actionsExecuted,
          scheduled_tasks: workflowResult.scheduledTasks.length
        },
        workflowResult.success,
        workflowResult.errors.length > 0 ? workflowResult.errors.join('; ') : undefined
      );

      console.log(`Event registration workflow completed for: ${member.first_name} ${member.last_name} - ${event.name}`);
      console.log(`Actions executed: ${workflowResult.actionsExecuted.join(', ')}`);
      console.log(`Scheduled tasks: ${workflowResult.scheduledTasks.length}`);

      if (workflowResult.errors.length > 0) {
        console.warn('Workflow completed with errors:', workflowResult.errors);
      }

    } catch (error) {
      console.error('Error triggering event registration:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const automation = await this.getAutomationByType('event_registration');
      await this.logAutomationExecution(automation?.id || 'event_registration', member.id, { error: errorMessage }, false, errorMessage);
    }
  }

  /**
   * Trigger event reminder workflow
   * Called for scheduled event reminders
   */
  async triggerEventReminder(event: Event, member: Member, registration: any, reminderType: string): Promise<void> {
    try {
      const automation = await this.getAutomationByType('event_reminder');
      if (!automation || automation.status !== 'active') {
        console.log('Event reminder automation not active or not found');
        return;
      }

      const triggerData = {
        event_id: event.id,
        member_id: member.id,
        registration_id: registration.id,
        member_email: member.email,
        member_name: `${member.first_name} ${member.last_name}`,
        event_title: event.name,
        event_date: event.start_date,
        event_location: event.venue_name || 'Location TBD',
        reminder_type: reminderType,
        trigger_type: 'event_reminder'
      };

      // Execute event reminder workflow
      const workflowResult = await this.eventManagement.executeEventReminder(
        event, member, registration, reminderType
      );

      // Send to n8n workflow for external integrations
      if (this.n8nBaseUrl) {
        await this.executeN8nWorkflow('event-reminder', triggerData);
      }

      // Log the automation execution
      await this.logAutomationExecution(
        automation.id,
        member.id,
        {
          ...triggerData,
          workflow_result: workflowResult,
          actions_executed: workflowResult.actionsExecuted
        },
        workflowResult.success,
        workflowResult.errors.length > 0 ? workflowResult.errors.join('; ') : undefined
      );

      console.log(`Event reminder (${reminderType}) sent to: ${member.first_name} ${member.last_name} - ${event.name}`);

    } catch (error) {
      console.error('Error triggering event reminder:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const automation = await this.getAutomationByType('event_reminder');
      await this.logAutomationExecution(automation?.id || 'event_reminder', member.id, { error: errorMessage }, false, errorMessage);
    }
  }

  /**
   * Trigger event check-in workflow
   * Called when a member checks in to an event
   */
  async triggerEventCheckIn(event: Event, member: Member, registration: any): Promise<void> {
    try {
      const automation = await this.getAutomationByType('event_check_in');
      if (!automation || automation.status !== 'active') {
        console.log('Event check-in automation not active or not found');
        return;
      }

      const triggerData = {
        event_id: event.id,
        member_id: member.id,
        registration_id: registration.id,
        member_email: member.email,
        member_name: `${member.first_name} ${member.last_name}`,
        event_title: event.name,
        check_in_time: new Date().toISOString(),
        trigger_type: 'event_check_in'
      };

      // Execute check-in notification workflow
      const workflowResult = await this.eventManagement.executeCheckInNotification(
        event, member, registration
      );

      // Send to n8n workflow for external integrations
      if (this.n8nBaseUrl) {
        await this.executeN8nWorkflow('event-check-in', triggerData);
      }

      // Log the automation execution
      await this.logAutomationExecution(
        automation.id,
        member.id,
        {
          ...triggerData,
          workflow_result: workflowResult,
          actions_executed: workflowResult.actionsExecuted
        },
        workflowResult.success,
        workflowResult.errors.length > 0 ? workflowResult.errors.join('; ') : undefined
      );

      console.log(`Event check-in processed for: ${member.first_name} ${member.last_name} - ${event.name}`);

    } catch (error) {
      console.error('Error triggering event check-in:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const automation = await this.getAutomationByType('event_check_in');
      await this.logAutomationExecution(automation?.id || 'event_check_in', member.id, { error: errorMessage }, false, errorMessage);
    }
  }

  /**
   * Trigger post-event survey workflow
   * Called after an event concludes
   */
  async triggerPostEventSurvey(event: Event, member: Member, registration: any): Promise<void> {
    try {
      const automation = await this.getAutomationByType('post_event_survey');
      if (!automation || automation.status !== 'active') {
        console.log('Post-event survey automation not active or not found');
        return;
      }

      const triggerData = {
        event_id: event.id,
        member_id: member.id,
        registration_id: registration.id,
        member_email: member.email,
        member_name: `${member.first_name} ${member.last_name}`,
        event_title: event.name,
        event_date: event.start_date,
        attendance_status: registration.attendance_status || 'attended',
        trigger_type: 'post_event_survey'
      };

      // Execute post-event survey workflow
      const workflowResult = await this.eventManagement.executePostEventSurvey(
        event, member, registration
      );

      // Send to n8n workflow for external integrations
      if (this.n8nBaseUrl) {
        await this.executeN8nWorkflow('post-event-survey', triggerData);
      }

      // Log the automation execution
      await this.logAutomationExecution(
        automation.id,
        member.id,
        {
          ...triggerData,
          workflow_result: workflowResult,
          actions_executed: workflowResult.actionsExecuted
        },
        workflowResult.success,
        workflowResult.errors.length > 0 ? workflowResult.errors.join('; ') : undefined
      );

      console.log(`Post-event survey sent to: ${member.first_name} ${member.last_name} - ${event.name}`);

    } catch (error) {
      console.error('Error triggering post-event survey:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const automation = await this.getAutomationByType('post_event_survey');
      await this.logAutomationExecution(automation?.id || 'post_event_survey', member.id, { error: errorMessage }, false, errorMessage);
    }
  }

  /**
   * Trigger communication workflow
   * Called for automated communication sequences
   */
  async triggerCommunicationWorkflow(member: Member, workflowType: string, context?: any): Promise<void> {
    try {
      const automation = await this.getAutomationByType(workflowType);
      if (!automation || automation.status !== 'active') return;

      const triggerData = {
        member_id: member.id,
        member_email: member.email,
        member_name: `${member.first_name} ${member.last_name}`,
        member_tier: member.tier,
        workflow_type: workflowType,
        context: context || {},
        trigger_type: 'communication_workflow'
      };

      // Send to n8n workflow
      await this.executeN8nWorkflow('communication-workflow', triggerData);

      // Log the automation execution
      await this.logAutomationExecution(automation.id, member.id, triggerData, true);

      console.log(`Communication workflow triggered for: ${member.first_name} ${member.last_name} - ${workflowType}`);
    } catch (error) {
      console.error('Error triggering communication workflow:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.logAutomationExecution(workflowType, member.id, { error: errorMessage }, false, errorMessage);
    }
  }

  // ============================
  // N8N INTEGRATION METHODS
  // ============================

  /**
   * Execute n8n workflow via webhook
   */
  private async executeN8nWorkflow(workflowName: string, data: any): Promise<void> {
    if (!this.n8nBaseUrl) {
      console.warn('n8n webhook URL not configured - skipping workflow execution');
      return;
    }

    try {
      const response = await fetch(`${this.n8nBaseUrl}/webhook/${workflowName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.n8nApiKey && { 'Authorization': `Bearer ${this.n8nApiKey}` })
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`n8n workflow failed: ${response.status} ${response.statusText}`);
      }

      console.log(`n8n workflow executed successfully: ${workflowName}`);
    } catch (error) {
      console.error(`Error executing n8n workflow ${workflowName}:`, error);
      throw error;
    }
  }

  /**
   * Get workflow status from n8n
   */
  async getWorkflowStatus(workflowId: string): Promise<any> {
    if (!this.n8nBaseUrl || !this.n8nApiKey) {
      return null;
    }

    try {
      const response = await fetch(`${this.n8nBaseUrl}/api/v1/workflows/${workflowId}`, {
        headers: {
          'Authorization': `Bearer ${this.n8nApiKey}`
        }
      });

      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Error fetching workflow status:', error);
    }

    return null;
  }

  // ============================
  // DATABASE METHODS
  // ============================

  /**
   * Get automation configuration by type
   */
  private async getAutomationByType(triggerType: string): Promise<Automation | null> {
    try {
      const { data, error } = await this.supabase
        .from('automations')
        .select('*')
        .eq('trigger_type', triggerType)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching automation:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAutomationByType:', error);
      return null;
    }
  }

  /**
   * Log automation execution
   */
  private async logAutomationExecution(
    automationId: string,
    memberId: string | null,
    triggerData: any,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    try {
      const logEntry = {
        automation_id: automationId,
        member_id: memberId,
        trigger_data: triggerData,
        success,
        error_message: errorMessage || null
      };

      const { error } = await (this.supabase as any)
        .from('automation_logs')
        .insert(logEntry);

      if (error) {
        console.error('Database error logging automation execution:', error);
      }
    } catch (error) {
      console.error('Error logging automation execution:', error);
    }
  }

  /**
   * Get automation statistics
   */
  async getAutomationStats(automationId?: string): Promise<any> {
    try {
      let query = this.supabase
        .from('automation_logs')
        .select('*');

      if (automationId) {
        query = query.eq('automation_id', automationId);
      }

      const { data: logs, error } = await query
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) {
        throw error;
      }

      if (!logs) {
        return { total: 0, successful: 0, failed: 0, byAutomation: {} };
      }

      // Calculate statistics
      const total = logs.length;
      const successful = logs.filter((log: any) => log.success).length;
      const failed = total - successful;
      const successRate = total > 0 ? (successful / total) * 100 : 0;

      // Group by automation type for overview
      const byAutomation: any = {};
      for (const log of logs as any[]) {
        const key = log.automation_id;
        if (!byAutomation[key]) {
          byAutomation[key] = { total: 0, successful: 0, failed: 0 };
        }
        byAutomation[key].total++;
        if (log.success) {
          byAutomation[key].successful++;
        } else {
          byAutomation[key].failed++;
        }
      }

      return {
        total,
        successful,
        failed,
        successRate: Math.round(successRate * 100) / 100,
        byAutomation,
        recentLogs: logs.slice(0, 10) as any[]
      };
    } catch (error) {
      console.error('Error getting automation stats:', error);
      return {
        total: 0,
        successful: 0,
        failed: 0,
        successRate: 0,
        byAutomation: {},
        recentLogs: []
      };
    }
  }

  // ============================
  // SCHEDULED WORKFLOW METHODS
  // ============================

  /**
   * Process scheduled workflows
   * Called by cron job or scheduled task
   */
  async processScheduledWorkflows(): Promise<void> {
    try {
      const now = new Date().toISOString();
      
      // Get automations that should run now
      const { data: automations, error } = await this.supabase
        .from('automations')
        .select('*')
        .eq('status', 'active')
        .lte('next_run', now);

      if (error) {
        console.error('Error fetching scheduled automations:', error);
        return;
      }

      for (const automation of automations || []) {
        await this.executeScheduledAutomation(automation);
      }
    } catch (error) {
      console.error('Error processing scheduled workflows:', error);
    }
  }

  /**
   * Execute a scheduled automation
   */
  private async executeScheduledAutomation(automation: Automation): Promise<void> {
    try {
      console.log(`Executing scheduled automation: ${automation.name}`);

      // Update run count and last run time
      await (this.supabase as any)
        .from('automations')
        .update({
          last_run: new Date().toISOString(),
          run_count: automation.run_count + 1
        })
        .eq('id', automation.id);

      // Execute the workflow logic based on type
      switch (automation.trigger_type) {
        case 'daily_report':
          await this.executeDailyReport();
          break;
        case 'weekly_newsletter':
          await this.executeWeeklyNewsletter();
          break;
        case 'monthly_tier_review':
          await this.executeMonthlyTierReview();
          break;
        default:
          console.warn(`Unknown scheduled automation type: ${automation.trigger_type}`);
      }

      console.log(`Scheduled automation completed: ${automation.name}`);
    } catch (error) {
      console.error(`Error executing scheduled automation ${automation.name}:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.logAutomationExecution(automation.id, null, { error: errorMessage }, false, errorMessage);
    }
  }

  /**
   * Execute daily report automation
   */
  private async executeDailyReport(): Promise<void> {
    // Get daily statistics and send to administrators
    const triggerData = {
      report_type: 'daily',
      generated_at: new Date().toISOString(),
      trigger_type: 'daily_report'
    };

    await this.executeN8nWorkflow('daily-report', triggerData);
  }

  /**
   * Execute weekly newsletter automation
   */
  private async executeWeeklyNewsletter(): Promise<void> {
    // Get newsletter subscribers and send weekly updates
    const triggerData = {
      newsletter_type: 'weekly',
      generated_at: new Date().toISOString(),
      trigger_type: 'weekly_newsletter'
    };

    await this.executeN8nWorkflow('weekly-newsletter', triggerData);
  }

  /**
   * Execute monthly tier review automation
   */
  private async executeMonthlyTierReview(): Promise<void> {
    // Review member tiers and send updates
    const triggerData = {
      review_type: 'monthly_tier',
      generated_at: new Date().toISOString(),
      trigger_type: 'monthly_tier_review'
    };

    await this.executeN8nWorkflow('monthly-tier-review', triggerData);
  }

  /**
   * Trigger newsletter automation workflow
   */
  async triggerNewsletterAutomation(
    newsletterData: any,
    segmentationRules?: any[]
  ): Promise<void> {
    try {
      const automation = await this.getAutomationByType('newsletter_automation');
      if (!automation || automation.status !== 'active') {
        console.log('Newsletter automation not active or not found');
        return;
      }

      const triggerData = {
        newsletter_data: newsletterData,
        segmentation_rules: segmentationRules,
        trigger_time: new Date().toISOString(),
        automation_id: automation.id
      };

      console.log('🔄 Triggering newsletter automation workflow...');
      const workflowResult = await this.communicationEngine.executeNewsletterAutomation(
        newsletterData,
        segmentationRules
      );

      // Log automation execution
      await this.logAutomationExecution(
        automation.id,
        'newsletter_automation',
        triggerData,
        workflowResult.success,
        workflowResult.errors.join(', ')
      );

      console.log('✅ Newsletter automation workflow completed successfully');

    } catch (error) {
      console.error('❌ Newsletter automation trigger failed:', error);
    }
  }

  /**
   * Trigger behavioral workflow based on member action
   */
  async triggerBehavioralWorkflow(
    member: any,
    behaviorEvent: string,
    context: any
  ): Promise<void> {
    try {
      const automation = await this.getAutomationByType('behavioral_triggers');
      if (!automation || automation.status !== 'active') {
        console.log('Behavioral triggers automation not active or not found');
        return;
      }

      const trigger = {
        event: behaviorEvent,
        conditions: context.conditions || {},
        delay: context.delay || 0,
        maxExecutions: context.maxExecutions,
        cooldownPeriod: context.cooldownPeriod
      };

      const triggerData = {
        member_id: member.id,
        behavior_event: behaviorEvent,
        context,
        trigger_time: new Date().toISOString(),
        automation_id: automation.id
      };

      console.log(`🔄 Triggering behavioral workflow for ${behaviorEvent}...`);
      const workflowResult = await this.communicationEngine.executeBehavioralTrigger(
        member,
        trigger,
        context
      );

      // Log automation execution
      await this.logAutomationExecution(
        automation.id,
        'behavioral_trigger',
        triggerData,
        workflowResult.success,
        workflowResult.errors.join(', ')
      );

      console.log('✅ Behavioral workflow completed successfully');

    } catch (error) {
      console.error('❌ Behavioral workflow trigger failed:', error);
    }
  }

  /**
   * Trigger re-engagement campaign for inactive members
   */
  async triggerReEngagementCampaign(
    inactivityThreshold: number = 90
  ): Promise<void> {
    try {
      const automation = await this.getAutomationByType('reengagement_campaign');
      if (!automation || automation.status !== 'active') {
        console.log('Re-engagement campaign automation not active or not found');
        return;
      }

      const triggerData = {
        inactivity_threshold: inactivityThreshold,
        trigger_time: new Date().toISOString(),
        automation_id: automation.id
      };

      console.log('🔄 Triggering re-engagement campaign...');
      const workflowResult = await this.communicationEngine.executeReEngagementCampaign(
        inactivityThreshold
      );

      // Log automation execution
      await this.logAutomationExecution(
        automation.id,
        'reengagement_campaign',
        triggerData,
        workflowResult.success,
        workflowResult.errors.join(', ')
      );

      console.log('✅ Re-engagement campaign completed successfully');

    } catch (error) {
      console.error('❌ Re-engagement campaign trigger failed:', error);
    }
  }

  /**
   * Trigger drip campaign for member
   */
  async triggerDripCampaign(
    member: any,
    campaignType: string,
    customData?: any
  ): Promise<void> {
    try {
      const automation = await this.getAutomationByType('drip_campaigns');
      if (!automation || automation.status !== 'active') {
        console.log('Drip campaigns automation not active or not found');
        return;
      }

      const triggerData = {
        member_id: member.id,
        campaign_type: campaignType,
        custom_data: customData,
        trigger_time: new Date().toISOString(),
        automation_id: automation.id
      };

      console.log(`🔄 Triggering drip campaign: ${campaignType}...`);
      const workflowResult = await this.communicationEngine.executeDripCampaign(
        member,
        campaignType,
        customData
      );

      // Log automation execution
      await this.logAutomationExecution(
        automation.id,
        'drip_campaign',
        triggerData,
        workflowResult.success,
        workflowResult.errors.join(', ')
      );

      console.log('✅ Drip campaign completed successfully');

    } catch (error) {
      console.error('❌ Drip campaign trigger failed:', error);
    }
  }
}

// Export singleton instance
export const automationService = new AutomationService();