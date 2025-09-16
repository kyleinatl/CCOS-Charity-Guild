'use client';

import { useState, useCallback } from 'react';
import MemberDataTable from '@/components/members/member-data-table';
import MemberForm from '@/components/members/member-form';
import MemberDetails from '@/components/members/member-details';
import { Member, MemberFormData } from '@/types';

type ViewMode = 'table' | 'form' | 'details';

export default function MembersPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleCreateMember = useCallback(() => {
    setSelectedMember(null);
    setViewMode('form');
  }, []);

  const handleEditMember = useCallback((member: Member) => {
    setSelectedMember(member);
    setViewMode('form');
  }, []);

  const handleViewMember = useCallback((member: Member) => {
    setSelectedMember(member);
    setViewMode('details');
  }, []);

  const handleCloseModal = useCallback(() => {
    setViewMode('table');
    setSelectedMember(null);
  }, []);

  const handleSaveMember = async (memberData: MemberFormData) => {
    setIsLoading(true);
    try {
      const url = selectedMember 
        ? `/api/members/${selectedMember.id}`
        : '/api/members';
      
      const method = selectedMember ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save member');
      }

      const result = await response.json();
      
      // Close the modal and refresh the table
      setViewMode('table');
      setSelectedMember(null);
      setRefreshTrigger(prev => prev + 1);
      
      // Show success message (you could add a toast notification here)
      console.log('Member saved successfully:', result);
      
    } catch (error) {
      console.error('Error saving member:', error);
      throw error; // Re-throw to let the form component handle the error
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (member: Member) => {
    try {
      const response = await fetch(`/api/members/${member.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete member');
      }

      // Close the modal and refresh the table
      setViewMode('table');
      setSelectedMember(null);
      setRefreshTrigger(prev => prev + 1);
      
      console.log('Member deleted successfully');
    } catch (error) {
      console.error('Error deleting member:', error);
      alert('Failed to delete member. Please try again.');
    }
  };

  return (
    <div className="p-6">
      {/* Main Table View */}
      <MemberDataTable
        key={refreshTrigger} // Force re-render when refreshTrigger changes
        onCreateMember={handleCreateMember}
        onEditMember={handleEditMember}
        onViewMember={handleViewMember}
      />

      {/* Member Form Modal */}
      {viewMode === 'form' && (
        <MemberForm
          member={selectedMember || undefined}
          onClose={handleCloseModal}
          onSave={handleSaveMember}
          isLoading={isLoading}
        />
      )}

      {/* Member Details Modal */}
      {viewMode === 'details' && selectedMember && (
        <MemberDetails
          member={selectedMember}
          onClose={handleCloseModal}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
        />
      )}
    </div>
  );
}