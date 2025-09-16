'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CommunicationForm } from './communication-form';
import { CommunicationDetails } from './communication-details';

interface Communication {
  id: string;
  type: string;
  subject: string;
  content: string;
  recipient_segments: string[];
  total_recipients: number;
  sent_at: string | null;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  platform?: string;
  scheduled_for?: string;
  from_email?: string;
  tags?: string[];
  created_at: string;
}

interface CommunicationDataTableProps {
  onCommunicationUpdate?: () => void;
}

export function CommunicationDataTable({ onCommunicationUpdate }: CommunicationDataTableProps) {
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommunication, setSelectedCommunication] = useState<Communication | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchCommunications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(typeFilter && { type: typeFilter }),
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/communications?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCommunications(data.communications || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        console.error('Failed to fetch communications:', data.error);
      }
    } catch (error) {
      console.error('Error fetching communications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCommunications();
  }, [currentPage, searchTerm, typeFilter, statusFilter]);

  const handleCommunicationSaved = () => {
    setShowForm(false);
    setSelectedCommunication(null);
    fetchCommunications();
    onCommunicationUpdate?.();
  };

  const handleEdit = (communication: Communication) => {
    if (communication.sent_at) {
      alert('Cannot edit sent communications');
      return;
    }
    setSelectedCommunication(communication);
    setShowForm(true);
  };

  const handleDelete = async (communicationId: string) => {
    if (!confirm('Are you sure you want to delete this communication?')) return;

    try {
      const response = await fetch(`/api/communications/${communicationId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCommunications();
        onCommunicationUpdate?.();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete communication');
      }
    } catch (error) {
      console.error('Error deleting communication:', error);
      alert('Failed to delete communication');
    }
  };

  const handleSend = async (communicationId: string) => {
    if (!confirm('Are you sure you want to send this communication? This action cannot be undone.')) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/communications/${communicationId}/send`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Communication sent successfully! Delivered to ${data.delivery_stats.delivered} out of ${data.delivery_stats.total_recipients} recipients.`);
        fetchCommunications();
        onCommunicationUpdate?.();
      } else {
        alert(data.error || 'Failed to send communication');
      }
    } catch (error) {
      console.error('Error sending communication:', error);
      alert('Failed to send communication');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (communication: Communication) => {
    setSelectedCommunication(communication);
    setShowDetails(true);
  };

  const getStatusBadge = (communication: Communication) => {
    if (communication.sent_at) {
      return <Badge className="bg-green-100 text-green-800">Sent</Badge>;
    } else if (communication.scheduled_for) {
      return <Badge className="bg-blue-100 text-blue-800">Scheduled</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      newsletter: { label: 'Newsletter', className: 'bg-purple-100 text-purple-800' },
      email_campaign: { label: 'Campaign', className: 'bg-orange-100 text-orange-800' },
      social_media: { label: 'Social Media', className: 'bg-pink-100 text-pink-800' },
      direct_email: { label: 'Direct Email', className: 'bg-indigo-100 text-indigo-800' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || { label: type, className: 'bg-gray-100 text-gray-800' };
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100) / 100}%`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Communications</h2>
        <Button onClick={() => setShowForm(true)}>
          Create Communication
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search communications..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        
        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Types</option>
          <option value="newsletter">Newsletter</option>
          <option value="email_campaign">Email Campaign</option>
          <option value="social_media">Social Media</option>
          <option value="direct_email">Direct Email</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Status</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
          <option value="sent">Sent</option>
        </select>
      </div>

      {/* Communications Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">Loading communications...</div>
        ) : communications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No communications found. {searchTerm && 'Try adjusting your search terms.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Communication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Recipients
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {communications.map((communication) => (
                  <tr key={communication.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{communication.subject}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          Segments: {communication.recipient_segments.join(', ')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getTypeBadge(communication.type)}
                        {getStatusBadge(communication)}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium">{communication.total_recipients}</div>
                      <div className="text-gray-500">recipients</div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {communication.sent_at ? (
                        <div className="space-y-1">
                          <div>📨 {formatPercentage(communication.delivery_rate)}</div>
                          <div>👁️ {formatPercentage(communication.open_rate)}</div>
                          <div>🖱️ {formatPercentage(communication.click_rate)}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Not sent</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        {communication.sent_at ? (
                          <div>
                            <div className="font-medium">Sent</div>
                            <div className="text-gray-500">
                              {formatDate(communication.sent_at)}
                            </div>
                          </div>
                        ) : communication.scheduled_for ? (
                          <div>
                            <div className="font-medium">Scheduled</div>
                            <div className="text-gray-500">
                              {formatDate(communication.scheduled_for)}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="font-medium">Created</div>
                            <div className="text-gray-500">
                              {formatDate(communication.created_at)}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(communication)}
                        >
                          View
                        </Button>
                        {!communication.sent_at && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(communication)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleSend(communication.id)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Send
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(communication.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          <span className="px-4 py-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Communication Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <CommunicationForm
              communication={selectedCommunication}
              onSave={handleCommunicationSaved}
              onCancel={() => {
                setShowForm(false);
                setSelectedCommunication(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Communication Details Modal */}
      {showDetails && selectedCommunication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <CommunicationDetails
              communication={selectedCommunication}
              onClose={() => {
                setShowDetails(false);
                setSelectedCommunication(null);
              }}
              onEdit={() => {
                setShowDetails(false);
                setShowForm(true);
              }}
              onSend={() => {
                handleSend(selectedCommunication.id);
                setShowDetails(false);
                setSelectedCommunication(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}