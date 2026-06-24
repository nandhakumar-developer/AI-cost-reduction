import { cn } from '../../utils/cn';

interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  label?: string;
  showLabel?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const variantColors: Record<string, string> = {
  default: 'bg-[var(--primary)]',
  success: 'bg-[var(--secondary)]',
  warning: 'bg-[var(--tertiary)]',
  error: 'bg-[var(--error)]',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showLabel = true,
  variant = 'default',
  className,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.round((value / max) * 100));
  const v = percent > 80 ? 'error' : percent > 60 ? 'warning' : variant;

  return (
    <div className={cn('w-full', className)}>
      {(label || showLabel) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs font-medium text-[var(--secondary)]">{label}</span>}
          {showLabel && <span className="text-xs font-bold text-[var(--on-surface)]">{percent}%</span>}
        </div>
      )}
      <div className="w-full bg-[var(--surface-container)] rounded-full h-2 overflow-hidden">
        <div
          className={cn('h-2 rounded-full transition-all duration-500', variantColors[v])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
