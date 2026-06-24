import { useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { SessionTimer } from '../common/SessionTimer';
import { ThemeToggle } from '../common/ThemeToggle';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard Overview',
  '/dashboard/convert': 'Convert Files',
  '/dashboard/usage': 'Usage & Analytics',
  '/dashboard/settings': 'Settings',
};

export function TopBar() {
  const { user } = useAuth();
  const { pathname } = useLocation();

  const title = PAGE_TITLES[pathname] ?? 'Dashboard';

  return (
    <header className="flex items-center justify-between h-16 px-6 bg-[var(--surface)] border-b border-[var(--outline-variant)] sticky top-0 z-40 backdrop-blur-sm">
      {/* Page title */}
      <span className="text-sm font-medium text-[var(--secondary)]">{title}</span>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <SessionTimer variant="pill" />
        <ThemeToggle />
        {user && (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full object-cover border-2 border-[var(--outline-variant)] cursor-pointer hover:border-[var(--primary)] transition-colors"
            title={user.name}
          />
        )}
      </div>
    </header>
  );
}
