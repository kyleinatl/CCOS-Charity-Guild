'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

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
  registration_fee: number | null;
  registration_deadline: string | null;
  requirements?: string;
  agenda?: string;
  contact_email?: string;
  contact_phone?: string;
  tags?: string;
}

interface EventFormProps {
  event?: Event | null;
  onSave: () => void;
  onCancel: () => void;
}

export function EventForm({ event, onSave, onCancel }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    event_type: 'community',
    status: 'draft',
    start_date: '',
    end_date: '',
    location: '',
    is_virtual: false,
    virtual_meeting_url: '',
    capacity: '',
    registration_fee: '',
    registration_deadline: '',
    requirements: '',
    agenda: '',
    contact_email: '',
    contact_phone: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        description: event.description || '',
        event_type: event.event_type || 'community',
        status: event.status || 'draft',
        start_date: event.start_date ? new Date(event.start_date).toISOString().slice(0, 16) : '',
        end_date: event.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        is_virtual: event.is_virtual || false,
        virtual_meeting_url: event.virtual_meeting_url || '',
        capacity: event.capacity ? event.capacity.toString() : '',
        registration_fee: event.registration_fee ? event.registration_fee.toString() : '',
        registration_deadline: event.registration_deadline 
          ? new Date(event.registration_deadline).toISOString().slice(0, 16) 
          : '',
        requirements: event.requirements || '',
        agenda: event.agenda || '',
        contact_email: event.contact_email || '',
        contact_phone: event.contact_phone || '',
        tags: event.tags || '',
      });
    }
  }, [event]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Event description is required';
    }

    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required';
    }

    if (!formData.end_date) {
      newErrors.end_date = 'End date is required';
    }

    if (formData.start_date && formData.end_date && 
        new Date(formData.start_date) > new Date(formData.end_date)) {
      newErrors.end_date = 'End date must be after start date';
    }

    if (!formData.is_virtual && !formData.location.trim()) {
      newErrors.location = 'Location is required for in-person events';
    }

    if (formData.is_virtual && !formData.virtual_meeting_url.trim()) {
      newErrors.virtual_meeting_url = 'Meeting URL is required for virtual events';
    }

    if (formData.capacity && parseInt(formData.capacity) < 1) {
      newErrors.capacity = 'Capacity must be at least 1';
    }

    if (formData.registration_fee && parseFloat(formData.registration_fee) < 0) {
      newErrors.registration_fee = 'Registration fee cannot be negative';
    }

    if (formData.registration_deadline && formData.start_date &&
        new Date(formData.registration_deadline) >= new Date(formData.start_date)) {
      newErrors.registration_deadline = 'Registration deadline must be before event start';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        registration_fee: formData.registration_fee ? parseFloat(formData.registration_fee) : null,
        registration_deadline: formData.registration_deadline || null,
        requirements: formData.requirements || null,
        agenda: formData.agenda || null,
        contact_email: formData.contact_email || null,
        contact_phone: formData.contact_phone || null,
        tags: formData.tags || null,
        virtual_meeting_url: formData.is_virtual ? formData.virtual_meeting_url : null,
        location: formData.is_virtual ? null : formData.location,
      };

      const url = event ? `/api/events/${event.id}` : '/api/events';
      const method = event ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        onSave();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save event');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {event ? 'Edit Event' : 'Create New Event'}
        </h2>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter event name"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Event Type
            </label>
            <select
              value={formData.event_type}
              onChange={(e) => handleInputChange('event_type', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="fundraiser">Fundraiser</option>
              <option value="community">Community</option>
              <option value="educational">Educational</option>
              <option value="social">Social</option>
              <option value="volunteer">Volunteer</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description *
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe the event"
            rows={4}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description}</p>
          )}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Start Date & Time *
            </label>
            <Input
              type="datetime-local"
              value={formData.start_date}
              onChange={(e) => handleInputChange('start_date', e.target.value)}
              className={errors.start_date ? 'border-red-500' : ''}
            />
            {errors.start_date && (
              <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              End Date & Time *
            </label>
            <Input
              type="datetime-local"
              value={formData.end_date}
              onChange={(e) => handleInputChange('end_date', e.target.value)}
              className={errors.end_date ? 'border-red-500' : ''}
            />
            {errors.end_date && (
              <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="is_virtual"
              checked={formData.is_virtual}
              onChange={(e) => handleInputChange('is_virtual', e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="is_virtual" className="text-sm font-medium">
              Virtual Event
            </label>
          </div>

          {formData.is_virtual ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                Meeting URL *
              </label>
              <Input
                type="url"
                value={formData.virtual_meeting_url}
                onChange={(e) => handleInputChange('virtual_meeting_url', e.target.value)}
                placeholder="https://zoom.us/j/..."
                className={errors.virtual_meeting_url ? 'border-red-500' : ''}
              />
              {errors.virtual_meeting_url && (
                <p className="text-red-500 text-sm mt-1">{errors.virtual_meeting_url}</p>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">
                Location *
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Enter event location"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          )}
        </div>

        {/* Registration */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Capacity
            </label>
            <Input
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange('capacity', e.target.value)}
              placeholder="Leave empty for unlimited"
              min="1"
              className={errors.capacity ? 'border-red-500' : ''}
            />
            {errors.capacity && (
              <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Registration Fee
            </label>
            <Input
              type="number"
              step="0.01"
              value={formData.registration_fee}
              onChange={(e) => handleInputChange('registration_fee', e.target.value)}
              placeholder="0.00"
              min="0"
              className={errors.registration_fee ? 'border-red-500' : ''}
            />
            {errors.registration_fee && (
              <p className="text-red-500 text-sm mt-1">{errors.registration_fee}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Registration Deadline
            </label>
            <Input
              type="datetime-local"
              value={formData.registration_deadline}
              onChange={(e) => handleInputChange('registration_deadline', e.target.value)}
              className={errors.registration_deadline ? 'border-red-500' : ''}
            />
            {errors.registration_deadline && (
              <p className="text-red-500 text-sm mt-1">{errors.registration_deadline}</p>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Requirements
            </label>
            <Textarea
              value={formData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="Any requirements or prerequisites"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Agenda
            </label>
            <Textarea
              value={formData.agenda}
              onChange={(e) => handleInputChange('agenda', e.target.value)}
              placeholder="Event agenda or schedule"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Email
              </label>
              <Input
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                placeholder="contact@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Contact Phone
              </label>
              <Input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tags
            </label>
            <Input
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Comma-separated tags"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}