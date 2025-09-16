export const mockMessagesData = {
  messages: [
    {
      id: 1,
      subject: 'Welcome to Gold Tier!',
      preview: 'Congratulations on reaching Gold tier status. You now have access to exclusive benefits...',
      content: `
        <h2>Congratulations on reaching Gold Tier!</h2>
        <p>Dear John,</p>
        <p>We are thrilled to inform you that you have achieved Gold tier status in our membership program. This milestone reflects your continued support and dedication to our cause.</p>
        
        <h3>Your New Gold Tier Benefits Include:</h3>
        <ul>
          <li>Priority event registration</li>
          <li>Exclusive quarterly updates from our leadership team</li>
          <li>Special recognition at annual events</li>
          <li>Access to Gold member-only networking events</li>
          <li>Personalized impact reports</li>
        </ul>
        
        <p>Thank you for your continued support. Together, we're making a real difference in our community.</p>
        
        <p>Best regards,<br>The CCOS Guild Team</p>
      `,
      date: '2025-09-12T10:30:00Z',
      read: false,
      type: 'achievement',
      sender: 'Member Relations Team',
      priority: 'high',
      tags: ['membership', 'achievement', 'benefits']
    },
    {
      id: 2,
      subject: 'Monthly Newsletter - September 2025',
      preview: 'Check out this month\'s highlights, upcoming events, and impact stories from our community...',
      content: `
        <h2>September 2025 Newsletter</h2>
        <p>Dear Members,</p>
        
        <h3>This Month's Highlights</h3>
        <ul>
          <li>Successfully raised $15,000 for local education programs</li>
          <li>Welcomed 23 new members to our community</li>
          <li>Completed 3 major volunteer projects</li>
        </ul>
        
        <h3>Upcoming Events</h3>
        <ul>
          <li>Community Volunteer Day - September 28th</li>
          <li>Annual Gala 2025 - October 15th</li>
          <li>Youth Education Workshop - October 5th</li>
        </ul>
        
        <h3>Impact Story</h3>
        <p>Thanks to your donations, we were able to provide school supplies to over 200 children in our local community...</p>
        
        <p>Thank you for your continued support!</p>
      `,
      date: '2025-09-01T08:00:00Z',
      read: true,
      type: 'newsletter',
      sender: 'Communications Team',
      priority: 'normal',
      tags: ['newsletter', 'updates', 'events']
    },
    {
      id: 3,
      subject: 'Donation Receipt - Transaction #TXN-2025-0910-001',
      preview: 'Thank you for your recent donation of $250 to the General Fund. Your receipt and tax information...',
      content: `
        <h2>Donation Receipt</h2>
        <p>Dear John Doe,</p>
        
        <p>Thank you for your generous donation to CCOS Charity Guild. Your support makes a real difference in our community.</p>
        
        <h3>Donation Details</h3>
        <table style="border-collapse: collapse; width: 100%;">
          <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Date:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">September 10, 2025</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Amount:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">$250.00</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Campaign:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">General Fund</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Method:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">Credit Card</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 8px;"><strong>Reference:</strong></td><td style="border: 1px solid #ddd; padding: 8px;">TXN-2025-0910-001</td></tr>
        </table>
        
        <p><strong>Tax Information:</strong> This donation is tax-deductible. Our tax ID is 12-3456789.</p>
        
        <p>Thank you for your generosity!</p>
      `,
      date: '2025-09-10T11:00:00Z',
      read: true,
      type: 'receipt',
      sender: 'Finance Team',
      priority: 'normal',
      tags: ['receipt', 'donation', 'tax'],
      attachments: [
        {
          name: 'donation_receipt_TXN-2025-0910-001.pdf',
          url: '/receipts/don_001.pdf',
          type: 'application/pdf',
          size: '245 KB'
        }
      ]
    },
    {
      id: 4,
      subject: 'Event Reminder: Annual Gala 2025',
      preview: 'Just a friendly reminder that the Annual Gala 2025 is coming up on October 15th...',
      content: `
        <h2>Event Reminder: Annual Gala 2025</h2>
        <p>Dear John,</p>
        
        <p>This is a friendly reminder that you're registered for our Annual Gala 2025!</p>
        
        <h3>Event Details</h3>
        <ul>
          <li><strong>Date:</strong> October 15, 2025</li>
          <li><strong>Time:</strong> 7:00 PM - 11:00 PM</li>
          <li><strong>Location:</strong> Grand Ballroom Hotel</li>
          <li><strong>Address:</strong> 456 Event Plaza, Downtown</li>
          <li><strong>Dress Code:</strong> Formal</li>
        </ul>
        
        <h3>What to Expect</h3>
        <ul>
          <li>Cocktail hour and networking</li>
          <li>Three-course dinner</li>
          <li>Live entertainment</li>
          <li>Silent auction</li>
          <li>Impact presentation</li>
        </ul>
        
        <p>We're looking forward to seeing you there!</p>
      `,
      date: '2025-09-08T15:30:00Z',
      read: true,
      type: 'event_reminder',
      sender: 'Events Team',
      priority: 'normal',
      tags: ['event', 'reminder', 'gala']
    },
    {
      id: 5,
      subject: 'New Volunteer Opportunity Available',
      preview: 'We have an exciting new volunteer opportunity that matches your interests and skills...',
      content: `
        <h2>New Volunteer Opportunity</h2>
        <p>Dear John,</p>
        
        <p>Based on your interests and previous volunteer work, we think you'd be perfect for this new opportunity!</p>
        
        <h3>Opportunity: Youth Mentorship Program</h3>
        <ul>
          <li><strong>Time Commitment:</strong> 2 hours per week</li>
          <li><strong>Duration:</strong> 6 months</li>
          <li><strong>Location:</strong> Local schools and community centers</li>
          <li><strong>Requirements:</strong> Background check (we'll help with this)</li>
        </ul>
        
        <p>This program pairs adult mentors with local youth to provide guidance, support, and encouragement in their academic and personal development.</p>
        
        <p>Interested? Reply to this message or contact our volunteer coordinator at volunteer@ccoscharityguild.org</p>
      `,
      date: '2025-09-05T12:00:00Z',
      read: false,
      type: 'volunteer_opportunity',
      sender: 'Volunteer Coordinator',
      priority: 'normal',
      tags: ['volunteer', 'opportunity', 'youth']
    }
  ],
  summary: {
    totalMessages: 5,
    unreadCount: 2,
    categories: {
      achievement: 1,
      newsletter: 1,
      receipt: 1,
      event_reminder: 1,
      volunteer_opportunity: 1
    },
    recentActivity: {
      messagesThisWeek: 2,
      messagesThisMonth: 5
    }
  },
  preferences: {
    emailNotifications: true,
    pushNotifications: false,
    frequency: 'immediate',
    categories: {
      newsletters: true,
      events: true,
      donations: true,
      volunteer: true,
      achievements: true
    }
  }
};