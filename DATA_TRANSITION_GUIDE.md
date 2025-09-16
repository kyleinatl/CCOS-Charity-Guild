# Data Service Transition Guide

## Overview

The CCOS Charity Guild application uses a centralized data service abstraction layer that allows easy switching between mock data (for development) and real API calls (for production). This design ensures smooth development-to-production transitions.

## Architecture

### Data Service Layer (`/src/lib/data/data-service.ts`)

The `DataService` class provides a unified interface for all data operations across the application. It automatically switches between mock data and real API calls based on the `USE_MOCK_DATA` configuration flag.

### Configuration

```typescript
// Located in /src/lib/data/data-service.ts
export const USE_MOCK_DATA = true; // Set to false for production
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';
```

## Switching to Production (Real API Data)

### Step 1: Update Configuration

Change the configuration in `/src/lib/data/data-service.ts`:

```typescript
export const USE_MOCK_DATA = false; // Switch to real API calls
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-api.com/api';
```

### Step 2: Set Environment Variables

Create or update your `.env.local` file:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
```

### Step 3: Implement Backend API Endpoints

Your backend API should implement the following endpoints:

#### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User authentication
- `POST /api/auth/signout` - User logout
- `GET /api/auth/user` - Get current user profile

#### Dashboard Endpoints
- `GET /api/portal/dashboard/:userId` - Get dashboard data

#### Profile Endpoints
- `GET /api/portal/profile/:userId` - Get profile data
- `PUT /api/portal/profile/:userId` - Update profile data

#### Donations Endpoints
- `GET /api/portal/donations/:userId` - Get donation history
- `GET /api/donations/stats/:userId` - Get donation statistics

#### Events Endpoints
- `GET /api/portal/events/:userId` - Get user's events
- `GET /api/events` - Get public events
- `POST /api/events/:eventId/register` - Register for event

#### Messages Endpoints
- `GET /api/portal/messages/:userId` - Get user messages
- `PUT /api/portal/messages/:messageId/read` - Mark message as read

## Mock Data Structure

### Dashboard Data (`/src/lib/data/mock-data/dashboard.ts`)
```typescript
{
  stats: {
    totalDonated: number;
    engagementScore: number;
    eventsAttended: number;
    // ... more stats
  },
  recentActivity: ActivityItem[],
  tierProgress: TierProgressInfo,
  // ... more dashboard data
}
```

### Profile Data (`/src/lib/data/mock-data/profile.ts`)
```typescript
{
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    // ... more personal info
  },
  membershipInfo: {
    tier: string;
    totalDonated: number;
    // ... more membership info
  },
  preferences: UserPreferences,
  activityHistory: ActivityItem[]
}
```

### Donations Data (`/src/lib/data/mock-data/donations.ts`)
```typescript
{
  donations: DonationItem[],
  summary: {
    totalDonated: number;
    donationCount: number;
    // ... more summary stats
  },
  yearlyStats: YearlyStatItem[]
}
```

### Events Data (`/src/lib/data/mock-data/events.ts`)
```typescript
{
  userEvents: UserEventItem[],
  availableEvents: EventItem[],
  registrationHistory: RegistrationItem[]
}
```

### Messages Data (`/src/lib/data/mock-data/messages.ts`)
```typescript
{
  messages: MessageItem[],
  summary: {
    totalMessages: number;
    unreadCount: number;
    // ... more summary info
  },
  preferences: MessagePreferences
}
```

## Development vs Production Behavior

### Development Mode (USE_MOCK_DATA = true)
- All data requests return mock data from the `/mock-data` files
- Includes realistic delays (300-500ms) to simulate network latency
- Console logging shows "MOCK" data source for debugging
- No external API dependencies required

### Production Mode (USE_MOCK_DATA = false)
- All data requests go to real API endpoints
- Proper error handling for network failures
- Console logging shows "REAL" data source
- Requires backend API implementation

## Current Implementation Status

### ✅ Completed Components Using Data Service
- **Portal Dashboard** (`/app/portal/page.tsx`)
  - Uses `dataService.getDashboardData()`
  - Displays member statistics and recent activity

- **Profile Management** (`/app/portal/profile/page.tsx`)  
  - Uses `dataService.getProfileData()` and `dataService.updateProfile()`
  - Handles personal info and preferences

- **Donations Tracking** (`/app/portal/donations/page.tsx`)
  - Uses `dataService.getDonations()`
  - Shows donation history and statistics

### 🔄 Areas for Future Enhancement
- Add real-time data synchronization
- Implement data caching for performance
- Add optimistic updates for better UX
- Implement retry logic for failed API calls

## Testing the Transition

### 1. Verify Mock Data Mode
```bash
# Check console logs show "MOCK" data source
npm run dev
# Navigate to portal pages and check browser console
```

### 2. Test Production Mode
```bash
# Set USE_MOCK_DATA = false in data-service.ts
# Ensure API endpoints return expected data structure
npm run dev
# Check console logs show "REAL" data source
```

### 3. Environment-Specific Configuration
```bash
# Development
USE_MOCK_DATA=true
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# Staging
USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=https://staging-api.ccoscharityguild.com/api

# Production
USE_MOCK_DATA=false
NEXT_PUBLIC_API_URL=https://api.ccoscharityguild.com/api
```

## Benefits of This Architecture

1. **Seamless Development**: Developers can work with realistic data without backend dependencies
2. **Easy Testing**: Mock data provides consistent, predictable test scenarios
3. **Gradual Migration**: Switch individual endpoints from mock to real as backend becomes available
4. **Zero-Downtime Deployment**: Toggle data sources without code changes
5. **Development Speed**: Frontend and backend teams can work in parallel

## Next Steps for Production

1. Set `USE_MOCK_DATA = false`
2. Implement all required API endpoints in your backend
3. Update `API_BASE_URL` to point to your production API
4. Test each portal page to ensure data flows correctly
5. Deploy with confidence knowing the transition is seamless

The data service abstraction layer ensures your application is production-ready while maintaining excellent developer experience during development and testing phases.