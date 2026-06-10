export const USE_MOCK_DATA = false;
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

type ApiOptions = RequestInit & { headers?: Record<string, string> };

class DataService {
  private async apiCall(endpoint: string, options?: ApiOptions) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(`API call failed: ${response.status} ${message}`);
    }

    return response.json();
  }

  private isUuid(value: string) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
  }

  private async resolveMemberId(userId: string) {
    if (this.isUuid(userId)) {
      return userId;
    }

    const membersResponse = await this.apiCall('/api/members?limit=1&page=1');
    const fallbackMemberId = membersResponse?.members?.[0]?.id;

    if (!fallbackMemberId) {
      throw new Error('No member record available to load portal data.');
    }

    return fallbackMemberId;
  }

  private mapDonation(donation: any) {
    return {
      id: donation.id,
      amount: donation.amount || 0,
      date: donation.donation_date,
      campaign: donation.designation || 'General Fund',
      method: donation.method || 'credit_card',
      status: donation.payment_status || 'completed',
      reference: donation.receipt_number || donation.transaction_id || donation.id,
      notes: donation.notes || '',
      receipt_url: '',
    };
  }

  async getDashboardData(userId: string) {
    const memberId = await this.resolveMemberId(userId);

    const [memberResponse, donationsResponse, eventsResponse, communicationsResponse] = await Promise.all([
      this.apiCall(`/api/members/${memberId}`),
      this.apiCall(`/api/donations?member_id=${memberId}&limit=25&page=1`),
      this.apiCall('/api/events?status=upcoming&limit=6&page=1'),
      this.apiCall('/api/communications?limit=6&page=1'),
    ]);

    const member = memberResponse?.member || memberResponse;
    const donations = (donationsResponse?.donations || []).map((d: any) => this.mapDonation(d));
    const events = eventsResponse?.events || [];
    const communications = communicationsResponse?.communications || [];

    const totalDonated = donations.reduce((sum: number, donation: any) => sum + donation.amount, 0);

    const thresholds: Record<string, number> = {
      bronze: 1000,
      silver: 5000,
      gold: 10000,
      platinum: 25000,
    };

    const currentTier = member?.tier || 'bronze';
    const currentAmount = member?.total_donated || totalDonated;
    const nextTier = currentTier === 'bronze' ? 'silver' : currentTier === 'silver' ? 'gold' : currentTier === 'gold' ? 'platinum' : 'platinum';
    const nextTierAmount = thresholds[currentTier] || thresholds.bronze;

    return {
      stats: {
        totalDonated,
        donationCount: donations.length,
        eventsAttended: 0,
        messagesReceived: communications.length,
        engagementScore: member?.engagement_score || 0,
        memberSince: member?.created_at || new Date().toISOString(),
      },
      recentDonations: donations.slice(0, 5),
      upcomingEvents: events.slice(0, 5).map((event: any) => ({
        id: event.id,
        title: event.name,
        date: event.start_date,
        time: new Date(event.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        location: event.venue_name || (event.is_virtual ? 'Virtual' : 'TBD'),
        registrationStatus: 'available',
        fee: event.registration_fee || 0,
      })),
      recentMessages: communications.slice(0, 5).map((message: any) => ({
        id: message.id,
        subject: message.subject || 'Guild Update',
        preview: (message.content || '').replace(/<[^>]*>/g, '').slice(0, 120),
        date: message.created_at,
        read: false,
        type: message.type || 'announcement',
      })),
      tierProgress: {
        currentTier,
        nextTier,
        currentAmount,
        nextTierAmount,
        progressPercentage: Math.min(100, Math.round((currentAmount / nextTierAmount) * 100)),
      },
    };
  }

  async getProfileData(userId: string) {
    const memberId = await this.resolveMemberId(userId);

    const [memberResponse, donationsResponse] = await Promise.all([
      this.apiCall(`/api/members/${memberId}`),
      this.apiCall(`/api/donations?member_id=${memberId}&limit=20&page=1`),
    ]);

    const member = memberResponse?.member || memberResponse;
    const donations = donationsResponse?.donations || [];

    return {
      personalInfo: {
        firstName: member?.first_name || '',
        lastName: member?.last_name || '',
        email: member?.email || '',
        phone: member?.phone || '',
        address: member?.address_line1 || '',
        city: member?.city || '',
        state: member?.state || '',
        zipCode: member?.zip_code || '',
        joinDate: member?.created_at || new Date().toISOString(),
      },
      preferences: {
        emailNotifications: member?.email_subscribed ?? true,
        eventReminders: true,
        donationReceipts: true,
        newsletter: member?.newsletter_subscribed ?? true,
      },
      membershipInfo: {
        tier: member?.tier || 'bronze',
        totalDonated: member?.total_donated || 0,
        eventsAttended: 0,
        engagementScore: member?.engagement_score || 0,
      },
      activityHistory: donations.slice(0, 8).map((donation: any) => ({
        id: donation.id,
        type: 'donation',
        description: `Donation to ${donation.designation || 'General Fund'} (${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(donation.amount || 0)})`,
        date: donation.donation_date,
      })),
    };
  }

  async updateProfile(userId: string, updates: any) {
    const memberId = await this.resolveMemberId(userId);

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (updates.firstName !== undefined) payload.first_name = updates.firstName;
    if (updates.lastName !== undefined) payload.last_name = updates.lastName;
    if (updates.email !== undefined) payload.email = updates.email;
    if (updates.phone !== undefined) payload.phone = updates.phone;
    if (updates.address !== undefined) payload.address_line1 = updates.address;
    if (updates.city !== undefined) payload.city = updates.city;
    if (updates.state !== undefined) payload.state = updates.state;
    if (updates.zipCode !== undefined) payload.zip_code = updates.zipCode;

    return this.apiCall(`/api/members/${memberId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async getDonations(userId: string, filters?: Record<string, string>) {
    const memberId = await this.resolveMemberId(userId);
    const params = new URLSearchParams({ member_id: memberId, limit: '200', page: '1' });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }

    const response = await this.apiCall(`/api/donations?${params.toString()}`);
    const donations = (response?.donations || []).map((d: any) => this.mapDonation(d));

    const totalDonated = donations.reduce((sum: number, d: any) => sum + d.amount, 0);
    const donationCount = donations.length;
    const averageDonation = donationCount ? totalDonated / donationCount : 0;

    const yearlyMap = new Map<number, { year: number; amount: number; count: number }>();
    donations.forEach((donation: any) => {
      const year = new Date(donation.date).getFullYear();
      const existing = yearlyMap.get(year) || { year, amount: 0, count: 0 };
      existing.amount += donation.amount;
      existing.count += 1;
      yearlyMap.set(year, existing);
    });

    const yearlyStats = Array.from(yearlyMap.values()).sort((a, b) => b.year - a.year);

    return {
      donations,
      summary: {
        totalDonated,
        donationCount,
        averageDonation,
        lastDonation: donations[0]?.date || new Date().toISOString(),
      },
      yearlyStats,
    };
  }

  async getEvents(_userId: string, filters?: Record<string, string>) {
    const params = new URLSearchParams({ limit: '100', page: '1' });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }

    const response = await this.apiCall(`/api/events?${params.toString()}`);
    const events = (response?.events || []).map((event: any) => ({
      id: event.id,
      title: event.name,
      description: event.description || '',
      date: event.start_date,
      time: new Date(event.start_date).toISOString().slice(11, 16),
      location: event.venue_name || (event.is_virtual ? 'Virtual' : 'TBD'),
      category: event.event_type || 'fundraising',
      status: event.status || 'upcoming',
      attendees: event.confirmed_registrations || 0,
      maxAttendees: event.capacity || 0,
      price: event.registration_fee || 0,
      registered: false,
      featured: false,
    }));

    return { events };
  }

  async registerForEvent(userId: string, eventId: string) {
    const memberId = await this.resolveMemberId(userId);

    return this.apiCall(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify({ member_id: memberId, action: 'register' }),
    });
  }

  async getMessages(_userId: string, filters?: Record<string, string>) {
    const params = new URLSearchParams({ limit: '100', page: '1' });

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }

    const response = await this.apiCall(`/api/communications?${params.toString()}`);
    const messages = (response?.communications || []).map((communication: any) => ({
      id: communication.id,
      from: 'Guild Administration',
      subject: communication.subject || 'Guild Update',
      preview: (communication.content || '').replace(/<[^>]*>/g, '').slice(0, 150),
      date: communication.created_at,
      read: false,
      starred: false,
      category: communication.type || 'announcement',
    }));

    const categories = ['announcement', 'event', 'donation', 'volunteer'];

    return {
      messages,
      categories: [
        { id: 'all', name: 'All Messages', count: messages.length },
        ...categories.map((id) => ({
          id,
          name: id.charAt(0).toUpperCase() + id.slice(1),
          count: messages.filter((message: any) => message.category === id).length,
        })),
      ],
    };
  }

  async markMessageAsRead(_userId: string, _messageId: string) {
    return { success: true };
  }

  async getAnalytics(filters?: Record<string, string>) {
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.apiCall(`/api/analytics${queryParams}`);
  }

  async getDonation(id: string) {
    try {
      const data = await this.apiCall(`/api/donations/${id}`);
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async getMemberDonations(memberId: string) {
    try {
      const data = await this.apiCall(`/api/donations?member_id=${memberId}&limit=200&page=1`);
      return data?.donations || [];
    } catch (error) {
      console.error('Error fetching member donations:', error);
      return [];
    }
  }

  async updateMember(id: string, updates: any) {
    try {
      const data = await this.apiCall(`/api/members/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}

export const dataService = new DataService();

export const isMockDataEnabled = () => USE_MOCK_DATA;

export const logDataSource = (operation: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DataService] ${operation} using REAL data`);
  }
};
