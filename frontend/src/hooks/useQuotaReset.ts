import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usageService } from '../services/upload.service';
import { formatTime } from '../utils/formatBytes';

export function useQuotaReset() {
  const { data: stats } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: () => usageService.getStats(),
  });

  const [secondsLeft, setSecondsLeft] = useState(0);

  useEffect(() => {
    if (!stats?.resetAt) return;

    const update = () => {
      const diff = Math.max(0, Math.floor((new Date(stats.resetAt).getTime() - Date.now()) / 1000));
      setSecondsLeft(diff);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [stats?.resetAt]);

  return {
    resetAt: stats?.resetAt,
    secondsLeft,
    formattedReset: formatTime(secondsLeft),
  };
}
