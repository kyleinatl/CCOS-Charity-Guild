'use client';

import { EventDataTable } from '@/components/events/event-data-table';

export default function EventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Event Management</h1>
        <p className="text-gray-600 mt-2">
          Manage events, registrations, and track attendance.
        </p>
      </div>

      <EventDataTable />
    </div>
  );
}