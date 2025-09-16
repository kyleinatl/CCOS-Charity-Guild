// Central data service exports
export { dataService, USE_MOCK_DATA, isMockDataEnabled, logDataSource } from './data-service';
export { dataService as default } from './data-service';

// Mock data exports (for direct access if needed)
export { mockDashboardData } from './mock-data/dashboard';
export { mockProfileData } from './mock-data/profile';
export { mockDonationsData } from './mock-data/donations';
export { mockEventsData } from './mock-data/events';
export { mockMessagesData } from './mock-data/messages';