'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface Communication {
  id: string;
  type: string;
  subject: string;
  content: string;
  recipient_segments: string[];
  total_recipients: number;
  platform?: string;
  scheduled_for?: string;
  from_email?: string;
  reply_to_email?: string;
  tags?: string[];
}

interface CommunicationFormProps {
  communication?: Communication | null;
  onSave: () => void;
  onCancel: () => void;
}

interface SegmentInfo {
  id: string;
  label: string;
  description: string;
  estimatedCount: number;
}

export function CommunicationForm({ communication, onSave, onCancel }: CommunicationFormProps) {
  const [formData, setFormData] = useState({
    type: 'email_campaign',
    subject: '',
    content: '',
    recipient_segments: [] as string[],
    platform: '',
    scheduled_for: '',
    from_email: '',
    reply_to_email: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [segmentInfo, setSegmentInfo] = useState<SegmentInfo[]>([]);
  const [estimatedRecipients, setEstimatedRecipients] = useState(0);

  // Available recipient segments
  const availableSegments = [
    { id: 'all', label: 'All Members', description: 'All email-subscribed members' },
    { id: 'bronze', label: 'Bronze Tier', description: 'Bronze tier members' },
    { id: 'silver', label: 'Silver Tier', description: 'Silver tier members' },
    { id: 'gold', label: 'Gold Tier', description: 'Gold tier members' },
    { id: 'platinum', label: 'Platinum Tier', description: 'Platinum tier members' },
    { id: 'newsletter_subscribers', label: 'Newsletter Subscribers', description: 'Members subscribed to newsletter' },
    { id: 'recent_donors', label: 'Recent Donors', description: 'Members who donated in the last 90 days' },
  ];

  useEffect(() => {
    if (communication) {
      setFormData({
        type: communication.type || 'email_campaign',
        subject: communication.subject || '',
        content: communication.content || '',
        recipient_segments: communication.recipient_segments || [],
        platform: communication.platform || '',
        scheduled_for: communication.scheduled_for 
          ? new Date(communication.scheduled_for).toISOString().slice(0, 16) 
          : '',
        from_email: communication.from_email || '',
        reply_to_email: communication.reply_to_email || '',
        tags: communication.tags?.join(', ') || '',
      });
    }
  }, [communication]);

  useEffect(() => {
    fetchSegmentCounts();
  }, []);

  useEffect(() => {
    calculateEstimatedRecipients();
  }, [formData.recipient_segments, segmentInfo]);

  const fetchSegmentCounts = async () => {
    try {
      // Fetch segment counts from the API
      const segments = await Promise.all(
        availableSegments.map(async (segment) => {
          let count = 0;
          
          if (segment.id === 'all') {
            const response = await fetch('/api/members?limit=1');
            const data = await response.json();
            count = data.pagination?.total || 0;
          } else if (['bronze', 'silver', 'gold', 'platinum'].includes(segment.id)) {
            const response = await fetch(`/api/members?tier=${segment.id}&limit=1`);
            const data = await response.json();
            count = data.pagination?.total || 0;
          } else {
            // For other segments, we'll estimate based on typical percentages
            const allResponse = await fetch('/api/members?limit=1');
            const allData = await allResponse.json();
            const totalMembers = allData.pagination?.total || 0;
            
            if (segment.id === 'newsletter_subscribers') {
              count = Math.round(totalMembers * 0.8); // Estimate 80% subscribe to newsletter
            } else if (segment.id === 'recent_donors') {
              count = Math.round(totalMembers * 0.3); // Estimate 30% are recent donors
            }
          }

          return {
            ...segment,
            estimatedCount: count,
          };
        })
      );

      setSegmentInfo(segments);
    } catch (error) {
      console.error('Error fetching segment counts:', error);
    }
  };

  const calculateEstimatedRecipients = () => {
    if (formData.recipient_segments.includes('all')) {
      const allSegment = segmentInfo.find(s => s.id === 'all');
      setEstimatedRecipients(allSegment?.estimatedCount || 0);
      return;
    }

    const total = formData.recipient_segments.reduce((sum, segmentId) => {
      const segment = segmentInfo.find(s => s.id === segmentId);
      return sum + (segment?.estimatedCount || 0);
    }, 0);

    setEstimatedRecipients(total);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.recipient_segments.length === 0) {
      newErrors.recipient_segments = 'At least one recipient segment is required';
    }

    if (formData.type === 'social_media' && !formData.platform.trim()) {
      newErrors.platform = 'Platform is required for social media posts';
    }

    if (formData.scheduled_for && new Date(formData.scheduled_for) <= new Date()) {
      newErrors.scheduled_for = 'Scheduled time must be in the future';
    }

    if (formData.from_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.from_email)) {
      newErrors.from_email = 'Invalid email format';
    }

    if (formData.reply_to_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.reply_to_email)) {
      newErrors.reply_to_email = 'Invalid email format';
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
      const communicationData = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        scheduled_for: formData.scheduled_for || null,
        from_email: formData.from_email || null,
        reply_to_email: formData.reply_to_email || null,
        platform: formData.type === 'social_media' ? formData.platform : null,
      };

      const url = communication ? `/api/communications/${communication.id}` : '/api/communications';
      const method = communication ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(communicationData),
      });

      if (response.ok) {
        onSave();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to save communication');
      }
    } catch (error) {
      console.error('Error saving communication:', error);
      alert('Failed to save communication');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
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

  const handleSegmentChange = (segmentId: string, checked: boolean) => {
    let newSegments = [...formData.recipient_segments];
    
    if (segmentId === 'all') {
      // If 'all' is selected, clear other segments
      newSegments = checked ? ['all'] : [];
    } else {
      // If another segment is selected, remove 'all'
      newSegments = newSegments.filter(s => s !== 'all');
      
      if (checked) {
        newSegments.push(segmentId);
      } else {
        newSegments = newSegments.filter(s => s !== segmentId);
      }
    }

    handleInputChange('recipient_segments', newSegments);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {communication ? 'Edit Communication' : 'Create New Communication'}
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
              Communication Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="email_campaign">Email Campaign</option>
              <option value="newsletter">Newsletter</option>
              <option value="direct_email">Direct Email</option>
              <option value="social_media">Social Media</option>
            </select>
          </div>

          {formData.type === 'social_media' && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Platform *
              </label>
              <select
                value={formData.platform}
                onChange={(e) => handleInputChange('platform', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md ${errors.platform ? 'border-red-500' : ''}`}
              >
                <option value="">Select Platform</option>
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
              {errors.platform && (
                <p className="text-red-500 text-sm mt-1">{errors.platform}</p>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Subject *
          </label>
          <Input
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder="Enter subject line"
            className={errors.subject ? 'border-red-500' : ''}
          />
          {errors.subject && (
            <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Content *
          </label>
          <Textarea
            value={formData.content}
            onChange={(e) => handleInputChange('content', e.target.value)}
            placeholder="Enter your message content"
            rows={8}
            className={errors.content ? 'border-red-500' : ''}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        {/* Recipient Segments */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Recipient Segments *
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {segmentInfo.map((segment) => (
              <div key={segment.id} className="flex items-center space-x-2 p-3 border rounded-md">
                <input
                  type="checkbox"
                  id={segment.id}
                  checked={formData.recipient_segments.includes(segment.id)}
                  onChange={(e) => handleSegmentChange(segment.id, e.target.checked)}
                  className="mr-2"
                />
                <div className="flex-1">
                  <label htmlFor={segment.id} className="text-sm font-medium cursor-pointer">
                    {segment.label}
                  </label>
                  <div className="text-xs text-gray-500">
                    {segment.description} ({segment.estimatedCount} members)
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.recipient_segments && (
            <p className="text-red-500 text-sm mt-1">{errors.recipient_segments}</p>
          )}
          
          {estimatedRecipients > 0 && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <p className="text-sm text-blue-800">
                Estimated Recipients: <strong>{estimatedRecipients}</strong>
              </p>
            </div>
          )}
        </div>

        {/* Email Settings */}
        {(formData.type === 'email_campaign' || formData.type === 'newsletter' || formData.type === 'direct_email') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                From Email
              </label>
              <Input
                type="email"
                value={formData.from_email}
                onChange={(e) => handleInputChange('from_email', e.target.value)}
                placeholder="noreply@charity.org"
                className={errors.from_email ? 'border-red-500' : ''}
              />
              {errors.from_email && (
                <p className="text-red-500 text-sm mt-1">{errors.from_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Reply To Email
              </label>
              <Input
                type="email"
                value={formData.reply_to_email}
                onChange={(e) => handleInputChange('reply_to_email', e.target.value)}
                placeholder="contact@charity.org"
                className={errors.reply_to_email ? 'border-red-500' : ''}
              />
              {errors.reply_to_email && (
                <p className="text-red-500 text-sm mt-1">{errors.reply_to_email}</p>
              )}
            </div>
          </div>
        )}

        {/* Scheduling */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Schedule For Later (Optional)
          </label>
          <Input
            type="datetime-local"
            value={formData.scheduled_for}
            onChange={(e) => handleInputChange('scheduled_for', e.target.value)}
            className={errors.scheduled_for ? 'border-red-500' : ''}
          />
          {errors.scheduled_for && (
            <p className="text-red-500 text-sm mt-1">{errors.scheduled_for}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">
            Leave empty to save as draft
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags
          </label>
          <Input
            value={formData.tags}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            placeholder="fundraising, newsletter, urgent (comma-separated)"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (communication ? 'Update Communication' : 'Create Communication')}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}