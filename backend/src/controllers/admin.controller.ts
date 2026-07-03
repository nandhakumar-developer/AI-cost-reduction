import type { Response } from 'express';
import { z } from 'zod';
import {
  adminResetQuota,
  banUser,
  deleteUser,
  getAdminLogs,
  getDashboardStats,
  searchUsers,
} from '../services/admin.service.js';
import { getPendingSubscriptions, reviewSubscription } from '../services/subscription.service.js';
import { success } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { paramId } from '../utils/params.js';

export async function dashboard(req: AuthenticatedRequest, res: Response) {
  const stats = await getDashboardStats();
  res.json(success(stats));
}

export async function users(req: AuthenticatedRequest, res: Response) {
  const query = typeof req.query.q === 'string' ? req.query.q : undefined;
  const data = await searchUsers(query);
  res.json(success(data));
}

export async function ban(req: AuthenticatedRequest, res: Response) {
  const banned = req.body.banned !== false;
  const user = await banUser(req.user!.id, paramId(req.params.userId), banned);
  res.json(success(user));
}

export async function removeUser(req: AuthenticatedRequest, res: Response) {
  await deleteUser(req.user!.id, paramId(req.params.userId));
  res.json(success({ deleted: true }));
}

export async function resetQuota(req: AuthenticatedRequest, res: Response) {
  await adminResetQuota(req.user!.id, paramId(req.params.userId));
  res.json(success({ reset: true }));
}

export async function subscriptions(req: AuthenticatedRequest, res: Response) {
  const data = await getPendingSubscriptions();
  res.json(success(data));
}

const reviewSchema = z.object({
  status: z.enum(['APPROVED', 'REJECTED']),
});

export async function reviewSub(req: AuthenticatedRequest, res: Response) {
  const { status } = reviewSchema.parse(req.body);
  const updated = await reviewSubscription(paramId(req.params.id), req.user!.id, status);
  res.json(success(updated));
}

export async function logs(req: AuthenticatedRequest, res: Response) {
  const data = await getAdminLogs();
  res.json(success(data));
}
