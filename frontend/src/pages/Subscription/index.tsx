import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Check, Clock, X } from 'lucide-react';
import { subscriptionService } from '../../services/subscription.service';
import { useAuthStore } from '../../store/authStore';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';

const schema = z.object({
  transactionId: z.string().min(3, 'Transaction ID is required'),
  screenshot: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function SubscriptionPage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionService.getInfo(),
  });

  const mutation = useMutation({
    mutationFn: (values: FormData) =>
      subscriptionService.submitRequest(values.transactionId, values.screenshot),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      toast.success('Subscription request submitted!');
      reset();
    },
    onError: () => toast.error('Failed to submit request'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const statusIcon = (status: string) => {
    if (status === 'APPROVED') return <Check className="w-4 h-4 text-green-600" />;
    if (status === 'REJECTED') return <X className="w-4 h-4 text-red-600" />;
    return <Clock className="w-4 h-4 text-amber-600" />;
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black">Subscription</h2>
        <p className="text-sm text-[var(--secondary)] mt-1">Manage your plan and upgrade to Pro.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[var(--outline-variant)] p-5 bg-[var(--surface-container-lowest)]">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--secondary)]">Current Plan</p>
          <p className="text-3xl font-black text-[var(--primary)] mt-1">{user?.plan ?? 'FREE'}</p>
          <ul className="mt-4 space-y-2 text-sm text-[var(--secondary)]">
            <li>Free: 8MB upload & quota, 42h reset</li>
            <li>Pro: 15MB upload, 10 cycles, 42h reset</li>
          </ul>
        </div>

        {!isLoading && data?.paymentInstructions && (
          <div className="rounded-xl border border-[var(--outline-variant)] p-5 bg-[var(--surface-container-low)]">
            <p className="font-bold mb-2">{data.paymentInstructions.title}</p>
            <p className="text-sm text-[var(--secondary)] mb-3">{data.paymentInstructions.amount}</p>
            <ol className="text-sm space-y-1 list-decimal list-inside text-[var(--secondary)]">
              {data.paymentInstructions.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <div className="mt-3 p-3 rounded-lg bg-[var(--surface-container-lowest)] text-xs font-mono">
              {data.paymentInstructions.bankDetails.bank}: {data.paymentInstructions.bankDetails.accountNumber}
            </div>
          </div>
        )}
      </div>

      {user?.plan !== 'PRO' && (
        <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="rounded-xl border border-[var(--outline-variant)] p-6 space-y-4 bg-[var(--surface-container-lowest)]">
          <h3 className="font-bold">Submit Payment</h3>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--secondary)]">Transaction ID</label>
            <input {...register('transactionId')} className="w-full mt-1 px-4 py-2.5 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-bright)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary-container)]" />
            {errors.transactionId && <p className="text-xs text-[var(--error)] mt-1">{errors.transactionId.message}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-[var(--secondary)]">Screenshot URL (optional)</label>
            <input {...register('screenshot')} placeholder="https://..." className="w-full mt-1 px-4 py-2.5 rounded-lg border border-[var(--outline-variant)] bg-[var(--surface-bright)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary-container)]" />
          </div>
          <Button type="submit" variant="primary" disabled={mutation.isPending}>
            {mutation.isPending ? 'Submitting…' : 'Submit Request'}
          </Button>
        </form>
      )}

      <div className="space-y-3">
        <h3 className="font-bold">Request History</h3>
        {data?.subscriptions.length ? data.subscriptions.map((sub) => (
          <div key={sub.id} className="flex items-center justify-between p-4 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]">
            <div className="flex items-center gap-3">
              {statusIcon(sub.status)}
              <div>
                <p className="text-sm font-semibold">{sub.transactionId}</p>
                <p className="text-xs text-[var(--secondary)]">{new Date(sub.createdAt).toLocaleString()}</p>
              </div>
            </div>
            <Badge variant={sub.status === 'APPROVED' ? 'success' : sub.status === 'REJECTED' ? 'error' : 'warning'}>
              {sub.status}
            </Badge>
          </div>
        )) : (
          <p className="text-sm text-[var(--secondary)]">No subscription requests yet.</p>
        )}
      </div>
    </div>
  );
}
