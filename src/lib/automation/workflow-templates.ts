/**
 * Predefined workflow templates for common automation scenarios
 * These templates can be used to quickly set up new automations
 */

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  trigger_type: string;
  trigger_conditions?: Record<string, any>;
  actions: Array<Record<string, any>>;
  category: string;
  tags: string[];
  estimated_execution_time?: string;
  n8n_workflow_name?: string;
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  // ============================
  // MEMBER ONBOARDING WORKFLOWS
  // ============================
  {
    id: 'member_welcome_sequence',
    name: 'Member Welcome Sequence',
    description: 'Send a series of welcome emails to new members over their first week',
    trigger_type: 'member_onboarding',
    actions: [
      {
        type: 'send_email',
        template: 'welcome_immediate',
        delay: 0,
        personalized: true
      },
      {
        type: 'send_email',
        template: 'welcome_day_3',
        delay: '3 days',
        personalized: true
      },
      {
        type: 'send_email',
        template: 'welcome_week_1',
        delay: '7 days',
        personalized: true
      },
      {
        type: 'create_task',
        assignee: 'membership_coordinator',
        task: 'Follow up with new member',
        delay: '14 days'
      }
    ],
    category: 'Member Onboarding',
    tags: ['welcome', 'email', 'new_member'],
    estimated_execution_time: '2-3 weeks',
    n8n_workflow_name: 'member-onboarding'
  },
  {
    id: 'tier_introduction',
    name: 'Tier Benefits Introduction',
    description: 'Introduce new members to their tier benefits and privileges',
    trigger_type: 'member_onboarding',
    trigger_conditions: {
      tier: ['silver', 'gold', 'platinum']
    },
    actions: [
      {
        type: 'send_email',
        template: 'tier_benefits',
        delay: '1 day',
        dynamic_content: {
          tier_specific: true,
          include_perks: true
        }
      },
      {
        type: 'grant_access',
        resources: ['tier_exclusive_content'],
        delay: 0
      },
      {
        type: 'schedule_call',
        type_call: 'tier_orientation',
        delay: '3 days',
        optional: true
      }
    ],
    category: 'Member Onboarding',
    tags: ['tier', 'benefits', 'exclusive'],
    estimated_execution_time: '1 week',
    n8n_workflow_name: 'tier-introduction'
  },

  // ============================
  // DONATION ACKNOWLEDGMENT WORKFLOWS
  // ============================
  {
    id: 'donation_thank_you',
    name: 'Donation Thank You Sequence',
    description: 'Send personalized thank you messages and receipts for donations',
    trigger_type: 'donation_acknowledgment',
    actions: [
      {
        type: 'send_email',
        template: 'donation_receipt',
        delay: 0,
        include_tax_info: true,
        personalized: true
      },
      {
        type: 'send_email',
        template: 'donation_impact',
        delay: '2 days',
        show_impact_metrics: true
      },
      {
        type: 'social_media_post',
        platform: 'twitter',
        template: 'donation_gratitude',
        anonymous: true,
        delay: '1 day'
      }
    ],
    category: 'Donation Processing',
    tags: ['donation', 'thank_you', 'receipt'],
    estimated_execution_time: '3 days',
    n8n_workflow_name: 'donation-acknowledgment'
  },
  {
    id: 'tier_upgrade_celebration',
    name: 'Tier Upgrade Celebration',
    description: 'Celebrate and acknowledge member tier upgrades with special communications',
    trigger_type: 'tier_upgrade',
    actions: [
      {
        type: 'send_email',
        template: 'tier_upgrade_congratulations',
        delay: 0,
        personalized: true,
        include_new_benefits: true
      },
      {
        type: 'create_certificate',
        type_cert: 'tier_achievement',
        delay: '1 day'
      },
      {
        type: 'internal_notification',
        recipients: ['membership_team'],
        message: 'Member tier upgrade - consider personal outreach',
        delay: 0
      },
      {
        type: 'grant_access',
        resources: ['tier_exclusive_content', 'tier_exclusive_events'],
        delay: 0
      }
    ],
    category: 'Member Recognition',
    tags: ['tier_upgrade', 'celebration', 'benefits'],
    estimated_execution_time: '2 days',
    n8n_workflow_name: 'tier-upgrade'
  },

  // ============================
  // EVENT MANAGEMENT WORKFLOWS
  // ============================
  {
    id: 'event_registration_confirmation',
    name: 'Event Registration Confirmation',
    description: 'Send confirmation and preparation emails for event registrations',
    trigger_type: 'event_reminder',
    trigger_conditions: {
      reminder_type: 'registration_confirmation'
    },
    actions: [
      {
        type: 'send_email',
        template: 'event_registration_confirmed',
        delay: 0,
        include_calendar_invite: true,
        include_preparation_info: true
      },
      {
        type: 'add_to_calendar',
        calendar: 'member_events',
        delay: 0
      },
      {
        type: 'create_reminder',
        type_reminder: 'event_24h_reminder',
        schedule: '24 hours before event'
      }
    ],
    category: 'Event Management',
    tags: ['event', 'registration', 'confirmation'],
    estimated_execution_time: 'Immediate',
    n8n_workflow_name: 'event-reminder'
  },
  {
    id: 'event_reminder_sequence',
    name: 'Event Reminder Sequence',
    description: 'Send timed reminders leading up to events',
    trigger_type: 'event_reminder',
    trigger_conditions: {
      reminder_type: ['reminder_24h', 'reminder_1h']
    },
    actions: [
      {
        type: 'send_email',
        template: 'event_reminder',
        delay: 0,
        include_logistics: true,
        include_agenda: true
      },
      {
        type: 'send_sms',
        template: 'event_reminder_sms',
        delay: '15 minutes',
        condition: 'sms_subscribed'
      },
      {
        type: 'push_notification',
        template: 'event_starting_soon',
        delay: 0,
        condition: 'mobile_app_installed'
      }
    ],
    category: 'Event Management',
    tags: ['event', 'reminder', 'attendance'],
    estimated_execution_time: '1 hour',
    n8n_workflow_name: 'event-reminder'
  },

  // ============================
  // COMMUNICATION WORKFLOWS
  // ============================
  {
    id: 'newsletter_automation',
    name: 'Newsletter Automation',
    description: 'Automated newsletter generation and distribution',
    trigger_type: 'weekly_newsletter',
    actions: [
      {
        type: 'generate_content',
        sources: ['recent_donations', 'upcoming_events', 'member_spotlights'],
        delay: 0
      },
      {
        type: 'send_newsletter',
        segments: ['newsletter_subscribers'],
        personalize: true,
        delay: '2 hours'
      },
      {
        type: 'track_engagement',
        metrics: ['open_rate', 'click_rate', 'unsubscribe_rate'],
        delay: '24 hours'
      },
      {
        type: 'generate_report',
        type_report: 'newsletter_performance',
        recipients: ['communications_team'],
        delay: '7 days'
      }
    ],
    category: 'Communications',
    tags: ['newsletter', 'automation', 'engagement'],
    estimated_execution_time: '1 week',
    n8n_workflow_name: 'weekly-newsletter'
  },
  {
    id: 'engagement_follow_up',
    name: 'Member Engagement Follow-up',
    description: 'Re-engage members who haven\'t been active recently',
    trigger_type: 'member_inactivity',
    trigger_conditions: {
      last_activity_days: 60,
      engagement_score: { operator: 'less_than', value: 30 }
    },
    actions: [
      {
        type: 'send_email',
        template: 'we_miss_you',
        delay: 0,
        personalized: true,
        include_recent_highlights: true
      },
      {
        type: 'offer_incentive',
        type_incentive: 'exclusive_content_access',
        duration: '30 days',
        delay: '3 days'
      },
      {
        type: 'schedule_personal_outreach',
        assignee: 'member_relations',
        priority: 'medium',
        delay: '7 days'
      }
    ],
    category: 'Member Retention',
    tags: ['re_engagement', 'retention', 'inactive'],
    estimated_execution_time: '2 weeks',
    n8n_workflow_name: 'engagement-followup'
  },

  // ============================
  // ADMINISTRATIVE WORKFLOWS
  // ============================
  {
    id: 'daily_operations_report',
    name: 'Daily Operations Report',
    description: 'Generate and send daily summary reports to administrators',
    trigger_type: 'daily_report',
    actions: [
      {
        type: 'collect_metrics',
        sources: ['new_members', 'donations', 'events', 'communications'],
        time_period: '24 hours',
        delay: 0
      },
      {
        type: 'generate_report',
        template: 'daily_summary',
        include_charts: true,
        delay: '30 minutes'
      },
      {
        type: 'send_email',
        recipients: ['admin_team', 'board_members'],
        template: 'daily_report',
        delay: '1 hour'
      },
      {
        type: 'update_dashboard',
        widgets: ['daily_stats', 'trending_metrics'],
        delay: '15 minutes'
      }
    ],
    category: 'Administration',
    tags: ['reporting', 'daily', 'metrics'],
    estimated_execution_time: '2 hours',
    n8n_workflow_name: 'daily-report'
  },
  {
    id: 'monthly_tier_review',
    name: 'Monthly Tier Review',
    description: 'Review and update member tiers based on donation history',
    trigger_type: 'monthly_tier_review',
    actions: [
      {
        type: 'calculate_tiers',
        criteria: 'total_donations_12_months',
        delay: 0
      },
      {
        type: 'identify_upgrades',
        generate_list: true,
        delay: '1 hour'
      },
      {
        type: 'process_tier_changes',
        send_notifications: true,
        delay: '2 hours'
      },
      {
        type: 'generate_report',
        template: 'tier_changes_summary',
        recipients: ['membership_team'],
        delay: '4 hours'
      }
    ],
    category: 'Administration',
    tags: ['tier_management', 'monthly', 'review'],
    estimated_execution_time: '1 day',
    n8n_workflow_name: 'monthly-tier-review'
  }
];

/**
 * Get workflow templates by category
 */
export function getTemplatesByCategory(category: string): WorkflowTemplate[] {
  return WORKFLOW_TEMPLATES.filter(template => 
    template.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get workflow template by ID
 */
export function getTemplateById(id: string): WorkflowTemplate | undefined {
  return WORKFLOW_TEMPLATES.find(template => template.id === id);
}

/**
 * Get all available categories
 */
export function getAvailableCategories(): string[] {
  const categories = new Set(WORKFLOW_TEMPLATES.map(template => template.category));
  return Array.from(categories).sort();
}

/**
 * Search workflow templates
 */
export function searchTemplates(query: string): WorkflowTemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return WORKFLOW_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
}