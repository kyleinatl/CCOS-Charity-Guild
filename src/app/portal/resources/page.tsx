'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useAuth } from '@/lib/auth/auth-context';
import { MemberPortalLayout } from '@/components/layout/member-portal-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Download,
  Lock,
  Search,
  Calendar,
  FolderOpen,
  File,
  AlertCircle,
  Clock,
  Shield,
} from 'lucide-react';

interface Document {
  id: number;
  title: string;
  type: 'minutes' | 'form' | 'policy' | 'other';
  date: string;
  size: string;
  url: string;
  description?: string;
}

function MemberResourcesContent() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  // Mock user authentication - in production use useAuth()
  const user = {
    id: 'demo-user-id',
    email: 'john.doe@example.com',
    member_profile: {
      first_name: 'John',
      last_name: 'Doe',
      tier: 'gold',
    }
  };

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 500);

    // Check authentication - redirect if not logged in
    if (!user) {
      router.push('/auth/login?redirect=/portal/resources');
    }
  }, [user, router]);

  // Mock documents data - in production, fetch from database
  const documents: Document[] = [
    {
      id: 1,
      title: 'Board Meeting Minutes - January 2026',
      type: 'minutes',
      date: '2026-01-15',
      size: '245 KB',
      url: '/documents/minutes-jan-2026.pdf',
      description: 'Monthly board meeting minutes including financial reports and event planning'
    },
    {
      id: 2,
      title: 'Board Meeting Minutes - December 2025',
      type: 'minutes',
      date: '2025-12-18',
      size: '198 KB',
      url: '/documents/minutes-dec-2025.pdf',
      description: 'Year-end review and 2026 planning session'
    },
    {
      id: 3,
      title: 'Board Meeting Minutes - November 2025',
      type: 'minutes',
      date: '2025-11-20',
      size: '212 KB',
      url: '/documents/minutes-nov-2025.pdf',
      description: 'Hope Awards planning and grant allocation discussions'
    },
    {
      id: 4,
      title: 'Expense Reimbursement Form',
      type: 'form',
      date: '2026-01-01',
      size: '156 KB',
      url: '/documents/reimbursement-form.pdf',
      description: 'Standard form for member expense reimbursement requests'
    },
    {
      id: 5,
      title: 'Event Planning Request Form',
      type: 'form',
      date: '2026-01-01',
      size: '142 KB',
      url: '/documents/event-planning-form.pdf',
      description: 'Form for proposing new fundraising events or initiatives'
    },
    {
      id: 6,
      title: 'Volunteer Hours Log',
      type: 'form',
      date: '2026-01-01',
      size: '128 KB',
      url: '/documents/volunteer-hours-log.pdf',
      description: 'Track your volunteer hours for annual reporting'
    },
    {
      id: 7,
      title: 'Member Handbook 2026',
      type: 'policy',
      date: '2026-01-01',
      size: '1.2 MB',
      url: '/documents/member-handbook-2026.pdf',
      description: 'Complete guide to guild policies, procedures, and member benefits'
    },
    {
      id: 8,
      title: 'Code of Conduct',
      type: 'policy',
      date: '2024-06-01',
      size: '98 KB',
      url: '/documents/code-of-conduct.pdf',
      description: 'Guild code of conduct and ethical guidelines'
    },
    {
      id: 9,
      title: 'Grant Application Guidelines',
      type: 'policy',
      date: '2025-09-15',
      size: '324 KB',
      url: '/documents/grant-guidelines.pdf',
      description: 'Guidelines for nonprofits applying for guild grants'
    },
    {
      id: 10,
      title: '2025 Annual Report',
      type: 'other',
      date: '2026-01-10',
      size: '2.4 MB',
      url: '/documents/annual-report-2025.pdf',
      description: 'Complete annual report including financials and impact metrics'
    },
  ];

  const categories = [
    { id: 'all', label: 'All Documents', icon: FolderOpen },
    { id: 'minutes', label: 'Board Minutes', icon: FileText },
    { id: 'form', label: 'Forms', icon: File },
    { id: 'policy', label: 'Policies', icon: Shield },
    { id: 'other', label: 'Other', icon: FolderOpen },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.type === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (doc: Document) => {
    // In production, this would trigger actual file download
    console.log('Downloading:', doc.title);
    alert(`Download started: ${doc.title}\n\nIn production, this would download the actual file.`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'minutes': return 'bg-blue-100 text-blue-700';
      case 'form': return 'bg-sky-100 text-sky-700';
      case 'policy': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'minutes': return 'Minutes';
      case 'form': return 'Form';
      case 'policy': return 'Policy';
      default: return 'Document';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col space-y-3 sm:space-y-3 sm:space-y-4">
        <div className="flex items-start sm:items-center">
          <div className="w-full">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
              <Lock className="h-6 w-6 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
              <span className="truncate">Member Resources</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
              Access board minutes, forms, and member-only documents
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-3 sm:py-4">
            <div className="flex items-start space-x-2 sm:space-x-3">
              <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-blue-900">Protected Content</h3>
                <p className="text-xs sm:text-sm text-blue-700 mt-1">
                  This section contains confidential member documents and board materials. 
                  Please do not share these documents outside the organization.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="w-full">
        <CardContent className="p-3 sm:pt-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex items-center"
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {category.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <div className="grid gap-3 sm:gap-4 w-full">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
              <p className="text-gray-600">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow w-full">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FileText className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {doc.title}
                        </h3>
                        <Badge className={getTypeColor(doc.type)}>
                          {getTypeLabel(doc.type)}
                        </Badge>
                      </div>
                      {doc.description && (
                        <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3 break-words">
                          {doc.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(doc.date)}
                        </span>
                        <span className="flex items-center">
                          <File className="h-4 w-4 mr-1" />
                          {doc.size}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(doc)}
                    className="w-full sm:w-auto sm:ml-0 flex items-center justify-center flex-shrink-0 text-sm"
                    size="sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Quick Links */}
      <Card className="bg-gradient-to-r from-blue-50 to-sky-50">
        <CardHeader>
          <CardTitle className="text-lg">Quick Links</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/contact"
              className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-900 mb-1">Need Help?</h4>
              <p className="text-sm text-gray-600">Contact the board for assistance</p>
            </a>
            <a
              href="/portal"
              className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-900 mb-1">Member Dashboard</h4>
              <p className="text-sm text-gray-600">View your member portal</p>
            </a>
            <a
              href="/donate"
              className="p-4 bg-white rounded-lg hover:shadow-md transition-shadow"
            >
              <h4 className="font-semibold text-gray-900 mb-1">Make a Donation</h4>
              <p className="text-sm text-gray-600">Support our mission</p>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function MemberResourcesPage() {
  return (
    <MemberPortalLayout>
      <MemberResourcesContent />
    </MemberPortalLayout>
  );
}
