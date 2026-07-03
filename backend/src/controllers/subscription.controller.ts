import type { Response } from 'express';
import { z } from 'zod';
import {
  createSubscriptionRequest,
  getUserSubscriptions,
  PAYMENT_INSTRUCTIONS,
} from '../services/subscription.service.js';
import { success } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

const requestSchema = z.object({
  transactionId: z.string().min(3).max(100),
  screenshot: z.string().optional(),
});

export async function getSubscriptionInfo(req: AuthenticatedRequest, res: Response) {
  const subscriptions = await getUserSubscriptions(req.user!.id);
  res.json(
    success({
      plan: req.user!.plan,
      role: req.user!.role,
      paymentInstructions: PAYMENT_INSTRUCTIONS,
      subscriptions: subscriptions.map((s: (typeof subscriptions)[number]) => ({
        id: s.id,
        transactionId: s.transactionId,
        status: s.status,
        screenshot: s.screenshot,
        approvedAt: s.approvedAt?.toISOString() ?? null,
        expiresAt: s.expiresAt?.toISOString() ?? null,
        createdAt: s.createdAt.toISOString(),
      })),
    })
  );
}

export async function submitSubscriptionRequest(req: AuthenticatedRequest, res: Response) {
  const body = requestSchema.parse(req.body);
  const subscription = await createSubscriptionRequest(
    req.user!.id,
    body.transactionId,
    body.screenshot
  );

  res.status(201).json(
    success({
      id: subscription.id,
      status: subscription.status,
      transactionId: subscription.transactionId,
      createdAt: subscription.createdAt.toISOString(),
    })
  );
}
