import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { ConversionResult } from '../../types';
import { FileCard } from './FileCard';
import { MarkdownPreview } from '../markdown/MarkdownPreview';

interface FileListProps {
  results: ConversionResult[];
}

export function FileList({ results }: FileListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (results.length === 0) return null;

  return (
    <div className="space-y-3">
      <AnimatePresence initial={false}>
        {results.map((result) => (
          <div key={result.id}>
            <FileCard
              result={result}
              isExpanded={expandedId === result.id}
              onToggle={() => setExpandedId((prev) => (prev === result.id ? null : result.id))}
            />
            <AnimatePresence>
              {expandedId === result.id && result.status === 'completed' && result.markdown && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2">
                    <MarkdownPreview
                      markdown={result.markdown}
                      filename={result.filename}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
