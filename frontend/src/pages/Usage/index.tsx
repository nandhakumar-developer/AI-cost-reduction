import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { RefreshCcw, FileText, Zap, Clock, TrendingUp } from 'lucide-react';
import { usageService } from '../../services/usage.service';
import { StatCard } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08 } }),
};

const DAILY_BREAKDOWN = [
  { day: 'Mon', value: 8 },
  { day: 'Tue', value: 15 },
  { day: 'Wed', value: 12 },
  { day: 'Thu', value: 22 },
  { day: 'Fri', value: 18 },
  { day: 'Sat', value: 5 },
  { day: 'Sun', value: 12 },
];

export default function UsagePage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: () => usageService.getStats(),
  });

  const maxVal = Math.max(...DAILY_BREAKDOWN.map((d) => d.value));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-[var(--on-background)]">Usage & Analytics</h2>
        <p className="text-sm text-[var(--secondary)] mt-1">Track your conversion activity and daily limits.</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Conversions', value: isLoading ? '—' : stats?.totalConversions?.toLocaleString() ?? '0', icon: <RefreshCcw className="w-5 h-5" />, delay: 0 },
          { label: 'Files Processed', value: isLoading ? '—' : stats?.filesProcessed?.toLocaleString() ?? '0', icon: <FileText className="w-5 h-5" />, delay: 1 },
          { label: 'Used Today', value: isLoading ? '—' : `${stats?.usedToday ?? 0} / ${stats?.dailyLimit ?? 50}`, icon: <Zap className="w-5 h-5" />, delay: 2 },
          { label: 'Last Activity', value: isLoading ? '—' : (stats?.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : 'Never'), icon: <Clock className="w-5 h-5" />, delay: 3 },
        ].map(({ label, value, icon, delay }) => (
          <motion.div key={label} custom={delay} initial="hidden" animate="show" variants={fadeUp}>
            <StatCard label={label} value={String(value)} icon={icon} />
          </motion.div>
        ))}
      </div>

      {/* Daily Limit Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-[var(--surface-container-lowest)] rounded-xl p-6 border border-[var(--outline-variant)] shadow-sm"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold text-[var(--on-surface)]">Daily Conversion Limit</h3>
            <p className="text-sm text-[var(--secondary)] mt-0.5">
              {stats?.remainingToday ?? '—'} conversions remaining today
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-[var(--primary)]">{stats?.usedToday ?? 0}</p>
            <p className="text-xs text-[var(--secondary)]">of {stats?.dailyLimit ?? 50} used</p>
          </div>
        </div>
        <ProgressBar
          value={stats?.usedToday ?? 0}
          max={stats?.dailyLimit ?? 50}
          label="Daily usage"
        />
        <p className="text-xs text-[var(--secondary)] mt-3">
          Limit resets at midnight UTC. Need more? Upgrade your plan.
        </p>
      </motion.div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-[var(--surface-container-lowest)] rounded-xl p-6 border border-[var(--outline-variant)] shadow-sm"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
          <h3 className="font-bold text-[var(--on-surface)]">Weekly Activity</h3>
        </div>
        <div className="flex items-end gap-3 h-40">
          {DAILY_BREAKDOWN.map(({ day, value }) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-bold text-[var(--secondary)]">{value}</span>
              <div className="w-full relative bg-[var(--surface-container)] rounded-lg overflow-hidden" style={{ height: '100px' }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(value / maxVal) * 100}%` }}
                  transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
                  className="absolute bottom-0 w-full bg-[var(--primary)] rounded-lg opacity-80"
                />
              </div>
              <span className="text-[11px] text-[var(--secondary)]">{day}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
