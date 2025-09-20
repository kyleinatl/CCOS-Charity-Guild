'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Heart,
  Star,
  Filter,
  Search,
  Plus,
  ExternalLink,
} from 'lucide-react';

// Mock events data
const events = [
  {
    id: 1,
    title: 'Annual Charity Gala',
    description: 'Join us for an elegant evening supporting local Atlanta charities. Dinner, dancing, and silent auction.',
    date: '2025-11-15',
    time: '18:00',
    location: 'Country Club of the South Ballroom',
    category: 'fundraising',
    status: 'upcoming',
    attendees: 156,
    maxAttendees: 200,
    price: 150,
    registered: true,
    featured: true,
  },
  {
    id: 2,
    title: 'Community Garden Volunteer Day',
    description: 'Help plant and maintain our community garden that provides fresh produce to local food banks.',
    date: '2025-10-28',
    time: '09:00',
    location: 'CCOS Community Garden',
    category: 'volunteer',
    status: 'upcoming',
    attendees: 23,
    maxAttendees: 30,
    price: 0,
    registered: false,
    featured: false,
  },
  {
    id: 3,
    title: 'Member Appreciation Brunch',
    description: 'Celebrate our amazing members and their contributions to the community over a delicious brunch.',
    date: '2025-12-08',
    time: '11:00',
    location: 'Country Club of the South Dining Room',
    category: 'social',
    status: 'upcoming',
    attendees: 89,
    maxAttendees: 120,
    price: 35,
    registered: false,
    featured: false,
  },
  {
    id: 4,
    title: 'Atlanta Food Bank Service',
    description: 'Volunteer at the Atlanta Food Bank to help sort and pack food for families in need.',
    date: '2025-09-15',
    time: '14:00',
    location: 'Atlanta Community Food Bank',
    category: 'volunteer',
    status: 'past',
    attendees: 42,
    maxAttendees: 50,
    price: 0,
    registered: true,
    featured: false,
  },
];

const categories = [
  { id: 'all', name: 'All Events', color: 'bg-green-100 text-green-800' },
  { id: 'fundraising', name: 'Fundraising', color: 'bg-green-100 text-green-800' },
  { id: 'volunteer', name: 'Volunteer', color: 'bg-blue-100 text-blue-800' },
  { id: 'social', name: 'Social', color: 'bg-purple-100 text-purple-800' },
];

const statusColors = {
  upcoming: 'bg-green-100 text-green-800',
  past: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Events</h1>
        <p className="text-sm sm:text-base text-green-600">Discover and register for charity guild events</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-500 h-4 w-4" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-lg focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                  : 'bg-white border border-green-200 text-green-700 hover:bg-green-50'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Events */}
      {filteredEvents.some(event => event.featured) && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-green-800 mb-4">Featured Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.filter(event => event.featured).map((event) => (
              <Card key={event.id} className="bg-gradient-to-br from-green-50 to-emerald-100 border-green-200 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-amber-500 fill-current" />
                        <Badge className={categories.find(c => c.id === event.category)?.color}>
                          {event.category}
                        </Badge>
                        <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                          {event.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-green-800 text-lg sm:text-xl">{event.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-green-700 mb-4 text-sm sm:text-base">{event.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Calendar className="h-4 w-4" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Clock className="h-4 w-4" />
                      {formatTime(event.time)}
                    </div>
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <MapPin className="h-4 w-4" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                      <Users className="h-4 w-4" />
                      {event.attendees}/{event.maxAttendees} registered
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-lg font-semibold text-green-800">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </div>
                    <Button
                      className={event.registered 
                        ? "bg-gray-400 text-white cursor-not-allowed" 
                        : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                      }
                      disabled={event.registered || event.status === 'past'}
                    >
                      {event.registered ? 'Registered' : 'Register Now'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* All Events */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-green-800 mb-4">
          {selectedCategory === 'all' ? 'All Events' : categories.find(c => c.id === selectedCategory)?.name}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredEvents.filter(event => !event.featured).map((event) => (
            <Card key={event.id} className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge className={categories.find(c => c.id === event.category)?.color}>
                        {event.category}
                      </Badge>
                      <Badge className={statusColors[event.status as keyof typeof statusColors]}>
                        {event.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-green-800 text-base sm:text-lg line-clamp-2">{event.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 mb-4 text-sm line-clamp-3">{event.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                    {formatTime(event.time)}
                  </div>
                  <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 text-xs sm:text-sm">
                    <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                    {event.attendees}/{event.maxAttendees}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm sm:text-base font-semibold text-green-800">
                    {event.price === 0 ? 'Free' : `$${event.price}`}
                  </div>
                  <Button
                    size="sm"
                    className={event.registered 
                      ? "bg-gray-400 text-white cursor-not-allowed text-xs" 
                      : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 text-xs"
                    }
                    disabled={event.registered || event.status === 'past'}
                  >
                    {event.registered ? 'Registered' : 'Register'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {filteredEvents.length === 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardContent className="p-8 text-center">
            <Calendar className="h-12 w-12 text-green-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-green-800 mb-2">No events found</h3>
            <p className="text-green-600">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}