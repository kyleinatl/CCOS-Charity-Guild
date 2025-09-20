'use client';

import { useState, Fragment } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// import { useAuth } from '@/lib/auth/auth-context';
import {
  User,
  DollarSign,
  Calendar,
  MessageSquare,
  Settings,
  Home,
  Menu,
  X,
  Bell,
  LogOut,
  Heart,
  CreditCard,
  Mail,
  Trophy,
} from 'lucide-react';

interface MemberPortalLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/portal', icon: Home },
  { name: 'My Profile', href: '/portal/profile', icon: User },
  { name: 'Make Donation', href: '/portal/donate', icon: Heart },
  { name: 'Donations', href: '/portal/donations', icon: DollarSign },
  { name: 'Events', href: '/portal/events', icon: Calendar },
  { name: 'Messages', href: '/portal/messages', icon: MessageSquare },
  { name: 'Settings', href: '/portal/settings', icon: Settings },
];

const tierColors = {
  bronze: 'from-amber-600 to-orange-600',
  silver: 'from-gray-400 to-gray-500',
  gold: 'from-yellow-400 to-amber-500',
  platinum: 'from-green-600 to-emerald-700',
  diamond: 'from-emerald-500 to-teal-600',
};

const tierEmojis = {
  bronze: '🥉',
  silver: '🥈',
  gold: '🥇',
  platinum: '💎',
  diamond: '💠',
};

export function MemberPortalLayout({ children }: MemberPortalLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  // Mock auth for demo - replace with actual auth
  const loading = false;
  const user = {
    id: 'demo-user-id',
    member_profile: {
      id: 'profile-123',
      first_name: 'John',
      last_name: 'Doe',
      tier: 'gold' as const,
      total_donated: 2500,
      engagement_score: 85
    }
  };
  
  const signOut = async () => {
    console.log('Demo sign out');
    router.push('/auth/login');
  };

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const memberProfile = user.member_profile;
  const tierColor = tierColors[memberProfile?.tier as keyof typeof tierColors] || tierColors.bronze;
  const tierEmoji = tierEmojis[memberProfile?.tier as keyof typeof tierEmojis] || tierEmojis.bronze;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-amber-50 to-emerald-100">
      {/* Mobile sidebar */}
      <Transition.Root show={mobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-green-900/75 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-1 flex-col bg-white/95 backdrop-blur-sm shadow-2xl">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      type="button"
                      className="ml-1 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>

                <div className="flex h-16 items-center px-6 bg-gradient-to-r from-green-600 to-emerald-600">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Member Portal</span>
                  </div>
                </div>

                {/* Member Info */}
                <div className="p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
                  <div className="flex items-center space-x-3">
                    <div className={`h-14 w-14 rounded-full bg-gradient-to-r ${tierColor} flex items-center justify-center text-white text-xl shadow-lg`}>
                      {tierEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-green-800">
                        {memberProfile?.first_name} {memberProfile?.last_name}
                      </p>
                      <p className="text-xs text-green-600 capitalize font-medium">{memberProfile?.tier} Member</p>
                      <p className="text-xs text-amber-600 font-semibold">
                        ${memberProfile?.total_donated?.toLocaleString()} donated
                      </p>
                    </div>
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
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-green-100">
                  <Button
                    onClick={handleSignOut}
                    className="w-full justify-start bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 shadow-lg"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex h-full flex-col bg-white/95 backdrop-blur-sm shadow-2xl border-r border-green-100">
          <div className="flex h-16 items-center px-6 bg-gradient-to-r from-green-600 to-emerald-600">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Member Portal</span>
            </div>
          </div>

          {/* Member Info */}
          <div className="p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <div className="flex items-center space-x-3">
              <div className={`h-14 w-14 rounded-full bg-gradient-to-r ${tierColor} flex items-center justify-center text-white text-xl shadow-lg`}>
                {tierEmoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-green-800">
                  {memberProfile?.first_name} {memberProfile?.last_name}
                </p>
                <p className="text-xs text-green-600 capitalize font-medium">{memberProfile?.tier} Member</p>
                <p className="text-xs text-amber-600 font-semibold">
                  ${memberProfile?.total_donated?.toLocaleString()} donated
                </p>
              </div>
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
            <Button
              onClick={handleSignOut}
              className="w-full justify-start bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700 shadow-lg"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-green-50/95 to-emerald-50/95 backdrop-blur-sm shadow-lg border-b border-green-200 px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-green-600 hover:text-green-800 hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 transition-all"
                onClick={() => setMobileMenuOpen(true)}
              >
                <span className="sr-only">Open sidebar</span>
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="ml-4 text-2xl font-bold text-green-800 lg:ml-0">
                Welcome back, {memberProfile?.first_name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="hidden sm:inline-flex bg-gradient-to-r from-amber-500 to-yellow-600 text-white shadow-lg border-0">
                {memberProfile?.tier} Member
              </Badge>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}