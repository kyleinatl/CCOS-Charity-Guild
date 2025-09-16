# Automation & Workflow System Documentation

## Overview

The CCOS Charity Guild Automation & Workflow System provides comprehensive automated workflows for member onboarding, donation acknowledgments, event reminders, and communication management. The system is built with TypeScript, integrates with n8n for external workflows, and provides a complete management interface.

## Architecture

### Core Components

1. **AutomationService** (`/src/lib/automation/automation-service.ts`)
   - Central service for managing all automation workflows
   - Handles n8n integration and external webhook triggers
   - Manages automation logging and statistics
   - Processes scheduled workflows

2. **Workflow Implementations** (`/src/lib/automation/workflows/`)
   - Individual workflow classes for specific automation types
   - Member onboarding, donation acknowledgment, event reminders
   - Customizable configuration and templating system

3. **API Endpoints** (`/src/app/api/automation/`)
   - RESTful API for automation management
   - Trigger endpoints for manual automation execution
   - Logging and statistics endpoints

4. **Management Dashboard** (`/src/app/(dashboard)/automation/`)
   - Complete UI for managing automation workflows
   - Real-time statistics and performance monitoring
   - Manual trigger controls and configuration management

## Features

### ✅ Member Onboarding Workflows
- Automated welcome email sequences
- Tier-specific benefit introductions
- Member portal orientation guides
- Follow-up task creation for staff
- Progress tracking and analytics

### ✅ Donation Acknowledgment System
- Immediate thank you emails with receipts
- Impact communication sequences
- Tier upgrade celebrations
- Donor recognition workflows
- Tax documentation automation

### ✅ Event Management Automation
- Registration confirmation emails
- Reminder sequences (24h, 1h before events)
- Check-in notifications
- Follow-up communications
- Calendar integration

### ✅ Communication Workflows
- Newsletter automation
- Member segmentation triggers
- Re-engagement campaigns
- Personalized content delivery
- Engagement tracking

### ✅ Administrative Automation
- Daily operations reports
- Monthly tier reviews
- Scheduled maintenance tasks
- Performance monitoring
- Error handling and alerts

## Configuration

### Environment Variables

```bash
# n8n Integration
N8N_WEBHOOK_URL=your_n8n_webhook_url
N8N_API_KEY=your_n8n_api_key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=your_cron_secret_for_scheduled_workflows
```

### Automation Configuration

Automations are configured through the database with flexible JSON configurations:

```typescript
interface Automation {
  id: string;
  name: string;
  description?: string;
  trigger_type: string; // 'member_onboarding', 'donation_acknowledgment', etc.
  trigger_conditions?: Record<string, any>; // Flexible conditions
  actions: Array<Record<string, any>>; // Array of actions to execute
  status: 'active' | 'paused' | 'completed' | 'error';
  last_run?: string;
  next_run?: string;
  run_count: number;
}
```

## Usage

### Basic Automation Triggering

```typescript
import { automationService } from '@/lib/automation/automation-service';

// Trigger member onboarding
await automationService.triggerMemberOnboarding(member);

// Trigger donation acknowledgment
await automationService.triggerDonationAcknowledgment(donation, member);

// Trigger tier upgrade celebration
await automationService.triggerTierUpgrade(member, oldTier, newTier);

// Trigger event reminders
await automationService.triggerEventReminder(event, member, 'reminder_24h');
```

### Custom Workflow Implementation

```typescript
import { MemberOnboardingWorkflow } from '@/lib/automation/workflows/member-onboarding';

const onboardingWorkflow = new MemberOnboardingWorkflow();

// Execute with custom configuration
await onboardingWorkflow.executeOnboarding(member, {
  sendWelcomeEmail: true,
  welcomeEmailDelay: 0,
  sendTierIntroduction: true,
  tierIntroDelay: 60,
  personalizedContent: true
});
```

### API Integration

```typescript
// Create new automation
const response = await fetch('/api/automation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Custom Welcome Sequence',
    trigger_type: 'member_onboarding',
    actions: [
      { type: 'send_email', template: 'welcome', delay: 0 },
      { type: 'create_task', assignee: 'staff', delay: '24 hours' }
    ]
  })
});

// Manually trigger automation
await fetch(`/api/automation/${automationId}/trigger`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    trigger_data: { member_id: 'member-123' }
  })
});
```

## Workflow Templates

The system includes pre-built workflow templates for common scenarios:

### Member Onboarding Templates
- **Welcome Sequence**: Multi-step welcome emails over first week
- **Tier Introduction**: Benefit explanations and exclusive content access
- **Portal Orientation**: Guide to using the member portal

### Donation Processing Templates
- **Thank You Sequence**: Immediate receipt + impact communication
- **Tier Upgrade Celebration**: Recognition and benefit updates
- **Recurring Donation Management**: Failed payment handling

### Event Management Templates
- **Registration Confirmation**: Immediate confirmation with details
- **Reminder Sequence**: 24h and 1h reminders with logistics
- **Follow-up Communications**: Post-event surveys and thank you

### Communication Templates
- **Newsletter Automation**: Weekly/monthly newsletter generation
- **Re-engagement Campaigns**: Win-back sequences for inactive members
- **Seasonal Campaigns**: Holiday and special occasion messaging

## Database Schema

### Automations Table
```sql
CREATE TABLE automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    trigger_type VARCHAR(100) NOT NULL,
    trigger_conditions JSONB,
    actions JSONB NOT NULL,
    status automation_status DEFAULT 'active',
    last_run TIMESTAMP WITH TIME ZONE,
    next_run TIMESTAMP WITH TIME ZONE,
    run_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID
);
```

### Automation Logs Table
```sql
CREATE TABLE automation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID NOT NULL REFERENCES automations(id),
    member_id UUID REFERENCES members(id),
    trigger_data JSONB,
    actions_executed JSONB,
    success BOOLEAN NOT NULL,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Integration Points

### Member Registration
Automatically triggers onboarding workflows when new members are created:

```typescript
// In /api/members/route.ts
await automationService.triggerMemberOnboarding(member);
```

### Payment Processing
Integrates with Stripe webhooks for donation acknowledgments:

```typescript
// In payment processing
await automationService.triggerDonationAcknowledgment(donation, member);
```

### Event Management
Connects with event registration system:

```typescript
// On event registration
await automationService.triggerEventReminder(event, member, 'registration_confirmation');
```

## Monitoring & Analytics

### Key Metrics Tracked
- Total automation executions
- Success/failure rates by automation type
- Average execution times
- Member engagement rates
- Email open/click rates (when integrated)

### Performance Monitoring
- Real-time execution status
- Error tracking and alerting
- Automated performance reports
- Resource usage monitoring

### Logging System
- Comprehensive execution logs
- Error details and stack traces
- Performance metrics
- Audit trail for compliance

## n8n Integration

### Webhook Configuration
The system can integrate with n8n for complex external workflows:

```bash
# n8n webhook endpoints
https://your-n8n-instance.com/webhook/member-onboarding
https://your-n8n-instance.com/webhook/donation-acknowledgment
https://your-n8n-instance.com/webhook/event-reminder
```

### Workflow Examples
- Email service integration (SendGrid, Mailgun, etc.)
- CRM synchronization (Salesforce, HubSpot)
- Social media posting (Twitter, Facebook)
- Calendar integration (Google Calendar, Outlook)
- SMS notifications (Twilio, AWS SNS)

## Testing

### Automated Testing
The system includes comprehensive test coverage:

```bash
# Run automation tests
npm run test:automation

# Test specific workflows
npm run test:onboarding
npm run test:donations
```

### Manual Testing
Use the test interface at `/automation/test` to:
- Test individual workflows with sample data
- Verify email templates and content
- Check integration endpoints
- Monitor execution performance

## Security

### Access Control
- Role-based permissions for automation management
- API key authentication for external integrations
- Audit logging for all automation changes

### Data Protection
- Encrypted sensitive data in automation logs
- GDPR compliance for member data processing
- Secure webhook signature verification

### Error Handling
- Graceful failure handling
- Automatic retry mechanisms
- Error notification systems
- Fallback procedures

## Deployment

### Production Checklist

1. **Environment Configuration**
   - [ ] Set production n8n webhook URLs
   - [ ] Configure email service credentials
   - [ ] Set up monitoring and alerting
   - [ ] Verify database connections

2. **Integration Testing**
   - [ ] Test all workflow triggers
   - [ ] Verify email delivery
   - [ ] Check external API connections
   - [ ] Validate webhook security

3. **Performance Optimization**
   - [ ] Configure queue processing
   - [ ] Set up database indexing
   - [ ] Optimize email templates
   - [ ] Enable caching where appropriate

4. **Monitoring Setup**
   - [ ] Configure error alerting
   - [ ] Set up performance dashboards
   - [ ] Enable audit logging
   - [ ] Test backup procedures

### Scaling Considerations
- Queue-based processing for high volume
- Database connection pooling
- Rate limiting for external APIs
- Horizontal scaling for workflow processors

## Future Enhancements

### Planned Features
- [ ] Visual workflow builder interface
- [ ] A/B testing for email templates
- [ ] Advanced member segmentation
- [ ] Machine learning for optimization
- [ ] Mobile app integration
- [ ] Advanced analytics dashboard

### Integration Roadmap
- [ ] CRM system integration
- [ ] Advanced email service providers
- [ ] Social media automation
- [ ] Calendar and scheduling systems
- [ ] Payment processor webhooks
- [ ] Third-party communication tools

## Support

### Common Issues

**Automation Not Triggering:**
- Verify automation status is 'active'
- Check trigger conditions are met
- Review automation logs for errors
- Confirm database connections

**Email Delivery Issues:**
- Verify email service configuration
- Check spam filter settings
- Review email template formatting
- Monitor delivery rates

**Performance Issues:**
- Monitor execution times
- Check database query performance
- Review queue processing
- Optimize email templates

### Development Workflow

1. Create workflow implementation in `/workflows/`
2. Add API endpoints for management
3. Update automation service triggers
4. Create UI components for management
5. Add comprehensive tests
6. Update documentation

The automation system provides a robust foundation for managing member communications and workflows, with extensive customization options and comprehensive monitoring capabilities.