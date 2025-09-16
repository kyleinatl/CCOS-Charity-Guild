export const mockDonationsData = {
  donations: [
    {
      id: 'don_001',
      amount: 250,
      date: '2025-09-10T10:30:00Z',
      campaign: 'General Fund',
      method: 'credit_card',
      status: 'completed',
      reference: 'TXN-2025-0910-001',
      receipt_url: '/receipts/don_001.pdf',
      notes: 'Monthly contribution'
    },
    {
      id: 'don_002',
      amount: 100,
      date: '2025-08-15T14:20:00Z',
      campaign: 'Education Program',
      method: 'paypal',
      status: 'completed',
      reference: 'TXN-2025-0815-002',
      receipt_url: '/receipts/don_002.pdf',
      notes: 'Supporting local education initiatives'
    },
    {
      id: 'don_003',
      amount: 75,
      date: '2025-07-22T09:15:00Z',
      campaign: 'Community Outreach',
      method: 'credit_card',
      status: 'completed',
      reference: 'TXN-2025-0722-003',
      receipt_url: '/receipts/don_003.pdf',
      notes: ''
    },
    {
      id: 'don_004',
      amount: 500,
      date: '2025-06-30T16:45:00Z',
      campaign: 'Emergency Relief Fund',
      method: 'bank_transfer',
      status: 'completed',
      reference: 'TXN-2025-0630-004',
      receipt_url: '/receipts/don_004.pdf',
      notes: 'Emergency donation for disaster relief'
    },
    {
      id: 'don_005',
      amount: 150,
      date: '2025-05-18T11:30:00Z',
      campaign: 'Youth Programs',
      method: 'credit_card',
      status: 'completed',
      reference: 'TXN-2025-0518-005',
      receipt_url: '/receipts/don_005.pdf',
      notes: 'Supporting youth development'
    },
    {
      id: 'don_006',
      amount: 200,
      date: '2025-04-12T13:20:00Z',
      campaign: 'Healthcare Initiative',
      method: 'paypal',
      status: 'completed',
      reference: 'TXN-2025-0412-006',
      receipt_url: '/receipts/don_006.pdf',
      notes: 'Healthcare access for underserved communities'
    }
  ],
  summary: {
    totalDonated: 1275,
    donationCount: 6,
    averageDonation: 212.5,
    lastDonation: '2025-09-10T10:30:00Z',
    favoriteMethod: 'credit_card',
    topCampaign: 'General Fund'
  },
  yearlyStats: [
    { year: '2025', amount: 1275, count: 6 },
    { year: '2024', amount: 850, count: 4 },
  ]
};