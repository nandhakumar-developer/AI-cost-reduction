import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { formatTime } from '../utils/formatBytes';

export function useSession() {
  const { session, logout } = useAuthStore();
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState<number>(0);
  const [warningShown, setWarningShown] = useState(false);

  const getRemainingSeconds = useCallback((): number => {
    if (!session) return 0;
    return Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000));
  }, [session]);

  useEffect(() => {
    setSecondsLeft(getRemainingSeconds());
    const interval = setInterval(() => {
      const remaining = getRemainingSeconds();
      setSecondsLeft(remaining);

      // Warn at 15 minutes
      if (remaining <= 15 * 60 && !warningShown) {
        setWarningShown(true);
        toast.warning('Session expires in 15 minutes. Please save your work.');
      }

      // Auto-logout at 0
      if (remaining <= 0 && session) {
        clearInterval(interval);
        logout();
        navigate('/login');
        toast.error('Your session has expired. Please log in again.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, getRemainingSeconds, logout, navigate, warningShown]);

  return {
    secondsLeft,
    formattedTime: formatTime(secondsLeft),
    isExpiringSoon: secondsLeft > 0 && secondsLeft <= 15 * 60,
  };
}
