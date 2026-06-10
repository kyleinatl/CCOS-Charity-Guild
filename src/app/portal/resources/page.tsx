'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
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
  id: string;
  title: string;
  document_type: 'minutes' | 'form' | 'policy' | 'other';
  created_at: string;
  description?: string;
  file_name?: string;
  file_url?: string | null;
}

function MemberResourcesContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [uploadForm, setUploadForm] = useState({
    title: '',
    document_type: 'minutes',
    description: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    // Check authentication - redirect if not logged in
    if (!user) {
      router.push('/auth/login?redirect=/portal/resources');
      return;
    }

    const loadDocuments = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/portal/documents', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Unable to load documents');
        }

        const data = await response.json();
        setDocuments(data.documents || []);
        setError('');
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load documents');
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    loadDocuments();
  }, [user, router]);

  const categories = [
    { id: 'all', label: 'All Documents', icon: FolderOpen },
    { id: 'minutes', label: 'Board Minutes', icon: FileText },
    { id: 'form', label: 'Forms', icon: File },
    { id: 'policy', label: 'Policies', icon: Shield },
    { id: 'other', label: 'Other', icon: FolderOpen },
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.document_type === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (doc: Document) => {
    if (doc.file_url) {
      window.open(doc.file_url, '_blank', 'noopener,noreferrer');
    }
  };

  const canUpload = user?.app_metadata?.role === 'admin_role' || user?.app_metadata?.role === 'treasurer_role';

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadMessage('Choose a file to upload.');
      return;
    }

    try {
      setUploading(true);
      setUploadMessage('');

      const payload = new FormData();
      payload.append('title', uploadForm.title);
      payload.append('document_type', uploadForm.document_type);
      payload.append('description', uploadForm.description);
      payload.append('file', selectedFile);

      const response = await fetch('/api/portal/documents', {
        method: 'POST',
        body: payload,
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.error || 'Upload failed');
      }

      setUploadForm({ title: '', document_type: 'minutes', description: '' });
      setSelectedFile(null);
      setUploadMessage('Document uploaded successfully.');

      const refreshResponse = await fetch('/api/portal/documents', { cache: 'no-store' });
      const refreshData = await refreshResponse.json();
      setDocuments(refreshData.documents || []);
    } catch (uploadError) {
      setUploadMessage(uploadError instanceof Error ? uploadError.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
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

      {canUpload && (
        <Card className="border-sky-200 bg-white/90 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg text-sky-800">Upload a New Document</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpload} className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <Input
                  value={uploadForm.title}
                  onChange={(e) => setUploadForm((current) => ({ ...current, title: e.target.value }))}
                  placeholder="Board Meeting Minutes - June 2026"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Document Type</label>
                <select
                  value={uploadForm.document_type}
                  onChange={(e) => setUploadForm((current) => ({ ...current, document_type: e.target.value }))}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="minutes">Board Minutes</option>
                  <option value="form">Form</option>
                  <option value="policy">Policy</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">File</label>
                <Input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <Input
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm((current) => ({ ...current, description: e.target.value }))}
                  placeholder="Short description of what this file contains"
                />
              </div>

              {uploadMessage && (
                <div className="md:col-span-2 text-sm text-sky-700">
                  {uploadMessage}
                </div>
              )}

              <div className="md:col-span-2 flex justify-end">
                <Button type="submit" disabled={uploading} className="bg-sky-600 hover:bg-sky-700">
                  {uploading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 text-sm text-amber-800">{error}</CardContent>
        </Card>
      )}

      {/* Documents List */}
      <div className="grid gap-3 sm:gap-4 w-full">
        {filteredDocuments.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
              <p className="text-gray-600">
                This library is ready for board minutes, forms, and policies as soon as they are uploaded.
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
                        <Badge className={getTypeColor(doc.document_type)}>
                          {getTypeLabel(doc.document_type)}
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
                          {formatDate(doc.created_at)}
                        </span>
                        <span className="flex items-center">
                          <File className="h-4 w-4 mr-1" />
                          {doc.file_name || 'Uploaded file'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownload(doc)}
                    className="w-full sm:w-auto sm:ml-0 flex items-center justify-center flex-shrink-0 text-sm"
                    size="sm"
                    disabled={!doc.file_url}
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
              href="/portal/donate"
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
  return <MemberResourcesContent />;
}
