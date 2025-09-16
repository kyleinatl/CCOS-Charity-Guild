import { EventAutomationDashboard } from '@/components/automation/event-automation-dashboard';

export default function EventAutomationPage() {
  return (
    <div className="container mx-auto py-6">
      <EventAutomationDashboard />
    </div>
  );
}

export const metadata = {
  title: 'Event Automation | CCOS Charity Guild',
  description: 'Manage and monitor event-related automation workflows',
};