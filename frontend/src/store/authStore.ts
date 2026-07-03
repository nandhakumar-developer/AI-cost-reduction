import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Session, Theme } from '../types';

interface AuthStore {
  user: User | null;
  session: Session | null;
  theme: Theme;
  isAuthenticated: boolean;
  setAuth: (user: User, session: Session) => void;
  logout: () => void;
  setTheme: (theme: Theme) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      theme: 'system',
      isAuthenticated: false,

      setAuth: (user, session) =>
        set({ user, session, isAuthenticated: true }),

      logout: () =>
        set({ user: null, session: null, isAuthenticated: false }),

      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'markitdown-auth',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
      }),
    }
  )
);
