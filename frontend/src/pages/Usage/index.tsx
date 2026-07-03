import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Clock, Zap } from 'lucide-react';
import { usageService } from '../../services/upload.service';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { formatBytes } from '../../utils/formatBytes';
import { useQuotaReset } from '../../hooks/useQuotaReset';

export default function UsagePage() {
  const navigate = useNavigate();
  const { formattedReset } = useQuotaReset();
  const { data: stats, isLoading } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: () => usageService.getStats(),
  });

  const usagePercent = stats
    ? Math.round((stats.usedBytes / stats.quotaBytes) * 100)
    : 0;

  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-black text-[var(--on-background)]">Usage & Analytics</h2>
        <p className="text-sm text-[var(--secondary)] mt-1">Track your conversion quota and activity.</p>
      </motion.section>

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
            label: 'Quota Used',
            value: isLoading ? '—' : `${formatBytes(stats?.usedBytes ?? 0)} / ${formatBytes(stats?.quotaBytes ?? 0)}`,
            icon: <Zap className="w-5 h-5" />,
            delay: 2,
          },
          {
            label: 'Next Reset',
            value: formattedReset,
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

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card rounded-xl p-6 border border-[var(--outline-variant)] shadow-sm"
      >
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-bold text-[var(--on-surface)]">Quota Usage</h3>
            <p className="text-sm text-[var(--secondary)] mt-0.5">Resets every 42 hours</p>
          </div>
          <span className="text-sm font-bold text-[var(--primary)] bg-[var(--primary-fixed)] px-3 py-1 rounded-full">
            {usagePercent}% used
          </span>
        </div>
        <ProgressBar value={stats?.usedBytes ?? 0} max={stats?.quotaBytes ?? 1} showLabel className="h-3" />
        <div className="flex justify-between mt-2 text-xs text-[var(--secondary)]">
          <span>{formatBytes(stats?.usedBytes ?? 0)} used</span>
          <span>{formatBytes(stats?.remainingBytes ?? 0)} remaining</span>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="rounded-xl p-6 bg-[var(--primary)] text-[var(--on-primary)] shadow-lg"
      >
        <h3 className="text-xl font-black mb-2">Need more quota?</h3>
        <p className="text-sm opacity-90 mb-4">
          Upgrade to Pro for 15MB uploads and 10 conversion cycles per reset period.
        </p>
        <button
          onClick={() => navigate('/dashboard/subscription')}
          className="px-6 py-2.5 bg-white text-[var(--primary)] rounded-xl font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Upgrade to Pro
        </button>
      </motion.div>
    </div>
  );
}
