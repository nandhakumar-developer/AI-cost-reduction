import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Database } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';
import { usageService } from '../../services/upload.service';
import { formatBytes } from '../../utils/formatBytes';
import { Button } from '../../components/common/Button';
import { useQuotaReset } from '../../hooks/useQuotaReset';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { formattedReset } = useQuotaReset();

  const { data: stats } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: () => usageService.getStats(),
  });

  if (!user) return null;

  return (
    <div className="space-y-8 max-w-2xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black">Profile</h2>
        <p className="text-sm text-[var(--secondary)] mt-1">Your account information and quota.</p>
      </motion.div>

      <div className="rounded-xl border border-[var(--outline-variant)] p-6 bg-[var(--surface-container-lowest)] flex items-center gap-5">
        <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
        <div>
          <h3 className="text-xl font-bold">{user.name}</h3>
          <p className="text-sm text-[var(--secondary)] flex items-center gap-1 mt-1">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </p>
          <p className="text-sm text-[var(--secondary)] flex items-center gap-1 mt-1">
            <Shield className="w-3.5 h-3.5" /> {user.role} · {user.plan}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--outline-variant)] p-5">
          <Database className="w-5 h-5 text-[var(--primary)] mb-2" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary)]">Quota Used</p>
          <p className="text-lg font-black mt-1">
            {formatBytes(stats?.usedBytes ?? 0)} / {formatBytes(stats?.quotaBytes ?? 0)}
          </p>
        </div>
        <div className="rounded-xl border border-[var(--outline-variant)] p-5">
          <User className="w-5 h-5 text-[var(--primary)] mb-2" />
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary)]">Next Reset</p>
          <p className="text-lg font-black mt-1">{formattedReset}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => logout()}>Logout</Button>
        <Button variant="ghost" onClick={() => alert('Account deletion requests are handled by support.')}>
          Request Account Deletion
        </Button>
      </div>
    </div>
  );
}
