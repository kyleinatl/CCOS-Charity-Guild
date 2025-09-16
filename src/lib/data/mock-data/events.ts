export const mockEventsData = {
  upcomingEvents: [
    {
      id: 1,
      title: 'Annual Gala 2025',
      description: 'Our biggest fundraising event of the year featuring dinner, entertainment, and auctions.',
      date: '2025-10-15',
      time: '7:00 PM',
      endTime: '11:00 PM',
      location: 'Grand Ballroom Hotel',
      address: '456 Event Plaza, Downtown',
      capacity: 200,
      currentRegistrations: 156,
      registrationFee: 150,
      registrationStatus: 'registered',
      category: 'fundraising',
      organizer: 'Events Team',
      contactEmail: 'events@ccoscharityguild.org',
      status: 'published'
    },
    {
      id: 2,
      title: 'Community Volunteer Day',
      description: 'Join us for a day of community service and making a difference in our local area.',
      date: '2025-09-28',
      time: '9:00 AM',
      endTime: '4:00 PM',
      location: 'Community Center',
      address: '789 Community St, Anytown',
      capacity: 50,
      currentRegistrations: 32,
      registrationFee: 0,
      registrationStatus: 'not_registered',
      category: 'volunteer',
      organizer: 'Volunteer Coordinator',
      contactEmail: 'volunteer@ccoscharityguild.org',
      status: 'published'
    },
    {
      id: 3,
      title: 'Monthly Member Meetup',
      description: 'Virtual networking and updates session for all members.',
      date: '2025-09-25',
      time: '6:30 PM',
      endTime: '8:00 PM',
      location: 'Virtual Event',
      address: 'Online via Zoom',
      capacity: 100,
      currentRegistrations: 45,
      registrationFee: 0,
      registrationStatus: 'registered',
      category: 'networking',
      organizer: 'Member Relations',
      contactEmail: 'members@ccoscharityguild.org',
      status: 'published'
    },
    {
      id: 4,
      title: 'Youth Education Workshop',
      description: 'Educational workshop focused on youth development and mentorship.',
      date: '2025-10-05',
      time: '2:00 PM',
      endTime: '5:00 PM',
      location: 'Education Center',
      address: '321 Learning Ave, Anytown',
      capacity: 30,
      currentRegistrations: 18,
      registrationFee: 25,
      registrationStatus: 'not_registered',
      category: 'education',
      organizer: 'Education Team',
      contactEmail: 'education@ccoscharityguild.org',
      status: 'published'
    }
  ],
  pastEvents: [
    {
      id: 5,
      title: 'Summer Charity Run',
      description: '5K charity run that raised funds for local health initiatives.',
      date: '2025-07-20',
      time: '8:00 AM',
      endTime: '12:00 PM',
      location: 'City Park',
      address: '123 Park Rd, Anytown',
      totalRaised: 5500,
      participantCount: 85,
      registrationStatus: 'attended',
      category: 'fundraising'
    },
    {
      id: 6,
      title: 'Spring Volunteer Fair',
      description: 'Volunteer opportunity fair connecting members with local organizations.',
      date: '2025-04-15',
      time: '10:00 AM',
      endTime: '3:00 PM',
      location: 'Town Hall',
      address: '555 Main St, Anytown',
      participantCount: 120,
      registrationStatus: 'attended',
      category: 'volunteer'
    }
  ],
  registrationHistory: [
    {
      eventId: 1,
      registrationDate: '2025-09-05T14:30:00Z',
      status: 'confirmed',
      ticketType: 'regular',
      amount: 150
    },
    {
      eventId: 3,
      registrationDate: '2025-09-01T09:15:00Z',
      status: 'confirmed',
      ticketType: 'free',
      amount: 0
    },
    {
      eventId: 5,
      registrationDate: '2025-07-10T16:20:00Z',
      status: 'attended',
      ticketType: 'participant',
      amount: 35
    }
  ],
  eventStats: {
    totalEventsAttended: 5,
    upcomingRegistrations: 2,
    totalAmountSpent: 185,
    favoriteCategory: 'fundraising'
  }
};