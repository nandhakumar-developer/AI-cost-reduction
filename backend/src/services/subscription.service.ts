import type { SubscriptionStatus } from '../types/index.js';
import { PRO_SUBSCRIPTION_DAYS } from '../config/constants.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/apiResponse.js';

export async function createSubscriptionRequest(
  userId: string,
  transactionId: string,
  screenshot?: string
) {
  const existing = await prisma.subscription.findFirst({
    where: { userId, status: 'PENDING' },
  });

  if (existing) {
    throw new AppError(409, 'You already have a pending subscription request');
  }

  return prisma.subscription.create({
    data: { userId, transactionId, screenshot },
  });
}

export async function getUserSubscriptions(userId: string) {
  return prisma.subscription.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPendingSubscriptions() {
  return prisma.subscription.findMany({
    where: { status: 'PENDING' },
    include: { user: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function reviewSubscription(
  subscriptionId: string,
  adminId: string,
  status: Extract<SubscriptionStatus, 'APPROVED' | 'REJECTED'>
) {
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: { user: true },
  });

  if (!subscription) throw new AppError(404, 'Subscription not found');
  if (subscription.status !== 'PENDING') {
    throw new AppError(409, 'Subscription has already been reviewed');
  }

  const expiresAt =
    status === 'APPROVED'
      ? new Date(Date.now() + PRO_SUBSCRIPTION_DAYS * 24 * 60 * 60 * 1000)
      : null;

  const [updated] = await prisma.$transaction([
    prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status,
        approvedBy: adminId,
        approvedAt: new Date(),
        expiresAt,
      },
    }),
    ...(status === 'APPROVED'
      ? [
          prisma.user.update({
            where: { id: subscription.userId },
            data: { role: 'PRO', plan: 'PRO' },
          }),
        ]
      : []),
    prisma.adminLog.create({
      data: {
        adminId,
        action: `SUBSCRIPTION_${status}`,
        details: JSON.stringify({ subscriptionId, userId: subscription.userId }),
      },
    }),
  ]);

  return updated;
}

export const PAYMENT_INSTRUCTIONS = {
  title: 'Manual Payment Instructions',
  steps: [
    'Transfer the Pro plan fee to the account below.',
    'Save your transaction ID from the payment receipt.',
    'Submit the transaction ID (and optional screenshot) on this page.',
    'An admin will review and activate your Pro plan within 24 hours.',
  ],
  bankDetails: {
    accountName: 'MarkItDown SaaS',
    accountNumber: '1234567890',
    bank: 'Example Bank',
    reference: 'PRO-SUBSCRIPTION',
  },
  amount: '$9.99/month',
};
