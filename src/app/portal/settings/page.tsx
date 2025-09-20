'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Settings,
  User,
  Bell,
  Mail,
  Shield,
  Palette,
  Globe,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    // Profile Settings
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    bio: 'Proud member of the CCOS Charity Guild, passionate about giving back to the Atlanta community.',
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    donationReceipts: true,
    newsletterSubscription: true,
    
    // Privacy Settings
    profileVisibility: true,
    showDonationHistory: false,
    allowContact: true,
    
    // Display Settings
    darkMode: false,
    language: 'en',
    timezone: 'America/New_York',
  });

  const handleSave = () => {
    // In a real app, this would save to the backend
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2">Settings</h1>
        <p className="text-sm sm:text-base text-green-600">Manage your account preferences and privacy settings</p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-green-700">First Name</Label>
                <Input
                  id="firstName"
                  value={settings.firstName}
                  onChange={(e) => setSettings({...settings, firstName: e.target.value})}
                  className="border-green-200 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-green-700">Last Name</Label>
                <Input
                  id="lastName"
                  value={settings.lastName}
                  onChange={(e) => setSettings({...settings, lastName: e.target.value})}
                  className="border-green-200 focus:border-green-500"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-green-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                className="border-green-200 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-green-700">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                className="border-green-200 focus:border-green-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio" className="text-green-700">Bio</Label>
              <Textarea
                id="bio"
                value={settings.bio}
                onChange={(e) => setSettings({...settings, bio: e.target.value})}
                rows={3}
                className="border-green-200 focus:border-green-500 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security & Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-green-700">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  className="border-green-200 focus:border-green-500 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-green-700">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="border-green-200 focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-green-700">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="border-green-200 focus:border-green-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Label className="text-green-700 font-medium">Email Notifications</Label>
                <p className="text-sm text-green-600">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked: boolean) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Label className="text-green-700 font-medium">SMS Notifications</Label>
                <p className="text-sm text-green-600">Receive updates via text message</p>
              </div>
              <Switch
                checked={settings.smsNotifications}
                onCheckedChange={(checked: boolean) => setSettings({...settings, smsNotifications: checked})}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Label className="text-green-700 font-medium">Event Reminders</Label>
                <p className="text-sm text-green-600">Get notified about upcoming events</p>
              </div>
              <Switch
                checked={settings.eventReminders}
                onCheckedChange={(checked: boolean) => setSettings({...settings, eventReminders: checked})}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Label className="text-green-700 font-medium">Donation Receipts</Label>
                <p className="text-sm text-green-600">Receive donation confirmation emails</p>
              </div>
              <Switch
                checked={settings.donationReceipts}
                onCheckedChange={(checked: boolean) => setSettings({...settings, donationReceipts: checked})}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Label className="text-green-700 font-medium">Newsletter Subscription</Label>
                <p className="text-sm text-green-600">Stay updated with guild news</p>
              </div>
              <Switch
                checked={settings.newsletterSubscription}
                onCheckedChange={(checked: boolean) => setSettings({...settings, newsletterSubscription: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Privacy & Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Label className="text-green-700 font-medium">Profile Visibility</Label>
                <p className="text-sm text-green-600">Allow other members to see your profile</p>
              </div>
              <Switch
                checked={settings.profileVisibility}
                onCheckedChange={(checked: boolean) => setSettings({...settings, profileVisibility: checked})}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Label className="text-green-700 font-medium">Show Donation History</Label>
                <p className="text-sm text-green-600">Display your donation history to other members</p>
              </div>
              <Switch
                checked={settings.showDonationHistory}
                onCheckedChange={(checked: boolean) => setSettings({...settings, showDonationHistory: checked})}
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <Label className="text-green-700 font-medium">Allow Contact</Label>
                <p className="text-sm text-green-600">Let other members contact you directly</p>
              </div>
              <Switch
                checked={settings.allowContact}
                onCheckedChange={(checked: boolean) => setSettings({...settings, allowContact: checked})}
              />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-lg px-6 py-2"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}