import { motion } from 'framer-motion';
import { FileText, FileImage, FileSpreadsheet, FileType, AlertCircle } from 'lucide-react';
import type { ConversionResult } from '../../types';
import { StatusBadge } from '../common/Badge';
import { formatBytes } from '../../utils/formatBytes';
import { cn } from '../../utils/cn';

const getFileIcon = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (['png', 'jpg', 'jpeg'].includes(ext ?? '')) return <FileImage className="w-5 h-5" />;
  if (['xlsx'].includes(ext ?? '')) return <FileSpreadsheet className="w-5 h-5" />;
  if (['pdf'].includes(ext ?? '')) return <FileType className="w-5 h-5" />;
  return <FileText className="w-5 h-5" />;
};

interface FileCardProps {
  result: ConversionResult;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function FileCard({ result, isExpanded, onToggle }: FileCardProps) {
  const isCompleted = result.status === 'completed';
  const isFailed = result.status === 'failed';
  const isProcessing = result.status === 'processing' || result.status === 'uploading';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className={cn(
        'rounded-xl border transition-all duration-200',
        isCompleted ? 'border-[var(--outline-variant)] bg-[var(--surface-container-lowest)]' : '',
        isFailed ? 'border-[var(--error-container)] bg-[var(--error-container)]' : '',
        isProcessing ? 'border-[var(--primary-fixed)] bg-[var(--surface-container-low)]' : ''
      )}
    >
      <div
        className={cn('flex items-center gap-3 p-4', isCompleted && 'cursor-pointer hover:bg-[var(--surface-container-low)] rounded-xl transition-colors')}
        onClick={isCompleted ? onToggle : undefined}
      >
        {/* Icon */}
        <div className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
          isFailed ? 'bg-[var(--error-container)] text-[var(--error)]' : 'bg-[var(--secondary-container)] text-[var(--primary)]'
        )}>
          {isFailed ? <AlertCircle className="w-5 h-5" /> : getFileIcon(result.filename)}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--on-surface)] truncate">{result.filename}</p>
          <p className="text-xs text-[var(--secondary)]">{formatBytes(result.fileSize)}</p>
          {isFailed && result.error && (
            <p className="text-xs text-[var(--error)] mt-0.5">{result.error}</p>
          )}
        </div>

        {/* Status + processing indicator */}
        <div className="flex items-center gap-3">
          {isProcessing && (
            <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          )}
          <StatusBadge status={result.status} />
          {isCompleted && (
            <motion.span
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="text-[var(--secondary)] text-sm font-bold"
            >
              ▼
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
