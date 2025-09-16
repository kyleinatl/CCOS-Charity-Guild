'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Donation, Member } from '@/types';
import { 
  X, 
  DollarSign, 
  User, 
  Calendar, 
  CreditCard, 
  Receipt,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface DonationDetailsProps {
  donation: Donation;
  onClose: () => void;
  onEdit: (donation: Donation) => void;
  onDelete?: (donation: Donation) => void;
}

interface DonationWithMember extends Donation {
  members?: Member;
}

export default function DonationDetails({ donation, onClose, onEdit, onDelete }: DonationDetailsProps) {
  const [donationDetails, setDonationDetails] = useState<DonationWithMember>(donation);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDonationDetails();
  }, [donation.id]);

  const fetchDonationDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/donations/${donation.id}`);
      if (response.ok) {
        const data = await response.json();
        setDonationDetails(data.donation);
      }
    } catch (error) {
      console.error('Error fetching donation details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'online':
      case 'credit_card': 
        return <CreditCard className="w-5 h-5" />;
      case 'bank_transfer': 
        return <DollarSign className="w-5 h-5" />;
      default: 
        return <Receipt className="w-5 h-5" />;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'online': return 'bg-blue-100 text-blue-800';
      case 'credit_card': return 'bg-purple-100 text-purple-800';
      case 'bank_transfer': return 'bg-green-100 text-green-800';
      case 'check': return 'bg-yellow-100 text-yellow-800';
      case 'cash': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
      onDelete(donation);
    }
  };

  const handleDownloadReceipt = () => {
    // This would generate and download a receipt PDF
    console.log('Download receipt for donation:', donation.id);
    // Implementation would go here
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Donation Details
                </h2>
                <p className="text-gray-600">
                  {donationDetails.receipt_number && `Receipt #${donationDetails.receipt_number}`}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleDownloadReceipt}>
                <Download className="w-4 h-4 mr-2" />
                Receipt
              </Button>
              <Button variant="outline" size="sm" onClick={() => onEdit(donation)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              {onDelete && (
                <Button variant="outline" size="sm" onClick={handleDelete} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Amount Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Amount Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Donation Amount</p>
                    <p className="text-2xl font-bold text-green-900">
                      {formatCurrency(donationDetails.amount)}
                    </p>
                  </div>
                  
                  {donationDetails.processing_fee > 0 && (
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <Receipt className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Processing Fee</p>
                      <p className="text-xl font-bold text-red-900">
                        {formatCurrency(donationDetails.processing_fee)}
                      </p>
                    </div>
                  )}
                  
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Net Amount</p>
                    <p className="text-xl font-bold text-blue-900">
                      {formatCurrency(donationDetails.net_amount || (donationDetails.amount - donationDetails.processing_fee))}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {getMethodIcon(donationDetails.method)}
                      <div>
                        <p className="text-sm text-gray-600">Payment Method</p>
                        <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getMethodColor(donationDetails.method)}`}>
                          {donationDetails.method.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-600">Donation Date</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(donationDetails.donation_date)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Designation</p>
                      <p className="font-medium text-gray-900">
                        {donationDetails.designation}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {donationDetails.transaction_id && (
                      <div>
                        <p className="text-sm text-gray-600">Transaction ID</p>
                        <p className="font-mono text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {donationDetails.transaction_id}
                        </p>
                      </div>
                    )}

                    {donationDetails.payment_processor && (
                      <div>
                        <p className="text-sm text-gray-600">Payment Processor</p>
                        <p className="font-medium text-gray-900">
                          {donationDetails.payment_processor}
                        </p>
                      </div>
                    )}

                    {donationDetails.receipt_number && (
                      <div>
                        <p className="text-sm text-gray-600">Receipt Number</p>
                        <p className="font-mono text-sm text-gray-900 bg-gray-100 px-2 py-1 rounded">
                          {donationDetails.receipt_number}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Options and Status */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Options</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    {donationDetails.tax_deductible ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">Tax Deductible</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {donationDetails.receipt_sent ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">Receipt Sent</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {donationDetails.anonymous ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">Anonymous</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {donationDetails.public_acknowledgment ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className="text-sm text-gray-700">Public Acknowledgment</span>
                  </div>
                </div>
              </Card>

              {/* Recurring Information */}
              {donationDetails.is_recurring && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recurring Donation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Frequency</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {donationDetails.recurring_frequency}
                      </p>
                    </div>
                    {donationDetails.recurring_end_date && (
                      <div>
                        <p className="text-sm text-gray-600">End Date</p>
                        <p className="font-medium text-gray-900">
                          {formatDate(donationDetails.recurring_end_date)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Notes */}
              {donationDetails.notes && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {donationDetails.notes}
                  </p>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Donor Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Donor Information</h3>
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ) : donationDetails.members ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {donationDetails.members.first_name} {donationDetails.members.last_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {donationDetails.members.email}
                        </p>
                      </div>
                    </div>
                    <div className="pt-2 border-t">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${donationDetails.members.tier === 'bronze' ? 'amber' : donationDetails.members.tier === 'silver' ? 'gray' : donationDetails.members.tier === 'gold' ? 'yellow' : 'purple'}-100 text-${donationDetails.members.tier === 'bronze' ? 'amber' : donationDetails.members.tier === 'silver' ? 'gray' : donationDetails.members.tier === 'gold' ? 'yellow' : 'purple'}-800`}>
                        {donationDetails.members.tier.charAt(0).toUpperCase() + donationDetails.members.tier.slice(1)} Member
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Donor information not available</p>
                )}
              </Card>

              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleDownloadReceipt}>
                    <Download className="w-4 h-4 mr-2" />
                    Download Receipt
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Receipt className="w-4 h-4 mr-2" />
                    Send Thank You
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Create Recurring
                  </Button>
                </div>
              </Card>

              {/* Audit Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Audit Trail</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-600">Created</p>
                    <p className="text-gray-900">
                      {formatDate(donationDetails.created_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p className="text-gray-900">
                      {formatDate(donationDetails.updated_at)}
                    </p>
                  </div>
                  {donationDetails.created_by && (
                    <div>
                      <p className="text-gray-600">Created By</p>
                      <p className="text-gray-900">{donationDetails.created_by}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}