'use client';

import { useMemo, useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { dataService, logDataSource } from '@/lib/data';
import { MessageSquare, Send, User, Calendar, Search, Star } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');

  useEffect(() => {
    const loadMessages = async () => {
      if (!user?.id) return;

      try {
        logDataSource('Portal Messages');
        const data = await dataService.getMessages(user.id);
        setMessages(data?.messages || []);
        setCategories(data?.categories || []);
      } catch (error) {
        console.error('Failed to load messages:', error);
        setMessages([]);
      }
    };

    loadMessages();
  }, [user?.id]);

  const filteredMessages = useMemo(() => {
    return messages.filter((message) => {
      const matchesCategory = selectedCategory === 'all' || message.category === selectedCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch = message.subject.toLowerCase().includes(query) || message.from.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [messages, selectedCategory, searchQuery]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'announcement': return 'bg-blue-100 text-blue-800';
      case 'event': return 'bg-green-100 text-green-800';
      case 'donation': return 'bg-amber-100 text-amber-800';
      case 'volunteer': return 'bg-purple-100 text-purple-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const handleSend = async () => {
    if (!subject.trim() || !messageBody.trim()) return;

    try {
      await fetch('/api/communications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'direct_email',
          subject,
          content: messageBody,
          recipient_segments: ['all'],
        }),
      });

      setIsComposing(false);
      setSubject('');
      setMessageBody('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Messages</h1>
        <p className="text-sm sm:text-base text-green-600">Stay connected with guild announcements and updates</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
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
                    <Badge variant="secondary" className="ml-2 text-xs">{category.count}</Badge>
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

        <div className="lg:col-span-3">
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
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card
                key={message.id}
                className={`bg-white/80 backdrop-blur-sm shadow-lg transition-all hover:shadow-xl ${
                  !message.read ? 'border-l-4 border-l-amber-500' : 'border-green-200'
                }`}
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <h3 className={`text-sm truncate ${!message.read ? 'text-green-900 font-semibold' : 'text-green-800'}`}>{message.from}</h3>
                            <Badge className={`text-xs ${getCategoryColor(message.category)} self-start sm:self-auto`}>{message.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <h4 className={`text-base sm:text-lg mb-2 truncate ${!message.read ? 'font-semibold text-green-900' : 'font-medium text-green-800'}`}>{message.subject}</h4>
                      <p className="text-sm text-green-600 line-clamp-2">{message.preview}</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-green-500">
                      <div className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(message.date).toLocaleDateString()}</div>
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

      {isComposing && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-white shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle>Compose Message</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <Input value="To: Guild Administration" readOnly className="border-green-200 bg-green-50" />
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" className="border-green-200" />
              <Textarea value={messageBody} onChange={(e) => setMessageBody(e.target.value)} placeholder="Your message..." rows={6} className="border-green-200 resize-none" />
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsComposing(false)} className="border-green-200 text-green-700">Cancel</Button>
                <Button onClick={handleSend} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
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
