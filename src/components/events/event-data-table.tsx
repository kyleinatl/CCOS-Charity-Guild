'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EventForm } from './event-form';
import { EventDetails } from './event-details';

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
  capacity: number | null;
  current_registrations: number;
  registration_fee: number | null;
  registration_deadline: string | null;
  created_at: string;
  _count?: {
    registrations: number;
  };
}

interface EventDataTableProps {
  onEventUpdate?: () => void;
}

export function EventDataTable({ onEventUpdate }: EventDataTableProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(typeFilter && { event_type: typeFilter }),
      });

      const response = await fetch(`/api/events?${params}`);
      const data = await response.json();

      if (response.ok) {
        setEvents(data.events || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        console.error('Failed to fetch events:', data.error);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const handleEventSaved = () => {
    setShowForm(false);
    setSelectedEvent(null);
    fetchEvents();
    onEventUpdate?.();
  };

  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEvents();
        onEventUpdate?.();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event');
    }
  };

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowDetails(true);
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

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      fundraiser: { label: 'Fundraiser', className: 'bg-emerald-100 text-emerald-800' },
      community: { label: 'Community', className: 'bg-orange-100 text-orange-800' },
      educational: { label: 'Educational', className: 'bg-indigo-100 text-indigo-800' },
      social: { label: 'Social', className: 'bg-pink-100 text-pink-800' },
      volunteer: { label: 'Volunteer', className: 'bg-teal-100 text-teal-800' },
      other: { label: 'Other', className: 'bg-gray-100 text-gray-800' },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.other;
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Events</h2>
        <Button onClick={() => setShowForm(true)}>
          Add Event
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="max-w-sm"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => {
            setTypeFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border rounded-md"
        >
          <option value="">All Types</option>
          <option value="fundraiser">Fundraiser</option>
          <option value="community">Community</option>
          <option value="educational">Educational</option>
          <option value="social">Social</option>
          <option value="volunteer">Volunteer</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Events Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No events found. {searchTerm && 'Try adjusting your search terms.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Event
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900">{event.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {event.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getTypeBadge(event.event_type)}
                        {getStatusBadge(event.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="font-medium">
                          {formatDate(event.start_date)}
                        </div>
                        {event.end_date !== event.start_date && (
                          <div className="text-gray-500">
                            to {formatDate(event.end_date)}
                          </div>
                        )}
                        <div className="text-gray-500 mt-1">
                          {event.is_virtual ? (
                            <span className="inline-flex items-center">
                              🖥️ Virtual
                            </span>
                          ) : (
                            <span className="truncate max-w-xs block">
                              📍 {event.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {event.capacity ? (
                        <div>
                          <div className="font-medium">
                            {event.current_registrations}/{event.capacity}
                          </div>
                          <div className="text-xs text-gray-500">
                            {event.capacity - event.current_registrations} available
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-medium">{event.current_registrations}</div>
                          <div className="text-xs text-gray-500">Unlimited</div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {event.registration_fee ? (
                        <span className="font-medium">
                          {formatCurrency(event.registration_fee)}
                        </span>
                      ) : (
                        <span className="text-gray-500">Free</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(event)}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </Button>
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

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <EventForm
              event={selectedEvent}
              onSave={handleEventSaved}
              onCancel={() => {
                setShowForm(false);
                setSelectedEvent(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showDetails && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <EventDetails
              event={selectedEvent}
              onClose={() => {
                setShowDetails(false);
                setSelectedEvent(null);
              }}
              onEdit={() => {
                setShowDetails(false);
                setShowForm(true);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}