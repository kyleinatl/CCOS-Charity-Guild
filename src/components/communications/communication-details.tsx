'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
  reply_to_email?: string;
  tags?: string[];
  created_at: string;
}

interface Recipient {
  id: string;
  delivered: boolean;
  delivered_at: string | null;
  opened: boolean;
  opened_at: string | null;
  clicked: boolean;
  clicked_at: string | null;
  bounced: boolean;
  unsubscribed: boolean;
  created_at: string;
  members: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    tier: string;
  };
}

interface CommunicationAnalytics {
  total_recipients: number;
  delivered_count: number;
  opened_count: number;
  clicked_count: number;
  bounced_count: number;
  unsubscribed_count: number;
  delivery_rate: number;
  open_rate: number;
  click_rate: number;
  bounce_rate: number;
}

interface CommunicationDetailsProps {
  communication: Communication;
  onClose: () => void;
  onEdit: () => void;
  onSend: () => void;
}

export function CommunicationDetails({ communication, onClose, onEdit, onSend }: CommunicationDetailsProps) {
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [analytics, setAnalytics] = useState<CommunicationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'recipients' | 'analytics'>('details');

  useEffect(() => {
    fetchCommunicationDetails();
  }, [communication.id]);

  const fetchCommunicationDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/communications/${communication.id}`);
      const data = await response.json();

      if (response.ok) {
        setRecipients(data.communication.communication_recipients || []);
        setAnalytics(data.analytics);
      } else {
        console.error('Failed to fetch communication details:', data.error);
      }
    } catch (error) {
      console.error('Error fetching communication details:', error);
    } finally {
      setLoading(false);
    }
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

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      bronze: { label: 'Bronze', className: 'bg-amber-100 text-amber-800' },
      silver: { label: 'Silver', className: 'bg-gray-100 text-gray-800' },
      gold: { label: 'Gold', className: 'bg-yellow-100 text-yellow-800' },
      platinum: { label: 'Platinum', className: 'bg-purple-100 text-purple-800' },
    };

    const config = tierConfig[tier as keyof typeof tierConfig] || { label: tier, className: 'bg-gray-100 text-gray-800' };
    return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
  };

  const getRecipientStatusBadge = (recipient: Recipient) => {
    if (recipient.unsubscribed) {
      return <Badge className="bg-gray-100 text-gray-800">Unsubscribed</Badge>;
    } else if (recipient.bounced) {
      return <Badge className="bg-red-100 text-red-800">Bounced</Badge>;
    } else if (recipient.clicked) {
      return <Badge className="bg-green-100 text-green-800">Clicked</Badge>;
    } else if (recipient.opened) {
      return <Badge className="bg-blue-100 text-blue-800">Opened</Badge>;
    } else if (recipient.delivered) {
      return <Badge className="bg-yellow-100 text-yellow-800">Delivered</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPercentage = (value: number) => {
    return `${Math.round(value * 100) / 100}%`;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">{communication.subject}</h2>
          <div className="flex items-center gap-2">
            {getTypeBadge(communication.type)}
            {getStatusBadge(communication)}
            {communication.platform && (
              <Badge variant="outline" className="capitalize">
                {communication.platform}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {!communication.sent_at && (
            <>
              <Button onClick={onEdit}>Edit</Button>
              <Button 
                onClick={onSend}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Send Now
              </Button>
            </>
          )}
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Communication Details
          </button>
          {communication.sent_at && (
            <>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('recipients')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recipients'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Recipients ({recipients.length})
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="text-lg capitalize">{communication.type.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Recipients</p>
                <p className="text-lg">{communication.total_recipients} members</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p className="text-lg">{formatDate(communication.created_at)}</p>
              </div>
              {communication.sent_at && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Sent</p>
                  <p className="text-lg">{formatDate(communication.sent_at)}</p>
                </div>
              )}
              {communication.scheduled_for && !communication.sent_at && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Scheduled For</p>
                  <p className="text-lg">{formatDate(communication.scheduled_for)}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Content */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Content</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Subject</p>
                <p className="text-lg font-medium">{communication.subject}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Message</p>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-gray-700 whitespace-pre-wrap">{communication.content}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recipient Segments */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Target Audience</h3>
            <div className="flex flex-wrap gap-2">
              {communication.recipient_segments.map((segment, index) => (
                <Badge key={index} variant="outline" className="capitalize">
                  {segment.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Email Settings */}
          {(communication.from_email || communication.reply_to_email) && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Email Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {communication.from_email && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">From Email</p>
                    <p className="text-lg">{communication.from_email}</p>
                  </div>
                )}
                {communication.reply_to_email && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Reply To</p>
                    <p className="text-lg">{communication.reply_to_email}</p>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Tags */}
          {communication.tags && communication.tags.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {communication.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div className="space-y-6">
          {/* Performance Overview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{analytics.delivered_count}</div>
                <div className="text-sm text-gray-500">Delivered</div>
                <div className="text-sm text-blue-600">{formatPercentage(analytics.delivery_rate)}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{analytics.opened_count}</div>
                <div className="text-sm text-gray-500">Opened</div>
                <div className="text-sm text-green-600">{formatPercentage(analytics.open_rate)}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{analytics.clicked_count}</div>
                <div className="text-sm text-gray-500">Clicked</div>
                <div className="text-sm text-purple-600">{formatPercentage(analytics.click_rate)}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600">{analytics.bounced_count}</div>
                <div className="text-sm text-gray-500">Bounced</div>
                <div className="text-sm text-red-600">{formatPercentage(analytics.bounce_rate)}</div>
              </div>
            </div>
          </Card>

          {/* Detailed Metrics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Metrics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Total Recipients</span>
                <span className="font-medium">{analytics.total_recipients}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Successfully Delivered</span>
                <span className="font-medium">{analytics.delivered_count} ({formatPercentage(analytics.delivery_rate)})</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Emails Opened</span>
                <span className="font-medium">{analytics.opened_count} ({formatPercentage(analytics.open_rate)})</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Links Clicked</span>
                <span className="font-medium">{analytics.clicked_count} ({formatPercentage(analytics.click_rate)})</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Bounced Emails</span>
                <span className="font-medium">{analytics.bounced_count} ({formatPercentage(analytics.bounce_rate)})</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Unsubscribed</span>
                <span className="font-medium">{analytics.unsubscribed_count}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recipients Tab */}
      {activeTab === 'recipients' && (
        <div className="space-y-6">
          <Card>
            {loading ? (
              <div className="p-8 text-center">Loading recipients...</div>
            ) : recipients.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No recipients found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Recipient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Opened
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Clicked
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recipients.map((recipient) => (
                      <tr key={recipient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {recipient.members.first_name} {recipient.members.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {recipient.members.email}
                            </div>
                            <div className="mt-1">
                              {getTierBadge(recipient.members.tier)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getRecipientStatusBadge(recipient)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {recipient.delivered ? (
                            <div>
                              <div className="text-green-600">✓ Yes</div>
                              {recipient.delivered_at && (
                                <div className="text-xs text-gray-500">
                                  {formatDate(recipient.delivered_at)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {recipient.opened ? (
                            <div>
                              <div className="text-blue-600">✓ Yes</div>
                              {recipient.opened_at && (
                                <div className="text-xs text-gray-500">
                                  {formatDate(recipient.opened_at)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {recipient.clicked ? (
                            <div>
                              <div className="text-purple-600">✓ Yes</div>
                              {recipient.clicked_at && (
                                <div className="text-xs text-gray-500">
                                  {formatDate(recipient.clicked_at)}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400">No</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}