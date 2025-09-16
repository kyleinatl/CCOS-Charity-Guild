'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { MemberPortalLayout } from '@/components/layout/member-portal-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DonationForm from '@/components/payments/donation-form';
import {
  DollarSign,
  Heart,
  Plus,
  Clock,
  CreditCard,
  Calendar,
} from 'lucide-react';

const quickDonationAmounts = [25, 50, 100, 250];

export default function PortalDonationPage() {
  const { user } = useAuth();
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number | undefined>();
  const [selectedDesignation, setSelectedDesignation] = useState<string | undefined>();

  const handleQuickDonation = (amount: number, designation: string = 'General Fund') => {
    setSelectedAmount(amount);
    setSelectedDesignation(designation);
    setShowDonationForm(true);
  };

  const handleDonationSuccess = (donation: any) => {
    console.log('Donation successful:', donation);
    setShowDonationForm(false);
    setSelectedAmount(undefined);
    setSelectedDesignation(undefined);
    // Here you could show a success message, refresh data, etc.
  };

  if (showDonationForm) {
    return (
      <MemberPortalLayout>
        <div className="container mx-auto p-6">
          <DonationForm
            memberId={user?.id}
            preselectedAmount={selectedAmount}
            preselectedDesignation={selectedDesignation}
            onSuccess={handleDonationSuccess}
            onCancel={() => setShowDonationForm(false)}
          />
        </div>
      </MemberPortalLayout>
    );
  }

  return (
    <MemberPortalLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Make a Donation</h1>
            <p className="text-gray-600 mt-1">
              Support our mission with a secure online donation
            </p>
          </div>
          <Button
            onClick={() => setShowDonationForm(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Custom Donation
          </Button>
        </div>

        {/* Quick Donation Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickDonationAmounts.map((amount) => (
            <Card key={amount} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  ${amount}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  One-time donation
                </p>
                <Button
                  onClick={() => handleQuickDonation(amount)}
                  className="w-full"
                >
                  Donate ${amount}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Fund Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Choose Your Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'General Fund',
                  description: 'Support our overall mission and operations',
                  icon: '🏛️',
                  suggested: 100,
                },
                {
                  title: 'Education Program',
                  description: 'Fund educational initiatives and scholarships',
                  icon: '📚',
                  suggested: 75,
                },
                {
                  title: 'Community Outreach',
                  description: 'Support local community programs and events',
                  icon: '🤝',
                  suggested: 50,
                },
                {
                  title: 'Emergency Relief Fund',
                  description: 'Help those in urgent need during crises',
                  icon: '🆘',
                  suggested: 200,
                },
                {
                  title: 'Youth Programs',
                  description: 'Invest in the next generation through youth programs',
                  icon: '👥',
                  suggested: 150,
                },
                {
                  title: 'Healthcare Initiative',
                  description: 'Support healthcare access and wellness programs',
                  icon: '🏥',
                  suggested: 125,
                },
              ].map((fund) => (
                <div
                  key={fund.title}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => handleQuickDonation(fund.suggested, fund.title)}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{fund.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {fund.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {fund.description}
                      </p>
                      <Button size="sm" variant="outline">
                        Donate ${fund.suggested}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recurring Donations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              Recurring Donations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-green-50 rounded-lg">
                <Calendar className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Monthly Giving
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Provide steady support with automatic monthly donations
                </p>
                <Button
                  onClick={() => {
                    setSelectedAmount(50);
                    setShowDonationForm(true);
                  }}
                  variant="outline"
                  className="border-green-300 text-green-700 hover:bg-green-50"
                >
                  Set Up Monthly Gift
                </Button>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <Clock className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Quarterly Giving
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Make a larger impact with quarterly contributions
                </p>
                <Button
                  onClick={() => {
                    setSelectedAmount(150);
                    setShowDonationForm(true);
                  }}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  Set Up Quarterly Gift
                </Button>
              </div>

              <div className="text-center p-6 bg-purple-50 rounded-lg">
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Annual Giving
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Make one significant gift that lasts the whole year
                </p>
                <Button
                  onClick={() => {
                    setSelectedAmount(500);
                    setShowDonationForm(true);
                  }}
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  Set Up Annual Gift
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Security */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-8 text-center">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Secure Payment Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">100% Tax Deductible</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-600">Instant Receipt</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MemberPortalLayout>
  );
}