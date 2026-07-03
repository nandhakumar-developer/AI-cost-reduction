import type { Response } from 'express';
import { z } from 'zod';
import {
  deleteHistory,
  getHistory,
  getHistoryById,
} from '../services/history.service.js';
import { getUsageStats } from '../services/usage.service.js';
import { mdFilename } from '../utils/helpers.js';
import { success } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { paramId } from '../utils/params.js';

const querySchema = z.object({
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(50).optional(),
});

export async function listHistory(req: AuthenticatedRequest, res: Response) {
  const query = querySchema.parse(req.query);
  const data = await getHistory(req.user!.id, query);
  res.json(success(data));
}

export async function getRecent(req: AuthenticatedRequest, res: Response) {
  const data = await getHistory(req.user!.id, { limit: 5 });
  res.json(success(data.items));
}

export async function getStats(req: AuthenticatedRequest, res: Response) {
  const stats = await getUsageStats(req.user!.id, req.user!.plan);
  res.json(success(stats));
}

export async function getOne(req: AuthenticatedRequest, res: Response) {
  const item = await getHistoryById(req.user!.id, paramId(req.params.id));
  res.json(success(item));
}

export async function removeOne(req: AuthenticatedRequest, res: Response) {
  await deleteHistory(req.user!.id, paramId(req.params.id));
  res.json(success({ deleted: true }));
}

export async function downloadMarkdown(req: AuthenticatedRequest, res: Response) {
  const item = await getHistoryById(req.user!.id, paramId(req.params.id));
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${mdFilename(item.filename)}"`);
  res.send(item.markdown);
}
