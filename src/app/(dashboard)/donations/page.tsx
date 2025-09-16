'use client';

import { useState, useCallback } from 'react';
import DonationDataTable from '@/components/donations/donation-data-table';
import DonationForm from '@/components/donations/donation-form';
import DonationDetails from '@/components/donations/donation-details';
import { Donation, DonationFormData } from '@/types';

type ViewMode = 'table' | 'form' | 'details';

export default function DonationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [preselectedMemberId, setPreselectedMemberId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateDonation = useCallback((memberId?: string) => {
    setSelectedDonation(null);
    setPreselectedMemberId(memberId);
    setViewMode('form');
  }, []);

  const handleEditDonation = useCallback((donation: Donation) => {
    setSelectedDonation(donation);
    setPreselectedMemberId(undefined);
    setViewMode('form');
  }, []);

  const handleViewDonation = useCallback((donation: Donation) => {
    setSelectedDonation(donation);
    setViewMode('details');
  }, []);

  const handleCloseModal = useCallback(() => {
    setViewMode('table');
    setSelectedDonation(null);
    setPreselectedMemberId(undefined);
  }, []);

  const handleSaveDonation = async (donationData: DonationFormData) => {
    setIsLoading(true);
    try {
      const url = selectedDonation 
        ? `/api/donations/${selectedDonation.id}`
        : '/api/donations';
      
      const method = selectedDonation ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save donation');
      }

      const result = await response.json();
      
      // Close the modal and refresh the table
      setViewMode('table');
      setSelectedDonation(null);
      setPreselectedMemberId(undefined);
      setRefreshTrigger(prev => prev + 1);
      
      // Show success message (you could add a toast notification here)
      console.log('Donation saved successfully:', result);
      
    } catch (error) {
      console.error('Error saving donation:', error);
      throw error; // Re-throw to let the form component handle the error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDonation = async (donation: Donation) => {
    try {
      const response = await fetch(`/api/donations/${donation.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete donation');
      }

      // Close the modal and refresh the table
      setViewMode('table');
      setSelectedDonation(null);
      setRefreshTrigger(prev => prev + 1);
      
      console.log('Donation deleted successfully');
    } catch (error) {
      console.error('Error deleting donation:', error);
      alert('Failed to delete donation. Please try again.');
    }
  };

  return (
    <div className="p-6">
      {/* Main Table View */}
      <DonationDataTable
        key={refreshTrigger} // Force re-render when refreshTrigger changes
        onCreateDonation={handleCreateDonation}
        onEditDonation={handleEditDonation}
        onViewDonation={handleViewDonation}
      />

      {/* Donation Form Modal */}
      {viewMode === 'form' && (
        <DonationForm
          donation={selectedDonation || undefined}
          preselectedMemberId={preselectedMemberId}
          onClose={handleCloseModal}
          onSave={handleSaveDonation}
          isLoading={isLoading}
        />
      )}

      {/* Donation Details Modal */}
      {viewMode === 'details' && selectedDonation && (
        <DonationDetails
          donation={selectedDonation}
          onClose={handleCloseModal}
          onEdit={handleEditDonation}
          onDelete={handleDeleteDonation}
        />
      )}
    </div>
  );
}