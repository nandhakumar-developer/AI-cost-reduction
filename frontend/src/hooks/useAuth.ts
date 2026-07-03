import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';

export function useAuth() {
  const { user, session, isAuthenticated, setAuth, logout: storeLogout } = useAuthStore();
  const navigate = useNavigate();

  const loginWithGoogle = useCallback(
    async (credential: string) => {
      try {
        const { user, session } = await authService.googleLogin(credential);
        setAuth(user, session);
        toast.success(`Welcome, ${user.name.split(' ')[0]}!`);
        navigate('/dashboard');
      } catch {
        toast.error('Login failed. Please try again.');
      }
    },
    [setAuth, navigate]
  );

  const loginWithDev = useCallback(
    async (email?: string) => {
      try {
        const { user, session } = await authService.devLogin(email);
        setAuth(user, session);
        toast.success(`Welcome, ${user.name.split(' ')[0]}! (Dev mode)`);
        navigate('/dashboard');
      } catch {
        toast.error('Dev login failed.');
      }
    },
    [setAuth, navigate]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } finally {
      storeLogout();
      navigate('/login');
      toast.info('You have been signed out.');
    }
  }, [storeLogout, navigate]);

  const isSessionValid = useCallback((): boolean => {
    if (!session) return false;
    return Date.now() < session.expiresAt;
  }, [session]);

  const sessionSecondsRemaining = (): number => {
    if (!session) return 0;
    return Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
  };

  return {
    user,
    session,
    isAuthenticated,
    loginWithGoogle,
    loginWithDev,
    logout,
    isSessionValid,
    sessionSecondsRemaining,
  };
}
