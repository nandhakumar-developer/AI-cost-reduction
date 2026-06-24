// ── Shared Types ──

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  provider: string;
  createdAt: string;
}

export interface Session {
  token: string;
  expiresAt: number; // Unix timestamp (ms)
}

export type ConversionStatus = 'idle' | 'uploading' | 'processing' | 'completed' | 'failed';

export interface ConversionResult {
  id: string;
  filename: string;
  fileSize: number;
  status: ConversionStatus;
  markdown?: string;
  error?: string;
}

export interface UsageStats {
  totalConversions: number;
  filesProcessed: number;
  dailyLimit: number;
  usedToday: number;
  remainingToday: number;
  lastActivity: string | null;
}

export interface RecentConversion {
  id: string;
  filename: string;
  fileType: string;
  fileSize: number;
  status: 'completed' | 'failed';
  createdAt: string;
  markdown?: string;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
}
