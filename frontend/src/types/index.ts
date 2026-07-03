// ── Shared Types ──

export type UserRole = 'USER' | 'PRO' | 'ADMIN';
export type UserPlan = 'FREE' | 'PRO';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: string;
  role: UserRole;
  plan: UserPlan;
  createdAt: string;
}

export interface Session {
  token: string;
  expiresAt: number;
}

export type ConversionStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export interface ConversionResult {
  id: string;
  filename: string;
  fileSize: number;
  status: ConversionStatus;
  markdown?: string;
  error?: string;
  processingTime?: number;
  createdAt?: string;
}

export interface UsageStats {
  totalConversions: number;
  filesProcessed: number;
  quotaBytes: number;
  usedBytes: number;
  remainingBytes: number;
  maxUploadBytes: number;
  cycleCount: number;
  maxCycles: number | null;
  resetAt: string;
  plan: UserPlan;
  lastActivity: string | null;
}

export interface RecentConversion {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  status: 'completed' | 'failed';
  createdAt: string;
  markdownLength?: number;
  markdown?: string;
}

export interface HistoryItem extends RecentConversion {
  processingTime: number;
  markdown: string;
}

export interface PaginatedHistory {
  items: HistoryItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SubscriptionRecord {
  id: string;
  transactionId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  screenshot?: string | null;
  approvedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
}

export interface PaymentInstructions {
  title: string;
  steps: string[];
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bank: string;
    reference: string;
  };
  amount: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}
