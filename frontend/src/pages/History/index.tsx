import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Download, Trash2, Eye, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { usageService } from '../../services/upload.service';
import { formatBytes } from '../../utils/formatBytes';
import { StatusBadge } from '../../components/common/Badge';
import { MarkdownPreview } from '../../components/markdown/MarkdownPreview';
import { Button } from '../../components/common/Button';

export default function HistoryPage() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewId, setViewId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['history', search, page],
    queryFn: () => usageService.getHistory({ search: search || undefined, page, limit: 10 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usageService.deleteHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['history'] });
      queryClient.invalidateQueries({ queryKey: ['recent-conversions'] });
      toast.success('Conversion deleted');
    },
    onError: () => toast.error('Failed to delete'),
  });

  const viewed = data?.items.find((i) => i.id === viewId);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black">Conversion History</h2>
        <p className="text-sm text-[var(--secondary)] mt-1">Search, view, download, or delete past conversions.</p>
      </motion.div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--secondary)]" />
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by filename..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] text-sm outline-none focus:ring-2 focus:ring-[var(--primary-container)]"
        />
      </div>

      <div className="rounded-xl border border-[var(--outline-variant)] overflow-hidden bg-[var(--surface-container-lowest)]">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--surface-container-low)] border-b border-[var(--outline-variant)]">
              {['Filename', 'Size', 'Date', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-[var(--secondary)]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--outline-variant)]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} className="px-4 py-4"><div className="h-4 bg-[var(--surface-container)] rounded animate-pulse" /></td>
                  ))}
                </tr>
              ))
            ) : data?.items.length ? data.items.map((item) => (
              <tr key={item.id} className="hover:bg-[var(--surface-container-low)]">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--primary)]" />
                    <span className="text-sm font-medium truncate max-w-[200px]">{item.filename}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-[var(--secondary)]">{formatBytes(item.fileSize)}</td>
                <td className="px-4 py-3 text-sm text-[var(--secondary)]">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <button onClick={() => setViewId(viewId === item.id ? null : item.id)} className="p-1.5 rounded-lg hover:bg-[var(--surface-container)] text-[var(--secondary)] hover:text-[var(--primary)]">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => usageService.downloadHistory(item.id, item.filename)} className="p-1.5 rounded-lg hover:bg-[var(--surface-container)] text-[var(--secondary)] hover:text-[var(--primary)]">
                      <Download className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteMutation.mutate(item.id)} className="p-1.5 rounded-lg hover:bg-[var(--error-container)] text-[var(--secondary)] hover:text-[var(--error)]">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-[var(--secondary)]">No conversions found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-sm text-[var(--secondary)] self-center">Page {page} of {data.pagination.totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= data.pagination.totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}

      {viewed?.markdown && (
        <MarkdownPreview markdown={viewed.markdown} filename={viewed.filename} />
      )}
    </div>
  );
}
