'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Member, Donation, EventRegistration } from '@/types';
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Award,
  Edit,
  Trash2,
  ExternalLink
} from 'lucide-react';

interface MemberDetailsProps {
  member: Member;
  onClose: () => void;
  onEdit: (member: Member) => void;
  onDelete?: (member: Member) => void;
}

interface MemberWithDetails extends Member {
  donations?: Donation[];
  event_registrations?: EventRegistration[];
}

export default function MemberDetails({ member, onClose, onEdit, onDelete }: MemberDetailsProps) {
  const [memberDetails, setMemberDetails] = useState<MemberWithDetails>(member);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMemberDetails();
  }, [member.id]);

  const fetchMemberDetails = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/members/${member.id}`);
      if (response.ok) {
        const data = await response.json();
        setMemberDetails(data.member);
      }
    } catch (error) {
      console.error('Error fetching member details:', error);
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

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-100 text-amber-800';
      case 'silver': return 'bg-gray-100 text-gray-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this member? This action cannot be undone.')) {
      onDelete(member);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-700">
                  {member.first_name[0]}{member.last_name[0]}
                </span>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  {member.first_name} {member.last_name}
                </h2>
                <p className="text-gray-600">{member.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTierColor(member.tier)}`}>
                    <Award className="w-4 h-4 mr-1" />
                    {member.tier.charAt(0).toUpperCase() + member.tier.slice(1)} Member
                  </span>
                  <span className="text-sm text-gray-500">
                    Member since {formatDate(member.member_since)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
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
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Total Donated</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(member.total_donated)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Events Attended</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {memberDetails.event_registrations?.filter(reg => reg.status === 'attended').length || 0}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <User className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-600">Engagement Score</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {member.engagement_score}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recent Donations */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : memberDetails.donations && memberDetails.donations.length > 0 ? (
                  <div className="space-y-3">
                    {memberDetails.donations.slice(0, 5).map((donation: any) => (
                      <div key={donation.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {formatCurrency(donation.amount)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {donation.designation} • {formatDate(donation.donation_date)}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          {donation.method}
                        </span>
                      </div>
                    ))}
                    {memberDetails.donations.length > 5 && (
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View All Donations ({memberDetails.donations.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No donations found</p>
                )}
              </Card>

              {/* Event Registrations */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event History</h3>
                {loading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ) : memberDetails.event_registrations && memberDetails.event_registrations.length > 0 ? (
                  <div className="space-y-3">
                    {memberDetails.event_registrations.slice(0, 5).map((registration: any) => (
                      <div key={registration.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {registration.events?.title}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(registration.events?.event_date)} • {registration.events?.location}
                          </p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          registration.status === 'attended' 
                            ? 'bg-green-100 text-green-800'
                            : registration.status === 'confirmed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {registration.status}
                        </span>
                      </div>
                    ))}
                    {memberDetails.event_registrations.length > 5 && (
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View All Events ({memberDetails.event_registrations.length})
                      </Button>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No event registrations found</p>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-900">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{member.phone}</span>
                    </div>
                  )}
                  {(member.address_line1 || member.city || member.state) && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="text-sm text-gray-900">
                        {member.address_line1 && <div>{member.address_line1}</div>}
                        {member.address_line2 && <div>{member.address_line2}</div>}
                        {(member.city || member.state || member.zip_code) && (
                          <div>
                            {[member.city, member.state, member.zip_code].filter(Boolean).join(', ')}
                          </div>
                        )}
                        {member.country && member.country !== 'United States' && (
                          <div>{member.country}</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Professional Information */}
              {(member.occupation || member.employer) && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional</h3>
                  <div className="space-y-2">
                    {member.occupation && (
                      <div>
                        <p className="text-sm text-gray-600">Occupation</p>
                        <p className="text-sm text-gray-900">{member.occupation}</p>
                      </div>
                    )}
                    {member.employer && (
                      <div>
                        <p className="text-sm text-gray-600">Employer</p>
                        <p className="text-sm text-gray-900">{member.employer}</p>
                      </div>
                    )}
                  </div>
                </Card>
              )}

              {/* Interests */}
              {member.interests && member.interests.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {member.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Communication Preferences */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Email Notifications</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.email_subscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.email_subscribed ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SMS Notifications</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.sms_subscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.sms_subscribed ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Newsletter</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      member.newsletter_subscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {member.newsletter_subscribed ? 'Subscribed' : 'Unsubscribed'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Notes */}
              {member.notes && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{member.notes}</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}