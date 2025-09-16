'use client';

import { CommunicationDataTable } from '@/components/communications/communication-data-table';

export default function CommunicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Communication Management</h1>
        <p className="text-gray-600 mt-2">
          Create and manage email campaigns, newsletters, and member communications.
        </p>
      </div>

      <CommunicationDataTable />
    </div>
  );
}