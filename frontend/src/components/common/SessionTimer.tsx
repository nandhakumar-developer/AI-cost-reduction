import { Timer, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useSession } from '../../hooks/useSession';

interface SessionTimerProps {
  variant?: 'pill' | 'card';
  className?: string;
}

export function SessionTimer({ variant = 'pill', className }: SessionTimerProps) {
  const { formattedTime, isExpiringSoon } = useSession();

  if (variant === 'card') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center',
          isExpiringSoon ? 'bg-[var(--error-container)]' : 'bg-[var(--primary)] text-[var(--on-primary)]'
        )}>
          {isExpiringSoon
            ? <AlertCircle className="w-5 h-5 text-[var(--error)]" />
            : <Timer className="w-5 h-5" />}
        </div>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary)]">Session</p>
          <p className={cn(
            'text-lg font-black tabular-nums',
            isExpiringSoon ? 'text-[var(--error)]' : 'text-[var(--on-surface)]'
          )}>{formattedTime}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold',
      isExpiringSoon
        ? 'border-[var(--error)] bg-[var(--error-container)] text-[var(--error)]'
        : 'border-[var(--outline-variant)] bg-[var(--surface-container-low)] text-[var(--primary)]',
      className
    )}>
      <Timer className="w-3.5 h-3.5" />
      <span className="tabular-nums">{formattedTime}</span>
    </div>
  );
}
