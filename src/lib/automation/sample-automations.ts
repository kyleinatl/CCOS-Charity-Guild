/**
 * Sample automation data for development and testing
 * These can be used to populate the database with realistic automation examples
 */

export const SAMPLE_AUTOMATIONS = [
  {
    name: 'Welcome New Members',
    description: 'Send a series of welcome emails to new members over their first week',
    trigger_type: 'member_onboarding',
    trigger_conditions: {},
    actions: [
      {
        type: 'send_email',
        template: 'welcome_immediate',
        delay: 0,
        subject: 'Welcome to CCOS Charity Guild!',
        personalized: true
      },
      {
        type: 'send_email',
        template: 'welcome_day_3',
        delay: '3 days',
        subject: 'Getting started with your membership',
        personalized: true
      },
      {
        type: 'send_email',
        template: 'welcome_week_1',
        delay: '7 days',
        subject: 'Your first week with us',
        personalized: true
      }
    ],
    status: 'active'
  },
  {
    name: 'Donation Thank You',
    description: 'Send personalized thank you emails and receipts for donations',
    trigger_type: 'donation_acknowledgment',
    trigger_conditions: {},
    actions: [
      {
        type: 'send_email',
        template: 'donation_receipt',
        delay: 0,
        subject: 'Thank you for your generous donation',
        include_tax_info: true,
        personalized: true
      },
      {
        type: 'send_email',
        template: 'donation_impact',
        delay: '2 days',
        subject: 'The impact of your donation',
        show_impact_metrics: true
      }
    ],
    status: 'active'
  },
  {
    name: 'Tier Upgrade Celebration',
    description: 'Celebrate member tier upgrades with special recognition',
    trigger_type: 'tier_upgrade',
    trigger_conditions: {},
    actions: [
      {
        type: 'send_email',
        template: 'tier_upgrade_congratulations',
        delay: 0,
        subject: 'Congratulations on your tier upgrade!',
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
      }
    ],
    status: 'active'
  },
  {
    name: 'Event Registration Confirmation',
    description: 'Send confirmation emails for event registrations',
    trigger_type: 'event_reminder',
    trigger_conditions: {
      reminder_type: 'registration_confirmation'
    },
    actions: [
      {
        type: 'send_email',
        template: 'event_registration_confirmed',
        delay: 0,
        subject: 'Your event registration is confirmed',
        include_calendar_invite: true,
        include_preparation_info: true
      },
      {
        type: 'create_reminder',
        type_reminder: 'event_24h_reminder',
        schedule: '24 hours before event'
      }
    ],
    status: 'active'
  },
  {
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
        subject: 'Event reminder - happening soon!',
        include_logistics: true,
        include_agenda: true
      },
      {
        type: 'send_sms',
        template: 'event_reminder_sms',
        delay: '15 minutes',
        condition: 'sms_subscribed'
      }
    ],
    status: 'active'
  },
  {
    name: 'Weekly Newsletter Automation',
    description: 'Automated weekly newsletter generation and distribution',
    trigger_type: 'weekly_newsletter',
    trigger_conditions: {},
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
      }
    ],
    status: 'active',
    next_run: '2025-09-22T09:00:00Z'
  },
  {
    name: 'Daily Operations Report',
    description: 'Generate and send daily summary reports to administrators',
    trigger_type: 'daily_report',
    trigger_conditions: {},
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
      }
    ],
    status: 'active',
    next_run: '2025-09-16T08:00:00Z'
  },
  {
    name: 'Member Re-engagement Campaign',
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
        subject: 'We miss you! Here\'s what you\'ve been missing',
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
    status: 'paused'
  },
  {
    name: 'Monthly Tier Review',
    description: 'Review and update member tiers based on donation history',
    trigger_type: 'monthly_tier_review',
    trigger_conditions: {},
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
    status: 'active',
    next_run: '2025-10-01T10:00:00Z'
  },
  {
    name: 'Recurring Donation Failed',
    description: 'Handle failed recurring donation payments',
    trigger_type: 'recurring_donation_failed',
    trigger_conditions: {},
    actions: [
      {
        type: 'send_email',
        template: 'payment_failed_notification',
        delay: 0,
        subject: 'Action needed: Update your payment method',
        include_update_link: true
      },
      {
        type: 'create_task',
        assignee: 'donor_relations',
        task: 'Follow up on failed recurring donation',
        priority: 'high',
        delay: '24 hours'
      },
      {
        type: 'send_email',
        template: 'payment_failed_reminder',
        delay: '3 days',
        subject: 'Reminder: Please update your payment method',
        condition: 'still_failed'
      }
    ],
    status: 'active'
  }
];

/**
 * Function to seed the database with sample automations
 * This should only be used in development/demo environments
 */
export async function seedSampleAutomations() {
  try {
    console.log('Seeding sample automations...');
    
    for (const automation of SAMPLE_AUTOMATIONS) {
      const response = await fetch('/api/automation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(automation),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Created automation: ${automation.name} (${data.automation.id})`);
      } else {
        console.error(`Failed to create automation: ${automation.name}`);
      }
    }

    console.log('Sample automations seeded successfully!');
  } catch (error) {
    console.error('Error seeding sample automations:', error);
  }
}

/**
 * Function to create sample automation logs for testing
 */
export async function createSampleAutomationLogs(automationId: string, count: number = 10) {
  const sampleLogs = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 30);
    const success = Math.random() > 0.1; // 90% success rate
    
    sampleLogs.push({
      automation_id: automationId,
      member_id: null, // Would be actual member IDs in real scenario
      trigger_data: {
        sample_execution: true,
        execution_number: i + 1
      },
      success,
      error_message: success ? null : 'Sample error message',
      created_at: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  return sampleLogs;
}