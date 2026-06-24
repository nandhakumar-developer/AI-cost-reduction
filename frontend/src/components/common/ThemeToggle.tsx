import { Sun, Moon, Monitor } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  variant?: 'icon' | 'full';
  className?: string;
}

export function ThemeToggle({ variant = 'icon', className }: ThemeToggleProps) {
  const { theme, setTheme, toggleTheme } = useTheme();

  if (variant === 'full') {
    const options: { key: typeof theme; icon: React.ReactNode; label: string }[] = [
      { key: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
      { key: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
      { key: 'system', icon: <Monitor className="w-4 h-4" />, label: 'System' },
    ];
    return (
      <div className={cn('flex gap-2', className)}>
        {options.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            className={cn(
              'flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200',
              theme === key
                ? 'border-[var(--primary)] bg-[var(--secondary-container)] text-[var(--primary)]'
                : 'border-[var(--outline-variant)] text-[var(--secondary)] hover:border-[var(--outline)] hover:bg-[var(--surface-container-low)]'
            )}
          >
            {icon}
            <span className="text-xs font-semibold">{label}</span>
          </button>
        ))}
      </div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'p-2 rounded-full text-[var(--secondary)] hover:bg-[var(--surface-container)] transition-all',
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
    </button>
  );
}
