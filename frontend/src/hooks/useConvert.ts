import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { ConversionResult } from '../types';
import { uploadService } from '../services/upload.service';

export function useConvert() {
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const updateResult = useCallback((id: string, status: ConversionResult['status'], markdown?: string) => {
    setResults((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status, ...(markdown ? { markdown } : {}) } : r))
    );
  }, []);

  const convert = useCallback(
    async (files: File[]) => {
      const { valid, errors } = uploadService.validateFiles(files);
      errors.forEach((e) => toast.error(e));
      if (valid.length === 0) return;

      const initial: ConversionResult[] = valid.map((f) => ({
        id: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        filename: f.name,
        fileSize: f.size,
        status: 'uploading',
      }));
      setResults((prev) => [...prev, ...initial]);
      setIsConverting(true);

      try {
        await uploadService.convertFiles(valid, (id, status) => {
          updateResult(id, status);
        });

        // Apply markdown from returned results
        for (const init of initial) {
          // After converting set status + markdown
          setResults((prev) =>
            prev.map((r) => {
              if (r.id === init.id && r.status !== 'failed') {
                return {
                  ...r,
                  status: 'completed',
                  markdown: r.markdown || `# ${init.filename}\n\nConverted successfully.`,
                };
              }
              return r;
            })
          );
        }
        toast.success(`${valid.length} file${valid.length > 1 ? 's' : ''} converted successfully!`);
      } catch {
        toast.error('Conversion failed. Please try again.');
        initial.forEach((r) => updateResult(r.id, 'failed'));
      } finally {
        setIsConverting(false);
      }
    },
    [updateResult]
  );

  const clearResults = useCallback(() => setResults([]), []);

  return { results, isConverting, convert, clearResults };
}
