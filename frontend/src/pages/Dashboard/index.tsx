import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  RefreshCcw, FileText, Database, Timer,
  Download, FileUp
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { usageService } from '../../services/upload.service';
import { StatCard } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { StatusBadge } from '../../components/common/Badge';
import { formatBytes } from '../../utils/formatBytes';
import { useSession } from '../../hooks/useSession';
import { useQuotaReset } from '../../hooks/useQuotaReset';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }),
};

export default function DashboardPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { formattedTime } = useSession();
  const { formattedReset } = useQuotaReset();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: () => usageService.getStats(),
  });

  const { data: recent, isLoading: recentLoading } = useQuery({
    queryKey: ['recent-conversions'],
    queryFn: () => usageService.getRecentConversions(),
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] ?? 'User';

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h2 className="text-3xl font-black text-[var(--on-background)]">{greeting()}, {firstName}</h2>
          <p className="text-sm text-[var(--secondary)] mt-1">
            Plan: <span className="font-semibold text-[var(--primary)]">{user?.plan ?? 'FREE'}</span>
            {' · '}Quota resets in {formattedReset}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/dashboard/subscription')}
            className="px-4 py-2 rounded-xl border border-[var(--outline)] text-sm font-semibold text-[var(--on-surface)] hover:bg-[var(--surface-container)] transition-colors"
          >
            Upgrade
          </button>
          <button
            onClick={() => navigate('/dashboard/convert')}
            className="px-4 py-2 rounded-xl bg-[var(--primary)] text-[var(--on-primary)] text-sm font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <FileUp className="w-4 h-4" />
            Quick Upload
          </button>
        </div>
      </motion.section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Conversions',
            value: statsLoading ? '—' : String(stats?.totalConversions ?? 0),
            icon: <RefreshCcw className="w-5 h-5" />,
            badge: 'All time',
            delay: 0,
          },
          {
            label: 'Files Processed',
            value: statsLoading ? '—' : (stats?.filesProcessed ?? 0).toLocaleString(),
            icon: <FileText className="w-5 h-5" />,
            badge: 'Total',
            delay: 1,
          },
          {
            label: 'Quota Remaining',
            value: statsLoading ? '—' : formatBytes(stats?.remainingBytes ?? 0),
            icon: <Database className="w-5 h-5" />,
            badge: stats ? `/ ${formatBytes(stats.quotaBytes)}` : '',
            delay: 2,
          },
          {
            label: 'Session Remaining',
            value: formattedTime,
            icon: <Timer className="w-5 h-5" />,
            badge: 'Active',
            accent: true,
            delay: 3,
          },
        ].map(({ label, value, icon, badge, accent, delay }) => (
          <motion.div key={label} custom={delay} initial="hidden" animate="show" variants={fadeUp}>
            <StatCard label={label} value={String(value)} icon={icon} badge={badge} accent={accent}>
              {label === 'Quota Remaining' && stats && (
                <ProgressBar
                  value={stats.usedBytes}
                  max={stats.quotaBytes}
                  showLabel={false}
                  className="mt-2"
                />
              )}
            </StatCard>
          </motion.div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="lg:col-span-2 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--outline-variant)]">
            <h4 className="font-bold text-[var(--on-surface)]">Recent Conversions</h4>
            <button
              onClick={() => navigate('/dashboard/history')}
              className="text-sm text-[var(--primary)] font-semibold hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
                  {['File Name', 'Type', 'Size', 'Status', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--secondary)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--outline-variant)]">
                {recentLoading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <tr key={i}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <td key={j} className="px-5 py-4">
                          <div className="h-4 bg-[var(--surface-container)] rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : recent?.length ? recent.map((r) => (
                  <tr key={r.id} className="hover:bg-[var(--surface-container-low)] transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-[var(--primary)] flex-shrink-0" />
                        <span className="text-sm font-medium text-[var(--on-surface)] truncate max-w-[200px]">{r.filename}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--secondary)]">{r.fileType}</td>
                    <td className="px-5 py-4 text-sm text-[var(--secondary)]">{formatBytes(r.fileSize)}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => usageService.downloadHistory(r.id, r.filename)}
                        className="text-[var(--secondary)] hover:text-[var(--primary)] transition-colors"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-sm text-[var(--secondary)]">
                      No conversions yet. Upload your first file!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}
            className="glass-card rounded-xl p-5 border-l-4 border-[var(--primary)]"
          >
            <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary)] mb-4">Rate Limit Status</p>
            <div className="space-y-3">
              <ProgressBar value={stats?.usedBytes ?? 0} max={stats?.quotaBytes ?? 1} showLabel />
              <p className="text-xs text-[var(--secondary)]">
                Next reset: <span className="font-semibold text-[var(--on-surface)]">{formattedReset}</span>
              </p>
              {stats?.plan === 'PRO' && stats.maxCycles && (
                <p className="text-xs text-[var(--secondary)]">
                  Cycles: {stats.cycleCount} / {stats.maxCycles}
                </p>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
            className="relative overflow-hidden rounded-xl h-52 shadow-lg group cursor-pointer"
            onClick={() => navigate('/dashboard/convert')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-indigo-600 to-purple-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="relative z-10 p-5 h-full flex flex-col justify-end">
              <span className="inline-block bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest text-white mb-2">MarkItDown</span>
              <h5 className="text-white font-bold text-base mb-1">Convert to Markdown</h5>
              <p className="text-white/80 text-xs">Upload PDF, DOCX, PPTX, images and more.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
