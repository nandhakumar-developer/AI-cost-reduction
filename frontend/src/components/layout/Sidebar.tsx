import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileUp, BarChart3, History,
  CreditCard, User, Shield, LogOut, HelpCircle, Zap
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuth } from '../../hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { to: '/dashboard/convert', icon: FileUp, label: 'Convert Files' },
  { to: '/dashboard/history', icon: History, label: 'History' },
  { to: '/dashboard/usage', icon: BarChart3, label: 'Usage' },
  { to: '/dashboard/subscription', icon: CreditCard, label: 'Subscription' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

export function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex flex-col bg-[var(--surface-bright)] border-r border-[var(--outline-variant)] z-50 shadow-sm">
      <div className="p-6 border-b border-[var(--outline-variant)]">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
          <div className="w-8 h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-black text-[var(--primary)] leading-tight">MarkItDown</h1>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--secondary)] mt-0.5">
              {user?.plan ?? 'FREE'} Plan
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, exact }) => (
          <NavLink
            key={to}
            to={to}
            end={exact}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-[var(--secondary-container)] text-[var(--primary)] border-l-4 border-[var(--primary)] pl-2.5'
                  : 'text-[var(--secondary)] hover:bg-[var(--surface-container)] hover:text-[var(--on-surface)] border-l-4 border-transparent pl-2.5'
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('w-4 h-4', isActive ? 'text-[var(--primary)]' : '')} />
                {label}
              </>
            )}
          </NavLink>
        ))}

        {user?.role === 'ADMIN' && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 mt-2',
                isActive
                  ? 'bg-[var(--error-container)] text-[var(--error)] border-l-4 border-[var(--error)] pl-2.5'
                  : 'text-[var(--secondary)] hover:bg-[var(--surface-container)]'
              )
            }
          >
            <Shield className="w-4 h-4" />
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-[var(--outline-variant)] space-y-1">
        <button
          onClick={() => navigate('/dashboard/convert')}
          className="w-full bg-[var(--primary)] text-[var(--on-primary)] py-2.5 px-4 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity mb-2 flex items-center justify-center gap-2"
        >
          <FileUp className="w-4 h-4" />
          New Conversion
        </button>

        <a
          href="/pricing"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--secondary)] hover:bg-[var(--surface-container)] transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
          Pricing
        </a>

        {user && (
          <div className="flex items-center gap-2.5 px-2 pt-2 mt-1 border-t border-[var(--outline-variant)]">
            <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[var(--on-surface)] truncate">{user.name.split(' ')[0]}</p>
              <p className="text-[10px] text-[var(--secondary)] truncate">{user.email}</p>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 rounded-lg text-[var(--secondary)] hover:bg-[var(--error-container)] hover:text-[var(--error)] transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
