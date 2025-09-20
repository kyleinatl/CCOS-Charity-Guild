'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Users,
  DollarSign,
  Calendar,
  MessageSquare,
  BarChart3,
  Settings,
  Home,
  Menu,
  X,
  Bell,
  Search,
  User,
  Heart,
  Sparkles,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Members', href: '/members', icon: Users },
  { name: 'Donations', href: '/donations', icon: DollarSign },
  { name: 'Events', href: '/events', icon: Calendar },
  { name: 'Communications', href: '/communications', icon: MessageSquare },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Automation', href: '/automation', icon: Sparkles },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-100">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        sidebarOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-green-900/75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-white/95 backdrop-blur-sm shadow-2xl">
          <div className="flex h-16 items-center justify-between px-6 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CCOS Guild</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="mt-8 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:shadow-md"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex h-full flex-col bg-white/95 backdrop-blur-sm shadow-2xl border-r border-green-100">
          <div className="flex h-16 items-center px-6 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">CCOS Guild</span>
            </div>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                      : "text-green-700 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:shadow-md"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-green-100">
            <div className="flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-800">Admin User</p>
                <p className="text-xs text-green-600 truncate">admin@ccoscharityguild.org</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top header */}
        <div className="sticky top-0 z-40 bg-gradient-to-r from-green-50/95 to-emerald-50/95 backdrop-blur-sm shadow-lg border-b border-green-200">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-green-600 hover:text-green-800 hover:bg-white/50"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
              <div className="hidden sm:flex items-center space-x-4 bg-white/50 rounded-xl px-4 py-2 backdrop-blur-sm">
                <Search className="h-5 w-5 text-green-600" />
                <input
                  type="text"
                  placeholder="Search members, donations, events..."
                  className="border-0 bg-transparent text-sm text-green-800 placeholder-green-500 focus:outline-none focus:ring-0 min-w-0 flex-1"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative text-green-600 hover:text-green-800 hover:bg-white/50">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full text-xs text-white flex items-center justify-center shadow-lg">
                  3
                </span>
              </Button>
              <Button className="hidden sm:flex bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 shadow-lg">
                <Sparkles className="h-4 w-4 mr-2" />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}