import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, Clock, Zap } from 'lucide-react';
import { usageService } from '../../services/usage.service';
import { ProgressBar } from '../../components/ui/ProgressBar';

export default function UsagePage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: () => usageService.getStats(),
  });

  const usagePercent = stats ? Math.round((stats.usedToday / stats.dailyLimit) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black text-[var(--on-background)]">Usage & Analytics</h2>
        <p className="text-sm text-[var(--secondary)] mt-1">Track your conversion usage and session activity.</p>
      </motion.section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Conversions',
            value: isLoading ? '—' : stats?.totalConversions.toLocaleString() ?? '—',
            icon: <TrendingUp className="w-5 h-5" />,
            delay: 0,
          },
          {
            label: 'Files Processed',
            value: isLoading ? '—' : stats?.filesProcessed.toLocaleString() ?? '—',
            icon: <BarChart3 className="w-5 h-5" />,
            delay: 1,
          },
          {
            label: 'Used Today',
            value: isLoading ? '—' : `${stats?.usedToday ?? 0} / ${stats?.dailyLimit ?? 50}`,
            icon: <Zap className="w-5 h-5" />,
            delay: 2,
          },
          {
            label: 'Last Activity',
            value: isLoading ? '—' : stats?.lastActivity
              ? new Date(stats.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : 'None',
            icon: <Clock className="w-5 h-5" />,
            delay: 3,
          },
        ].map(({ label, value, icon, delay }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay * 0.08 }}
            className="glass-card rounded-xl p-5 border border-[var(--outline-variant)] shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--primary-fixed)] text-[var(--primary)]">
                {icon}
              </div>
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--secondary)]">{label}</p>
            <p className="text-2xl font-black mt-1 text-[var(--on-surface)] tabular-nums">{value}</p>
          </motion.div>
        ))}
      </section>

      {/* Daily Usage Bar */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card rounded-xl p-6 border border-[var(--outline-variant)] shadow-sm"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-[var(--on-surface)]">Daily Limit Usage</h3>
            <p className="text-sm text-[var(--secondary)] mt-0.5">Resets every 24 hours</p>
          </div>
          <span className="text-sm font-bold text-[var(--primary)] bg-[var(--primary-fixed)] px-3 py-1 rounded-full">
            {usagePercent}% used
          </span>
        </div>
        <ProgressBar value={stats?.usedToday ?? 0} max={stats?.dailyLimit ?? 50} showLabel className="h-3" />
        <div className="flex justify-between mt-2 text-xs text-[var(--secondary)]">
          <span>{stats?.usedToday ?? 0} used</span>
          <span>{stats?.remainingToday ?? 50} remaining</span>
        </div>
      </motion.section>

      {/* Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-xl p-6 bg-[var(--primary)] text-[var(--on-primary)] shadow-lg"
      >
        <h3 className="text-xl font-black mb-2">Need more conversions?</h3>
        <p className="text-sm opacity-90 mb-4">
          Upgrade to Pro for unlimited conversions, priority processing, and API access.
        </p>
        <button className="px-6 py-2.5 bg-white text-[var(--primary)] rounded-xl font-bold text-sm hover:opacity-90 transition-opacity">
          Upgrade to Pro
        </button>
      </motion.div>
    </div>
  );
}
