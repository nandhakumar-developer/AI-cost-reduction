import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, FilePlus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { formatBytes } from '../../utils/formatBytes';

const ACCEPTED =
  '.pdf,.doc,.docx,.txt,.rtf,.ppt,.pptx,.xls,.xlsx,.csv,.png,.jpg,.jpeg,.webp,.gif,.bmp,.tiff,.tif,.md,.html,.htm,.zip';

interface DropZoneProps {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  maxUploadBytes?: number;
}

export function DropZone({ onFiles, disabled, className, maxUploadBytes = 8 * 1024 * 1024 }: DropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onFiles(files);
    },
    [onFiles, disabled]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) onFiles(files);
    e.target.value = '';
  };

  return (
    <motion.div
      animate={{ scale: isDragging ? 1.01 : 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer select-none min-h-[220px] p-8',
        isDragging
          ? 'border-[var(--primary)] bg-[var(--secondary-container)] shadow-lg'
          : 'border-[var(--outline-variant)] bg-[var(--surface-container-low)] hover:border-[var(--primary)] hover:bg-[var(--secondary-container)]',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input ref={inputRef} type="file" multiple accept={ACCEPTED} onChange={handleChange} className="hidden" disabled={disabled} />

      <AnimatePresence mode="wait">
        {isDragging ? (
          <motion.div key="dragging" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
            className="w-16 h-16 bg-[var(--primary)] rounded-2xl flex items-center justify-center shadow-lg animate-pulse-glow">
            <FilePlus className="w-8 h-8 text-white" />
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="w-16 h-16 bg-[var(--secondary-container)] rounded-2xl flex items-center justify-center">
            <CloudUpload className="w-8 h-8 text-[var(--primary)]" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center">
        <p className="font-bold text-[var(--on-surface)] text-base">
          {isDragging ? 'Release to upload' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-[var(--secondary)] mt-1">
          or <span className="text-[var(--primary)] font-semibold">browse files</span>
        </p>
        <p className="text-[11px] text-[var(--secondary)] mt-3 font-medium">
          PDF · DOCX · PPTX · XLSX · CSV · Images · HTML · MD
        </p>
        <p className="text-[11px] text-[var(--secondary)]">Max 10 files · {formatBytes(maxUploadBytes)} total</p>
      </div>
    </motion.div>
  );
}
