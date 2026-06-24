import type { ConversionResult } from '../types';

const SUPPORTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
];

const MOCK_MARKDOWN = (filename: string) => `# ${filename.replace(/\.[^.]+$/, '')}

## Overview

This document has been converted to AI-ready Markdown using **Microsoft MarkItDown**.

## Key Sections

### Introduction

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

### Data Table

| Column A | Column B | Column C |
|----------|----------|----------|
| Value 1  | Value 2  | Value 3  |
| Data A   | Data B   | Data C   |

### Summary

- ✅ Document structure preserved
- ✅ Tables converted to Markdown format
- ✅ Headings retained
- ✅ Ready for Claude, ChatGPT, Gemini

\`\`\`python
# Example code block preserved
def process_data(items):
    return [item.transform() for item in items]
\`\`\`

> **Note:** This Markdown is optimized for LLM context windows.
`;

export const uploadService = {
  validateFiles: (files: File[]): { valid: File[]; errors: string[] } => {
    const valid: File[] = [];
    const errors: string[] = [];
    let totalSize = 0;

    if (files.length > 10) {
      errors.push('Maximum 10 files per upload.');
      return { valid: [], errors };
    }

    for (const file of files) {
      totalSize += file.size;
      if (!SUPPORTED_TYPES.includes(file.type) && !file.name.match(/\.(pdf|docx|pptx|xlsx|png|jpg|jpeg)$/i)) {
        errors.push(`"${file.name}" is not a supported file type.`);
        continue;
      }
      valid.push(file);
    }

    if (totalSize > 30 * 1024 * 1024) {
      errors.push('Total upload size exceeds 30MB limit.');
      return { valid: [], errors };
    }

    return { valid, errors };
  },

  /** Phase 1: simulates upload + conversion with progress callbacks */
  convertFiles: async (
    files: File[],
    onProgress: (id: string, status: ConversionResult['status']) => void
  ): Promise<ConversionResult[]> => {
    const results: ConversionResult[] = files.map((f) => ({
      id: `conv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      filename: f.name,
      fileSize: f.size,
      status: 'uploading' as const,
    }));

    for (const result of results) {
      // Phase 1 mock — simulate pipeline
      onProgress(result.id, 'uploading');
      await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));

      onProgress(result.id, 'processing');
      await new Promise((r) => setTimeout(r, 1000 + Math.random() * 800));

      result.status = 'completed';
      result.markdown = MOCK_MARKDOWN(result.filename);
      onProgress(result.id, 'completed');
    }

    return results;
  },
};
