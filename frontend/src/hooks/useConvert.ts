import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import type { ConversionResult } from '../types';
import { uploadService, usageService } from '../services/upload.service';

export function useConvert(maxUploadBytes = 8 * 1024 * 1024) {
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const updateResult = useCallback(
    (id: string, patch: Partial<ConversionResult>) => {
      setResults((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
      );
    },
    []
  );

  const convert = useCallback(
    async (files: File[]) => {
      const { valid, errors } = uploadService.validateFiles(files, maxUploadBytes);
      errors.forEach((e) => toast.error(e));
      if (valid.length === 0) return;

      const localIds = new Map<string, string>();
      const initial: ConversionResult[] = valid.map((f) => {
        const id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        localIds.set(f.name, id);
        return {
          id,
          filename: f.name,
          fileSize: f.size,
          status: 'uploading' as const,
        };
      });

      setResults((prev) => [...prev, ...initial]);
      setIsConverting(true);

      try {
        const apiResults = await uploadService.convertFiles(
          valid,
          (id, status) => updateResult(id, { status }),
          localIds
        );

        setResults((prev) =>
          prev.map((r) => {
            const apiResult = apiResults.find(
              (ar) => localIds.get(ar.filename) === r.id || ar.filename === r.filename
            );
            if (!apiResult) return r;
            return {
              ...r,
              id: apiResult.id,
              status: apiResult.status,
              markdown: apiResult.markdown,
              processingTime: apiResult.processingTime,
              createdAt: apiResult.createdAt,
            };
          })
        );

        toast.success(`${valid.length} file${valid.length > 1 ? 's' : ''} converted successfully!`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Conversion failed.');
        initial.forEach((r) => updateResult(r.id, { status: 'failed' }));
      } finally {
        setIsConverting(false);
      }
    },
    [maxUploadBytes, updateResult]
  );

  const clearResults = useCallback(() => setResults([]), []);

  return { results, isConverting, convert, clearResults };
}

export { usageService };
