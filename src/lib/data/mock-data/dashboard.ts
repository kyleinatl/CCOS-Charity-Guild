export const mockDashboardData = {
  stats: {
    totalDonated: 1250,
    donationCount: 8,
    eventsAttended: 5,
    messagesReceived: 12,
    engagementScore: 85,
    memberSince: '2024-01-15',
  },
  recentDonations: [
    {
      id: 1,
      amount: 250,
      date: '2025-09-10',
      campaign: 'General Fund',
      method: 'Credit Card',
      status: 'completed'
    },
    {
      id: 2,
      amount: 100,
      date: '2025-08-15',
      campaign: 'Education Program',
      method: 'PayPal',
      status: 'completed'
    },
    {
      id: 3,
      amount: 75,
      date: '2025-07-22',
      campaign: 'Community Outreach',
      method: 'Credit Card',
      status: 'completed'
    }
  ],
  upcomingEvents: [
    {
      id: 1,
      title: 'Annual Gala 2025',
      date: '2025-10-15',
      time: '7:00 PM',
      location: 'Grand Ballroom',
      registrationStatus: 'registered',
      fee: 150
    },
    {
      id: 2,
      title: 'Community Volunteer Day',
      date: '2025-09-28',
      time: '9:00 AM',
      location: 'Community Center',
      registrationStatus: 'not_registered',
      fee: 0
    },
    {
      id: 3,
      title: 'Monthly Member Meetup',
      date: '2025-09-25',
      time: '6:30 PM',
      location: 'Virtual Event',
      registrationStatus: 'registered',
      fee: 0
    }
  ],
  recentMessages: [
    {
      id: 1,
      subject: 'Welcome to Gold Tier!',
      preview: 'Congratulations on reaching Gold tier status...',
      date: '2025-09-12',
      read: false,
      type: 'achievement'
    },
    {
      id: 2,
      subject: 'Monthly Newsletter',
      preview: 'Check out this month\'s highlights and upcoming events...',
      date: '2025-09-01',
      read: true,
      type: 'newsletter'
    },
    {
      id: 3,
      subject: 'Donation Receipt',
      preview: 'Thank you for your recent donation of $250...',
      date: '2025-08-15',
      read: true,
      type: 'receipt'
    }
  ],
  tierProgress: {
    currentTier: 'gold',
    nextTier: 'platinum',
    currentAmount: 1250,
    nextTierAmount: 2500,
    progressPercentage: 50
  }
};