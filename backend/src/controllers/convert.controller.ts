import type { Response } from 'express';
import { processConversion } from '../services/history.service.js';
import { validateUploadBatch, upload } from '../middleware/upload.js';
import { success } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

export const uploadMiddleware = upload.array('files');

export async function convertFiles(req: AuthenticatedRequest, res: Response) {
  const files = validateUploadBatch(req);
  const results = [];

  for (const file of files) {
    const result = await processConversion(req.user!, file);
    results.push(result);
  }

  res.json(success({ results }));
}
