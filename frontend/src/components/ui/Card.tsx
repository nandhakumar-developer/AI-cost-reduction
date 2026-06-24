import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, glass, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-xl border border-[var(--outline-variant)] shadow-sm transition-all duration-200',
        glass ? 'glass-card' : 'bg-[var(--surface-container-lowest)]',
        onClick && 'cursor-pointer hover:shadow-md hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  badge?: string;
  accent?: boolean;
  children?: React.ReactNode;
}

export function StatCard({ label, value, icon, badge, accent, children }: StatCardProps) {
  return (
    <div className={cn(
      'rounded-xl p-5 shadow-sm border flex flex-col gap-4',
      accent
        ? 'bg-[var(--primary-container)] border-transparent text-[var(--on-primary-container)]'
        : 'glass-card border-[var(--outline-variant)]'
    )}>
      <div className="flex items-start justify-between">
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center',
          accent ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'bg-[var(--primary-fixed)] text-[var(--primary)]'
        )}>
          {icon}
        </div>
        {badge && (
          <span className={cn(
            'text-[11px] font-bold px-2 py-0.5 rounded-full',
            accent
              ? 'bg-[var(--primary)] text-[var(--on-primary)]'
              : 'bg-[var(--primary-fixed)] text-[var(--primary)]'
          )}>{badge}</span>
        )}
      </div>
      <div>
        <p className={cn(
          'text-[11px] font-semibold uppercase tracking-wider',
          accent ? 'text-[var(--primary-fixed)] opacity-80' : 'text-[var(--secondary)]'
        )}>{label}</p>
        <p className={cn(
          'text-2xl font-black mt-1 tabular-nums',
          accent ? 'text-[var(--on-primary-container)]' : 'text-[var(--on-surface)]'
        )}>{value}</p>
      </div>
      {children}
    </div>
  );
}
