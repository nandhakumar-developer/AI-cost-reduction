import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Users, CreditCard, FileText, HardDrive, DollarSign } from 'lucide-react';
import { adminService } from '../../services/admin.service';
import { formatBytes } from '../../utils/formatBytes';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

export default function AdminPage() {
  const [search, setSearch] = useState('');
  const queryClient = useQueryClient();

  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminService.getDashboard(),
  });

  const { data: users } = useQuery({
    queryKey: ['admin-users', search],
    queryFn: () => adminService.getUsers(search || undefined),
  });

  const { data: subscriptions } = useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: () => adminService.getSubscriptions(),
  });

  const reviewMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'APPROVED' | 'REJECTED' }) =>
      adminService.reviewSubscription(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      toast.success('Subscription reviewed');
    },
  });

  const banMutation = useMutation({
    mutationFn: ({ userId, banned }: { userId: string; banned: boolean }) =>
      adminService.banUser(userId, banned),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated');
    },
  });

  const resetMutation = useMutation({
    mutationFn: (userId: string) => adminService.resetQuota(userId),
    onSuccess: () => toast.success('Quota reset'),
  });

  return (
    <div className="min-h-screen bg-[var(--background)] p-6 ml-0">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black">Admin Dashboard</h1>
          <p className="text-sm text-[var(--secondary)] mt-1">Manage users, subscriptions, and platform stats.</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: 'Total Users', value: stats?.totalUsers ?? '—', icon: Users },
            { label: 'Pro Users', value: stats?.proUsers ?? '—', icon: CreditCard },
            { label: 'Conversions', value: stats?.conversions ?? '—', icon: FileText },
            { label: 'Storage', value: stats ? formatBytes(stats.storageUsed) : '—', icon: HardDrive },
            { label: 'Revenue', value: stats ? `$${stats.revenue?.toFixed(2)}` : '—', icon: DollarSign },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-xl border border-[var(--outline-variant)] p-4 bg-[var(--surface-container-lowest)]">
              <Icon className="w-5 h-5 text-[var(--primary)] mb-2" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary)]">{label}</p>
              <p className="text-xl font-black mt-1">{value}</p>
            </div>
          ))}
        </div>

        <section className="space-y-4">
          <h2 className="text-xl font-bold">Pending Subscriptions ({subscriptions?.length ?? 0})</h2>
          {subscriptions?.map((sub: { id: string; transactionId: string; user: { name: string; email: string } }) => (
            <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
              <div>
                <p className="font-semibold">{sub.user.name} · {sub.transactionId}</p>
                <p className="text-xs text-[var(--secondary)]">{sub.user.email}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="primary" onClick={() => reviewMutation.mutate({ id: sub.id, status: 'APPROVED' })}>Approve</Button>
                <Button size="sm" variant="danger" onClick={() => reviewMutation.mutate({ id: sub.id, status: 'REJECTED' })}>Reject</Button>
              </div>
            </div>
          ))}
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">Users</h2>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="px-3 py-2 rounded-lg border border-[var(--outline-variant)] text-sm outline-none"
            />
          </div>
          <div className="rounded-xl border border-[var(--outline-variant)] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[var(--surface-container-low)]">
                  {['Name', 'Email', 'Plan', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase text-[var(--secondary)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--outline-variant)]">
                {users?.map((u: { id: string; name: string; email: string; plan: string; banned: boolean; role: string }) => (
                  <tr key={u.id}>
                    <td className="px-4 py-3 text-sm font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-[var(--secondary)]">{u.email}</td>
                    <td className="px-4 py-3"><Badge>{u.plan}</Badge></td>
                    <td className="px-4 py-3">{u.banned ? <Badge variant="error">Banned</Badge> : <Badge variant="success">Active</Badge>}</td>
                    <td className="px-4 py-3 flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => banMutation.mutate({ userId: u.id, banned: !u.banned })}>
                        {u.banned ? 'Unban' : 'Ban'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => resetMutation.mutate(u.id)}>Reset Quota</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
