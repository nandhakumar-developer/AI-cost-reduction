import { cn } from '../../utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'uploading' | 'processing';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--surface-container)] text-[var(--on-surface-variant)]',
  success: 'bg-[var(--secondary-container)] text-[var(--on-secondary-container)]',
  warning: 'bg-[var(--tertiary-fixed)] text-[var(--on-tertiary-fixed)]',
  error: 'bg-[var(--error-container)] text-[var(--on-error-container)]',
  info: 'bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]',
  uploading: 'bg-[var(--surface-container-high)] text-[var(--secondary)] animate-pulse',
  processing: 'bg-[var(--primary-fixed)] text-[var(--primary)] animate-pulse',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Maps ConversionStatus → Badge variant */
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { variant: BadgeVariant; label: string }> = {
    idle: { variant: 'default', label: 'Ready' },
    uploading: { variant: 'uploading', label: '⟳ Uploading' },
    processing: { variant: 'processing', label: '⚙ Processing' },
    completed: { variant: 'success', label: '✓ Completed' },
    failed: { variant: 'error', label: '✕ Failed' },
  };
  const cfg = map[status] ?? { variant: 'default', label: status };
  return <Badge variant={cfg.variant}>{cfg.label}</Badge>;
}
