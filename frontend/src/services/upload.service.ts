import { api, getErrorMessage } from './api';
import type { ConversionResult, UsageStats, RecentConversion, PaginatedHistory } from '../types';

const ACCEPTED_EXTENSIONS =
  /\.(pdf|docx?|pptx?|xlsx?|csv|txt|rtf|png|jpe?g|webp|gif|bmp|tiff?|md|html?|zip)$/i;

export const uploadService = {
  validateFiles: (
    files: File[],
    maxUploadBytes: number
  ): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];
    let totalSize = 0;

    if (files.length > 10) {
      errors.push('Maximum 10 files per upload.');
      return { valid: [], errors };
    }

    for (const file of files) {
      totalSize += file.size;
      if (!ACCEPTED_EXTENSIONS.test(file.name)) {
        errors.push(`"${file.name}" is not a supported file type.`);
        continue;
      }
      valid.push(file);
    }

    if (totalSize > maxUploadBytes) {
      const mb = Math.round(maxUploadBytes / (1024 * 1024));
      errors.push(`Total upload size exceeds ${mb}MB limit.`);
      return { valid: [], errors };
    }

    return { valid, errors };
  },

  convertFiles: async (
    files: File[],
    onProgress: (id: string, status: ConversionResult['status']) => void,
    localIds: Map<string, string>
  ): Promise<ConversionResult[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    files.forEach((file) => {
      const id = localIds.get(file.name);
      if (id) onProgress(id, 'uploading');
    });

    try {
      const { data } = await api.post<{
        success: boolean;
        data: { results: ConversionResult[] };
      }>('/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: () => {
          files.forEach((file) => {
            const id = localIds.get(file.name);
            if (id) onProgress(id, 'processing');
          });
        },
      });

      const results = data.data.results;
      results.forEach((result) => {
        const localId = localIds.get(result.filename);
        if (localId) onProgress(localId, result.status);
      });

      return results;
    } catch (error) {
      throw new Error(getErrorMessage(error));
    }
  },
};

export const usageService = {
  getStats: async (): Promise<UsageStats> => {
    const { data } = await api.get<{ success: boolean; data: UsageStats }>('/history/stats');
    return data.data;
  },

  getRecentConversions: async (): Promise<RecentConversion[]> => {
    const { data } = await api.get<{ success: boolean; data: RecentConversion[] }>(
      '/history/recent'
    );
    return data.data;
  },

  getHistory: async (params: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedHistory> => {
    const { data } = await api.get<{ success: boolean; data: PaginatedHistory }>('/history', {
      params,
    });
    return data.data;
  },

  deleteHistory: async (id: string): Promise<void> => {
    await api.delete(`/history/${id}`);
  },

  downloadHistory: async (id: string, filename: string): Promise<void> => {
    const response = await api.get(`/history/${id}/download`, { responseType: 'blob' });
    const url = URL.createObjectURL(response.data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename.replace(/\.[^.]+$/, '') + '.md';
    a.click();
    URL.revokeObjectURL(url);
  },
};
