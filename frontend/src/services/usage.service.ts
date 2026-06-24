import type { UsageStats, RecentConversion } from '../types';

const MOCK_STATS: UsageStats = {
  totalConversions: 128,
  filesProcessed: 1042,
  dailyLimit: 50,
  usedToday: 12,
  remainingToday: 38,
  lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
};

const MOCK_RECENT: RecentConversion[] = [
  { id: '1', filename: 'Q4_Financial_Report.pdf', fileType: 'PDF', fileSize: 2.4 * 1024 * 1024, status: 'completed', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: '2', filename: 'API_Documentation.docx', fileType: 'DOCX', fileSize: 42 * 1024, status: 'completed', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: '3', filename: 'User_Onboarding_Flow.pptx', fileType: 'PPTX', fileSize: 1.1 * 1024 * 1024, status: 'completed', createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '4', filename: 'Sales_Data_Q3.xlsx', fileType: 'XLSX', fileSize: 5.8 * 1024 * 1024, status: 'completed', createdAt: new Date(Date.now() - 172800000).toISOString() },
];

export const usageService = {
  getStats: async (): Promise<UsageStats> => {
    await new Promise((r) => setTimeout(r, 400));
    return MOCK_STATS;
  },

  getRecentConversions: async (): Promise<RecentConversion[]> => {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_RECENT;
  },
};
