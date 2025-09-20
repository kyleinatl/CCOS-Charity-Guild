'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Send,
  Reply,
  User,
  Calendar,
  Search,
  Filter,
  Archive,
  Star,
  Clock,
  CheckCircle,
} from 'lucide-react';

// Mock messages data
const messages = [
  {
    id: 1,
    from: 'Guild Administration',
    subject: 'Welcome to the CCOS Charity Guild',
    preview: 'Thank you for joining our charity guild! Here are some important details to get you started...',
    date: '2025-09-15',
    read: false,
    starred: true,
    category: 'announcement',
  },
  {
    id: 2,
    from: 'Event Committee',
    subject: 'Annual Gala - Save the Date',
    preview: 'Our annual charity gala is scheduled for November 15th. We hope to see you there for an evening of...',
    date: '2025-09-12',
    read: true,
    starred: false,
    category: 'event',
  },
  {
    id: 3,
    from: 'Donation Committee',
    subject: 'Monthly Donation Summary',
    preview: 'Here is your monthly donation summary for August. Thank you for your continued support...',
    date: '2025-09-01',
    read: true,
    starred: false,
    category: 'donation',
  },
  {
    id: 4,
    from: 'Volunteer Coordinator',
    subject: 'Volunteer Opportunity - Atlanta Food Bank',
    preview: 'We have an exciting volunteer opportunity at the Atlanta Food Bank this Saturday...',
    date: '2025-08-28',
    read: false,
    starred: false,
    category: 'volunteer',
  },
];

const categories = [
  { id: 'all', name: 'All Messages', count: 4 },
  { id: 'announcement', name: 'Announcements', count: 1 },
  { id: 'event', name: 'Events', count: 1 },
  { id: 'donation', name: 'Donations', count: 1 },
  { id: 'volunteer', name: 'Volunteer', count: 1 },
];

export default function MessagesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const filteredMessages = messages.filter(message => {
    const matchesCategory = selectedCategory === 'all' || message.category === selectedCategory;
    const matchesSearch = message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         message.from.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'donation': return 'bg-amber-100 text-amber-800';
      case 'volunteer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Messages</h1>
        <p className="text-sm sm:text-base text-green-600">Stay connected with guild announcements and updates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg mb-4">
            <CardHeader className="pb-4">
              <CardTitle className="text-green-800 flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                      : 'text-green-700 hover:bg-green-50'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {category.count}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          <Button
            onClick={() => setIsComposing(true)}
            className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 shadow-lg"
          >
            <Send className="h-4 w-4 mr-2" />
            Compose Message
          </Button>
        </div>

        {/* Messages List */}
        <div className="lg:col-span-3">
          {/* Search and Filters */}
          <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg mb-4">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
                  <Input
                    placeholder="Search messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-green-200 focus:border-green-500"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="border-green-200 text-green-700">
                    <Archive className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages Cards */}
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card
                key={message.id}
                className={`bg-white/80 backdrop-blur-sm shadow-lg transition-all hover:shadow-xl cursor-pointer ${
                  !message.read ? 'border-l-4 border-l-amber-500' : 'border-green-200'
                }`}
                onClick={() => setSelectedMessage(message)}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className={`text-sm font-medium truncate ${
                              !message.read ? 'text-green-900 font-semibold' : 'text-green-800'
                            }`}>
                              {message.from}
                            </h3>
                            <Badge className={`text-xs ${getCategoryColor(message.category)} self-start sm:self-auto`}>
                              {message.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <h4 className={`text-base sm:text-lg mb-2 truncate ${
                        !message.read ? 'font-semibold text-green-900' : 'font-medium text-green-800'
                      }`}>
                        {message.subject}
                      </h4>
                      <p className="text-sm text-green-600 line-clamp-2">{message.preview}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-green-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(message.date).toLocaleDateString()}
                      </div>
                      {message.starred && <Star className="h-4 w-4 text-amber-500 fill-current" />}
                      {!message.read && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMessages.length === 0 && (
            <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
              <CardContent className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-green-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-green-800 mb-2">No messages found</h3>
                <p className="text-green-600">Try adjusting your search or filter criteria.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Compose Modal (simplified for demo) */}
      {isComposing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle>Compose Message</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Input placeholder="To: Guild Administration" className="border-green-200" />
              <Input placeholder="Subject" className="border-green-200" />
              <Textarea
                placeholder="Your message..."
                rows={6}
                className="border-green-200 resize-none"
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsComposing(false)}
                  className="border-green-200 text-green-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setIsComposing(false)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}