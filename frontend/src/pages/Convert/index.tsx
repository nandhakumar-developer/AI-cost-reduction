import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, UploadCloud } from 'lucide-react';
import { DropZone } from '../../components/upload/DropZone';
import { FileList } from '../../components/upload/FileList';
import { Button } from '../../components/common/Button';
import { useConvert } from '../../hooks/useConvert';
import { usageService } from '../../services/upload.service';
import { formatBytes } from '../../utils/formatBytes';

export default function ConvertPage() {
  const { data: stats } = useQuery({
    queryKey: ['usage-stats'],
    queryFn: () => usageService.getStats(),
  });

  const maxUpload = stats?.maxUploadBytes ?? 8 * 1024 * 1024;
  const { results, isConverting, convert, clearResults } = useConvert(maxUpload);

  const completedCount = results.filter((r) => r.status === 'completed').length;
  const hasResults = results.length > 0;

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-2xl font-black text-[var(--on-background)]">Convert Files</h2>
        <p className="text-sm text-[var(--secondary)] mt-1">
          Upload documents and convert them to AI-ready Markdown. Max {formatBytes(maxUpload)} combined per upload.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <DropZone onFiles={convert} disabled={isConverting} maxUploadBytes={maxUpload} />
      </motion.div>

      <AnimatePresence>
        {hasResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between bg-[var(--surface-container-low)] rounded-xl px-5 py-3 border border-[var(--outline-variant)]"
          >
            <div className="flex items-center gap-4 text-sm">
              <span className="text-[var(--secondary)]">
                <span className="font-bold text-[var(--on-surface)]">{results.length}</span> file{results.length !== 1 ? 's' : ''}
              </span>
              {completedCount > 0 && (
                <span className="text-[var(--secondary)]">
                  <span className="font-bold text-green-600">{completedCount}</span> completed
                </span>
              )}
              {isConverting && (
                <span className="flex items-center gap-1.5 text-[var(--primary)] font-medium">
                  <div className="w-3.5 h-3.5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
                  Converting…
                </span>
              )}
            </div>
            <Button variant="ghost" size="sm" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={clearResults} disabled={isConverting}>
              Clear All
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hasResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <FileList results={results} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!hasResults && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-[var(--secondary-container)] rounded-2xl flex items-center justify-center mb-4">
              <UploadCloud className="w-8 h-8 text-[var(--primary)]" />
            </div>
            <p className="font-semibold text-[var(--on-surface)]">No files yet</p>
            <p className="text-sm text-[var(--secondary)] mt-1 max-w-xs">
              Drag and drop files above or click to browse. Supports PDF, DOCX, PPTX, XLSX, images, and more.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
