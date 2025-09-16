export const mockProfileData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street',
    city: 'Anytown',
    state: 'CA',
    zipCode: '12345',
    joinDate: '2024-01-15',
  },
  membershipInfo: {
    tier: 'gold',
    totalDonated: 1250,
    engagementScore: 85,
    eventsAttended: 5,
    communicationsReceived: 24,
  },
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    donationReceipts: true,
    newsletter: true,
    communicationFrequency: 'weekly',
  },
  activityHistory: [
    {
      id: 1,
      type: 'donation',
      description: 'Donated $250 to General Fund',
      date: '2025-09-10',
      amount: 250,
    },
    {
      id: 2,
      type: 'event',
      description: 'Registered for Annual Gala 2025',
      date: '2025-09-05',
    },
    {
      id: 3,
      type: 'tier_upgrade',
      description: 'Upgraded to Gold tier',
      date: '2025-08-20',
    },
    {
      id: 4,
      type: 'profile',
      description: 'Updated contact information',
      date: '2025-08-15',
    },
  ]
};