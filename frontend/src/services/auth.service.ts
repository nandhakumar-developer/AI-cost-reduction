import { api } from './api';
import type { User, Session } from '../types';

export interface AuthResponse {
  user: User;
  session: Session;
}

export const authService = {
  googleLogin: async (credential: string): Promise<AuthResponse> => {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>(
      '/auth/google',
      { credential }
    );
    return data.data;
  },

  devLogin: async (email = 'dev@example.com'): Promise<AuthResponse> => {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>(
      '/auth/google',
      { credential: `dev:${email}` }
    );
    return data.data;
  },

  getMe: async (): Promise<{ user: User; usage: unknown }> => {
    const { data } = await api.get('/auth/me');
    return data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};
