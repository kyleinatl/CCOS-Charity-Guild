/**
 * Data Service Abstraction Layer
 * 
 * This file provides a centralized way to manage data sources.
 * To switch from mock data to real API calls, simply:
 * 1. Set USE_MOCK_DATA to false
 * 2. Implement the real API endpoints
 * 3. Update the API_BASE_URL to your backend URL
 */

// Configuration - Change this to switch between mock and real data
export const USE_MOCK_DATA = true; // Set to false for production
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Mock data imports
import { mockDashboardData } from './mock-data/dashboard';
import { mockProfileData } from './mock-data/profile';
import { mockDonationsData } from './mock-data/donations';
import { mockEventsData } from './mock-data/events';
import { mockMessagesData } from './mock-data/messages';

/**
 * Generic API service class
 * Automatically switches between mock data and real API calls
 */
class DataService {
  private async mockDelay(ms: number = 300) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  private async apiCall(endpoint: string, options?: RequestInit) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }

  // Dashboard data service
  async getDashboardData(userId: string) {
    if (USE_MOCK_DATA) {
      await this.mockDelay();
      return mockDashboardData;
    }
    
    // TODO: Replace with real API call when ready
    return this.apiCall(`/portal/dashboard/${userId}`);
  }

  // Profile data service
  async getProfileData(userId: string) {
    if (USE_MOCK_DATA) {
      await this.mockDelay();
      return mockProfileData;
    }
    
    // TODO: Replace with real API call when ready
    return this.apiCall(`/portal/profile/${userId}`);
  }

  async updateProfile(userId: string, updates: any) {
    if (USE_MOCK_DATA) {
      await this.mockDelay(500);
      return { success: true, data: updates };
    }
    
    // TODO: Replace with real API call when ready
    return this.apiCall(`/portal/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // Donations data service
  async getDonations(userId: string, filters?: any) {
    if (USE_MOCK_DATA) {
      await this.mockDelay();
      return mockDonationsData;
    }
    
    // TODO: Replace with real API call when ready
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.apiCall(`/portal/donations/${userId}${queryParams}`);
  }

  // Events data service
  async getEvents(userId: string, filters?: any) {
    if (USE_MOCK_DATA) {
      await this.mockDelay();
      return mockEventsData;
    }
    
    // TODO: Replace with real API call when ready
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.apiCall(`/portal/events/${userId}${queryParams}`);
  }

  async registerForEvent(userId: string, eventId: string) {
    if (USE_MOCK_DATA) {
      await this.mockDelay();
      return { success: true, message: 'Successfully registered for event' };
    }
    
    // TODO: Replace with real API call when ready
    return this.apiCall(`/portal/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Messages data service
  async getMessages(userId: string, filters?: any) {
    if (USE_MOCK_DATA) {
      await this.mockDelay();
      return mockMessagesData;
    }
    
    // TODO: Replace with real API call when ready
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.apiCall(`/portal/messages/${userId}${queryParams}`);
  }

  async markMessageAsRead(userId: string, messageId: string) {
    if (USE_MOCK_DATA) {
      await this.mockDelay();
      return { success: true };
    }
    
    // TODO: Replace with real API call when ready
    return this.apiCall(`/portal/messages/${messageId}/read`, {
      method: 'PUT',
      body: JSON.stringify({ userId }),
    });
  }

  // Analytics data service (for admin dashboard)
  async getAnalytics(filters?: any) {
    if (USE_MOCK_DATA) {
      await this.mockDelay();
      // Return existing mock analytics data
      const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
      const response = await fetch(`/api/analytics${queryParams}`);
      return response.json();
    }
    
    // TODO: Replace with real API call when ready
    const queryParams = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return this.apiCall(`/analytics${queryParams}`);
  }

  // Missing methods that other services expect
  async getDonation(id: string) {
    if (USE_MOCK_DATA) {
      return { data: mockDonationsData.donations.find((d: any) => d.id === id) || null, error: null };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations/${id}`);
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async getMemberDonations(memberId: string) {
    if (USE_MOCK_DATA) {
      return mockDonationsData.donations.filter((d: any) => d.member_id === memberId);
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/donations?member_id=${memberId}`);
      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Error fetching member donations:', error);
      return [];
    }
  }

  async updateMember(id: string, updates: any) {
    if (USE_MOCK_DATA) {
      // Mock implementation - in reality this would update persistent storage
      return { data: { id, ...updates }, error: null };
    }
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
}

// Export singleton instance
export const dataService = new DataService();

// Utility function to check if we're using mock data
export const isMockDataEnabled = () => USE_MOCK_DATA;

// Environment-specific logging
export const logDataSource = (operation: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DataService] ${operation} using ${USE_MOCK_DATA ? 'MOCK' : 'REAL'} data`);
  }
};