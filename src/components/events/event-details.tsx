'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Event {
  id: string;
  name: string;
  description: string;
  event_type: string;
  status: string;
  start_date: string;
  end_date: string;
  location: string;
  is_virtual: boolean;
  virtual_meeting_url?: string;
  capacity: number | null;
  current_registrations: number;
  registration_fee: number | null;
  registration_deadline: string | null;
  requirements?: string;
  agenda?: string;
  contact_email?: string;
  contact_phone?: string;
  tags?: string;
  created_at: string;
}

interface Registration {
  id: string;
  member_id: string;
  status: string;
  registration_date: string;
  number_of_guests: number;
  total_attendees: number;
  dietary_restrictions?: string;
  special_requests?: string;
  notes?: string;
  members: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
    tier: string;
  };
}

interface EventDetailsProps {
  event: Event;
  onClose: () => void;
  onEdit: () => void;
}

export function EventDetails({ event, onClose, onEdit }: EventDetailsProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'registrations'>('details');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchRegistrations();
  }, [event.id]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        ...(statusFilter && { status: statusFilter }),
      });

      const response = await fetch(`/api/events/${event.id}/registrations?${params}`);
      const data = await response.json();

      if (response.ok) {
        setRegistrations(data.registrations || []);
      } else {
        console.error('Failed to fetch registrations:', data.error);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRegistrationStatus = async (registrationId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `/api/events/${event.id}/registrations/${registrationId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchRegistrations();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update registration');
      }
    } catch (error) {
      console.error('Error updating registration:', error);
      alert('Failed to update registration');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', className: 'bg-gray-100 text-gray-800' },
      published: { label: 'Published', className: 'bg-blue-100 text-blue-800' },
      active: { label: 'Active', className: 'bg-green-100 text-green-800' },
      completed: { label: 'Completed', className: 'bg-purple-100 text-purple-800' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getRegistrationStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { label: 'Confirmed', className: 'bg-green-100 text-green-800' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-800' },
      attended: { label: 'Attended', className: 'bg-blue-100 text-blue-800' },
      no_show: { label: 'No Show', className: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getRegistrationStats = () => {
    const stats = {
      confirmed: registrations.filter(r => r.status === 'confirmed').length,
      pending: registrations.filter(r => r.status === 'pending').length,
      cancelled: registrations.filter(r => r.status === 'cancelled').length,
      attended: registrations.filter(r => r.status === 'attended').length,
      no_show: registrations.filter(r => r.status === 'no_show').length,
    };

    return stats;
  };

  const stats = getRegistrationStats();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-2">{event.name}</h2>
          <div className="flex items-center gap-2">
            {getStatusBadge(event.status)}
            <Badge variant="outline" className="capitalize">
              {event.event_type}
            </Badge>
            {event.is_virtual && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Virtual
              </Badge>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={onEdit}>Edit Event</Button>
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
            Event Details
          </button>
          <button
            onClick={() => setActiveTab('registrations')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'registrations'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Registrations ({registrations.length})
          </button>
        </nav>
      </div>

      {/* Event Details Tab */}
      {activeTab === 'details' && (
        <div className="space-y-6">
          {/* Basic Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Start Date</p>
                <p className="text-lg">{formatDate(event.start_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">End Date</p>
                <p className="text-lg">{formatDate(event.end_date)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="text-lg">
                  {event.is_virtual ? (
                    <span className="text-blue-600">Virtual Event</span>
                  ) : (
                    event.location
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Capacity</p>
                <p className="text-lg">
                  {event.capacity ? (
                    <span>
                      {event.current_registrations}/{event.capacity}
                      <span className="text-sm text-gray-500 ml-2">
                        ({event.capacity - event.current_registrations} available)
                      </span>
                    </span>
                  ) : (
                    <span>
                      {event.current_registrations}
                      <span className="text-sm text-gray-500 ml-2">(Unlimited)</span>
                    </span>
                  )}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Registration Fee</p>
                <p className="text-lg">
                  {event.registration_fee ? formatCurrency(event.registration_fee) : 'Free'}
                </p>
              </div>
              {event.registration_deadline && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Registration Deadline</p>
                  <p className="text-lg">{formatDate(event.registration_deadline)}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Description */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </Card>

          {/* Additional Info */}
          {(event.requirements || event.agenda || event.contact_email || event.contact_phone || event.tags) && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Information</h3>
              <div className="space-y-4">
                {event.requirements && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Requirements</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{event.requirements}</p>
                  </div>
                )}
                {event.agenda && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Agenda</p>
                    <p className="text-gray-700 whitespace-pre-wrap">{event.agenda}</p>
                  </div>
                )}
                {(event.contact_email || event.contact_phone) && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Contact Information</p>
                    <div className="space-y-1">
                      {event.contact_email && (
                        <p className="text-gray-700">
                          <span className="font-medium">Email:</span> {event.contact_email}
                        </p>
                      )}
                      {event.contact_phone && (
                        <p className="text-gray-700">
                          <span className="font-medium">Phone:</span> {event.contact_phone}
                        </p>
                      )}
                    </div>
                  </div>
                )}
                {event.tags && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">Tags</p>
                    <div className="flex flex-wrap gap-2">
                      {event.tags.split(',').map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Virtual Meeting URL */}
          {event.is_virtual && event.virtual_meeting_url && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Virtual Meeting Details</h3>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Meeting URL</p>
                <a
                  href={event.virtual_meeting_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline break-all"
                >
                  {event.virtual_meeting_url}
                </a>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Registrations Tab */}
      {activeTab === 'registrations' && (
        <div className="space-y-6">
          {/* Registration Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Registration Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
                <div className="text-sm text-gray-500">Confirmed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-gray-500">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.attended}</div>
                <div className="text-sm text-gray-500">Attended</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{stats.no_show}</div>
                <div className="text-sm text-gray-500">No Show</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
                <div className="text-sm text-gray-500">Cancelled</div>
              </div>
            </div>
          </Card>

          {/* Registration Filters */}
          <div className="flex gap-4 items-center">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                fetchRegistrations();
              }}
              className="px-3 py-2 border rounded-md"
            >
              <option value="">All Registrations</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="attended">Attended</option>
              <option value="no_show">No Show</option>
            </select>
          </div>

          {/* Registrations List */}
          <Card>
            {loading ? (
              <div className="p-8 text-center">Loading registrations...</div>
            ) : registrations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No registrations found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendees
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {registrations.map((registration) => (
                      <tr key={registration.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {registration.members.first_name} {registration.members.last_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {registration.members.email}
                            </div>
                            <div className="mt-1">
                              {getTierBadge(registration.members.tier)}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getRegistrationStatusBadge(registration.status)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {formatDate(registration.registration_date)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {registration.total_attendees}
                          {registration.number_of_guests > 0 && (
                            <span className="text-gray-500">
                              {' '}(+{registration.number_of_guests} guests)
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex space-x-2">
                            {registration.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => updateRegistrationStatus(registration.id, 'confirmed')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Confirm
                              </Button>
                            )}
                            {registration.status === 'confirmed' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => updateRegistrationStatus(registration.id, 'attended')}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  Mark Attended
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateRegistrationStatus(registration.id, 'no_show')}
                                >
                                  No Show
                                </Button>
                              </>
                            )}
                            {registration.status !== 'cancelled' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateRegistrationStatus(registration.id, 'cancelled')}
                                className="text-red-600 hover:text-red-800"
                              >
                                Cancel
                              </Button>
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
        </div>
      )}
    </div>
  );
}