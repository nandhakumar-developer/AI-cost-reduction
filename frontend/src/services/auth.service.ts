import type { User, Session } from '../types';

// ── Mock Auth Service ──
// Phase 1: simulates Google OAuth with mock data.
// Phase 2: replace with real backend calls via `api` instance.

export interface AuthResponse {
  user: User;
  session: Session;
}

const MOCK_USER: User = {
  id: 'usr_01',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: `https://ui-avatars.com/api/?name=Alex+Johnson&background=3525cd&color=fff&rounded=true&size=128`,
  provider: 'google',
  createdAt: new Date().toISOString(),
};

export const authService = {
  /** Initiates Google OAuth. Phase 1: returns mock data. */
  googleLogin: async (): Promise<AuthResponse> => {
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200));
    return {
      user: MOCK_USER,
      session: {
        token: 'mock_jwt_token_' + Date.now(),
        expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
      },
    };
  },

  /** Fetches current user from backend */
  getMe: async (): Promise<User> => {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_USER;
  },

  /** Logs out the current user */
  logout: async (): Promise<void> => {
    await new Promise((r) => setTimeout(r, 300));
  },
};
