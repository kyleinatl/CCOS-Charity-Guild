'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Donation, DonationFormData, DonationFormSchema, DonationMethod, Member } from '@/types';
import { X, Save, DollarSign, Search } from 'lucide-react';

interface DonationFormProps {
  donation?: Donation;
  preselectedMemberId?: string;
  onClose: () => void;
  onSave: (donationData: DonationFormData) => Promise<void>;
  isLoading?: boolean;
}

export default function DonationForm({ 
  donation, 
  preselectedMemberId,
  onClose, 
  onSave, 
  isLoading 
}: DonationFormProps) {
  const [formData, setFormData] = useState<DonationFormData>({
    member_id: donation?.member_id || preselectedMemberId || '',
    amount: donation?.amount || 0,
    donation_date: donation?.donation_date ? donation.donation_date.split('T')[0] : new Date().toISOString().split('T')[0],
    method: donation?.method || 'online',
    designation: donation?.designation || 'General Fund',
    transaction_id: donation?.transaction_id || '',
    payment_processor: donation?.payment_processor || '',
    processing_fee: donation?.processing_fee || 0,
    receipt_sent: donation?.receipt_sent ?? false,
    tax_deductible: donation?.tax_deductible ?? true,
    is_recurring: donation?.is_recurring ?? false,
    recurring_frequency: donation?.recurring_frequency || '',
    anonymous: donation?.anonymous ?? false,
    public_acknowledgment: donation?.public_acknowledgment ?? true,
    notes: donation?.notes || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [members, setMembers] = useState<Member[]>([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [showMemberDropdown, setShowMemberDropdown] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Fetch members for selection
  useEffect(() => {
    fetchMembers();
  }, []);

  // Set selected member if preselected
  useEffect(() => {
    if (preselectedMemberId) {
      const member = members.find(m => m.id === preselectedMemberId);
      if (member) {
        setSelectedMember(member);
        setMemberSearch(`${member.first_name} ${member.last_name} (${member.email})`);
      }
    }
  }, [preselectedMemberId, members]);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members?limit=100');
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const filteredMembers = members.filter(member =>
    memberSearch === '' || 
    `${member.first_name} ${member.last_name}`.toLowerCase().includes(memberSearch.toLowerCase()) ||
    member.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // Validate form data
      const validatedData = DonationFormSchema.parse(formData);
      await onSave(validatedData);
    } catch (error) {
      if (error instanceof Error) {
        // Handle Zod validation errors
        if ('issues' in error) {
          const fieldErrors: Record<string, string> = {};
          (error as any).issues.forEach((issue: any) => {
            if (issue.path) {
              fieldErrors[issue.path[0]] = issue.message;
            }
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ general: error.message });
        }
      }
    }
  };

  const handleInputChange = (field: keyof DonationFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleMemberSelect = (member: Member) => {
    setSelectedMember(member);
    setMemberSearch(`${member.first_name} ${member.last_name} (${member.email})`);
    setFormData(prev => ({ ...prev, member_id: member.id }));
    setShowMemberDropdown(false);
  };

  const calculateNetAmount = () => {
    return formData.amount - formData.processing_fee;
  };

  const designationOptions = [
    'General Fund',
    'Building Fund',
    'Scholarship Fund',
    'Emergency Relief',
    'Community Programs',
    'Youth Programs',
    'Senior Programs',
    'Other'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                {donation ? 'Edit Donation' : 'Record New Donation'}
              </h2>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Member Selection */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h3>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Member *
                </label>
                <div className="relative">
                  <Input
                    value={memberSearch}
                    onChange={(e) => {
                      setMemberSearch(e.target.value);
                      setShowMemberDropdown(true);
                    }}
                    onFocus={() => setShowMemberDropdown(true)}
                    placeholder="Search for a member..."
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                
                {showMemberDropdown && filteredMembers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredMembers.slice(0, 10).map((member) => (
                      <div
                        key={member.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleMemberSelect(member)}
                      >
                        <div className="font-medium text-gray-900">
                          {member.first_name} {member.last_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {member.email} • {member.tier} tier
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.member_id && (
                  <p className="text-sm text-red-600 mt-1">{errors.member_id}</p>
                )}
              </div>
            </div>

            {/* Donation Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Donation Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                  {errors.amount && (
                    <p className="text-sm text-red-600 mt-1">{errors.amount}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donation Date *
                  </label>
                  <Input
                    type="date"
                    value={formData.donation_date}
                    onChange={(e) => handleInputChange('donation_date', e.target.value)}
                  />
                  {errors.donation_date && (
                    <p className="text-sm text-red-600 mt-1">{errors.donation_date}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method *
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => handleInputChange('method', e.target.value as DonationMethod)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="online">Online</option>
                    <option value="credit_card">Credit Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="check">Check</option>
                    <option value="cash">Cash</option>
                  </select>
                  {errors.method && (
                    <p className="text-sm text-red-600 mt-1">{errors.method}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Designation
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) => handleInputChange('designation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    {designationOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Processing Fee
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.processing_fee}
                    onChange={(e) => handleInputChange('processing_fee', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Net amount: ${calculateNetAmount().toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transaction ID
                  </label>
                  <Input
                    value={formData.transaction_id}
                    onChange={(e) => handleInputChange('transaction_id', e.target.value)}
                    placeholder="Enter transaction ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Processor
                  </label>
                  <Input
                    value={formData.payment_processor}
                    onChange={(e) => handleInputChange('payment_processor', e.target.value)}
                    placeholder="e.g., Stripe, PayPal, Square"
                  />
                </div>
              </div>
            </div>

            {/* Recurring Donation */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recurring Options</h3>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_recurring}
                    onChange={(e) => handleInputChange('is_recurring', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">This is a recurring donation</span>
                </label>

                {formData.is_recurring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Frequency
                    </label>
                    <select
                      value={formData.recurring_frequency}
                      onChange={(e) => handleInputChange('recurring_frequency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select frequency</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="annually">Annually</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Options and Preferences */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Options</h3>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.tax_deductible}
                    onChange={(e) => handleInputChange('tax_deductible', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Tax Deductible</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.receipt_sent}
                    onChange={(e) => handleInputChange('receipt_sent', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Receipt Sent</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.anonymous}
                    onChange={(e) => handleInputChange('anonymous', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Anonymous Donation</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.public_acknowledgment}
                    onChange={(e) => handleInputChange('public_acknowledgment', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Public Acknowledgment</span>
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Add any additional notes about this donation"
                rows={3}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {donation ? 'Update Donation' : 'Record Donation'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}