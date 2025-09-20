'use client';

import { useState, useEffect } from 'react';
// import { useAuth } from '@/lib/auth/auth-context';
import { MemberPortalLayout } from '@/components/layout/member-portal-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { dataService, logDataSource } from '@/lib/data';
import {
  DollarSign,
  Download,
  Search,
  Calendar,
  CreditCard,
  Building,
  Banknote,
  TrendingUp,
  Receipt,
  Filter,
} from 'lucide-react';

function MemberDonations() {
  // Mock user for demo - in production this would come from useAuth()
  const user = {
    id: 'demo-user-id',
    member_profile: {
      first_name: 'John',
      last_name: 'Doe'
    }
  };
  const [donationsData, setDonationsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('all');

  useEffect(() => {
    const loadDonations = async () => {
      if (user?.id) {
        try {
          logDataSource('Donations Data');
          const data = await dataService.getDonations(user.id);
          setDonationsData(data);
        } catch (error) {
          console.error('Failed to load donations:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadDonations();
  }, [user?.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="h-4 w-4" />;
      case 'paypal': return <Building className="h-4 w-4" />;
      case 'bank_transfer': return <Banknote className="h-4 w-4" />;
      default: return <DollarSign className="h-4 w-4" />;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'credit_card': return 'Credit Card';
      case 'paypal': return 'PayPal';
      case 'bank_transfer': return 'Bank Transfer';
      default: return method;
    }
  };

  const filteredDonations = donationsData?.donations?.filter((donation: any) => {
    const matchesSearch = donation.campaign.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         donation.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = selectedYear === 'all' || 
                       new Date(donation.date).getFullYear().toString() === selectedYear;
    return matchesSearch && matchesYear;
  }) || [];

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-green-600">Loading your donations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!donationsData) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600">Failed to load donation data</p>
        </div>
      </div>
    );
  }

  const summary = donationsData.summary;

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-green-800">My Donations</h1>
          <p className="text-green-600 mt-1">
            Track your giving history and download receipts
          </p>
        </div>
        <Button className="flex items-center gap-2 w-fit sm:w-auto bg-green-600 hover:bg-green-700">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Total Donated
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{formatCurrency(summary.totalDonated)}</div>
            <p className="text-xs text-green-600">
              Lifetime contributions
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Donations
            </CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.donationCount}</div>
            <p className="text-xs text-muted-foreground">
              Individual donations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-emerald-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800">
              Average Donation
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900">{formatCurrency(summary.averageDonation)}</div>
            <p className="text-xs text-emerald-600">
              Per donation
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow bg-white/80 backdrop-blur-sm border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800">
              Last Donation
            </CardTitle>
            <Calendar className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-yellow-900">{formatDate(summary.lastDonation)}</div>
            <p className="text-xs text-yellow-600">
              Most recent
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
              <Input
                placeholder="Search donations by campaign or reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-green-200 focus:border-green-400"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="px-3 py-2 border border-green-300 rounded-md bg-white text-green-800 focus:border-green-500 w-full sm:w-auto"
              >
                <option value="all">All Years</option>
                {donationsData.yearlyStats.map((stat: any) => (
                  <option key={stat.year} value={stat.year}>
                    {stat.year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Donations List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-blue-600" />
            Donation History
            <Badge variant="outline" className="ml-2">
              {filteredDonations.length} donations
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDonations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Receipt className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No donations found matching your criteria</p>
              </div>
            ) : (
              filteredDonations.map((donation: any) => (
                <div key={donation.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-3 sm:mb-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                      {getMethodIcon(donation.method)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
                        <h4 className="font-semibold text-green-900">{donation.campaign}</h4>
                        <Badge variant="outline" className="text-xs w-fit border-green-200 text-green-800">
                          {getMethodLabel(donation.method)}
                        </Badge>
                      </div>
                      <div className="text-sm text-green-700 space-y-1">
                        <p>{formatDateTime(donation.date)}</p>
                        <p className="text-xs">Ref: {donation.reference}</p>
                        {donation.notes && (
                          <p className="text-xs italic">{donation.notes}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:text-right sm:items-center gap-2 sm:gap-4">
                    <div className="flex flex-col sm:items-end">
                      <div className="text-xl font-bold text-green-600">
                        {formatCurrency(donation.amount)}
                      </div>
                      <Badge 
                        variant={donation.status === 'completed' ? 'default' : 'outline'}
                        className="text-xs w-fit"
                      >
                        {donation.status}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-fit sm:w-auto"
                      onClick={() => {
                        // TODO: Implement receipt download
                        console.log('Download receipt:', donation.receipt_url);
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Receipt
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredDonations.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-700">
                  Showing {filteredDonations.length} of {donationsData.donations.length} donations
                </span>
                <div className="text-right">
                  <span className="text-green-700">Total: </span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(filteredDonations.reduce((sum: number, donation: any) => sum + donation.amount, 0))}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Yearly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            Yearly Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {donationsData.yearlyStats.map((stat: any) => (
              <div key={stat.year} className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold text-lg">{stat.year}</h4>
                  <Badge variant="outline">{stat.count} donations</Badge>
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {formatCurrency(stat.amount)}
                </div>
                <div className="text-sm text-green-600">
                  Average: {formatCurrency(stat.amount / stat.count)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MemberDonationsPage() {
  return (
    <MemberPortalLayout>
      <MemberDonations />
    </MemberPortalLayout>
  );
}