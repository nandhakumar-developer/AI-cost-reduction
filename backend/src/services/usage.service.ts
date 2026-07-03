import type { Plan } from '../types/index.js';
import { PLAN_LIMITS } from '../config/constants.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/apiResponse.js';
import { addHours } from '../utils/helpers.js';

export async function getOrCreateUsage(userId: string, plan: Plan) {
  let usage = await prisma.usage.findUnique({ where: { userId } });
  const limits = PLAN_LIMITS[plan];

  if (!usage) {
    usage = await prisma.usage.create({
      data: {
        userId,
        usedBytes: 0,
        resetAt: addHours(new Date(), limits.resetHours),
        cycleCount: 0,
      },
    });
  }

  if (new Date() >= usage.resetAt) {
    usage = await prisma.usage.update({
      where: { userId },
      data: {
        usedBytes: 0,
        cycleCount: 0,
        resetAt: addHours(new Date(), limits.resetHours),
      },
    });
  }

  return usage;
}

export async function checkQuota(userId: string, plan: Plan, additionalBytes: number) {
  const limits = PLAN_LIMITS[plan];
  const usage = await getOrCreateUsage(userId, plan);

  if (plan === 'PRO' && usage.cycleCount >= limits.maxCycles) {
    throw new AppError(429, 'Your Pro conversion cycles have been exhausted.', 'QUOTA_EXCEEDED', {
      resetAt: usage.resetAt.toISOString(),
    });
  }

  if (usage.usedBytes + additionalBytes > limits.quotaBytes) {
    throw new AppError(429, 'Your free quota has been exhausted.', 'QUOTA_EXCEEDED', {
      resetAt: usage.resetAt.toISOString(),
      remainingBytes: Math.max(0, limits.quotaBytes - usage.usedBytes),
    });
  }

  return usage;
}

export async function consumeQuota(userId: string, plan: Plan, bytes: number) {
  const usage = await getOrCreateUsage(userId, plan);
  await prisma.usage.update({
    where: { userId },
    data: {
      usedBytes: usage.usedBytes + bytes,
      cycleCount: plan === 'PRO' ? usage.cycleCount + 1 : usage.cycleCount,
    },
  });
}

export async function getUsageStats(userId: string, plan: Plan) {
  const limits = PLAN_LIMITS[plan];
  const usage = await getOrCreateUsage(userId, plan);

  const totalConversions = await prisma.history.count({ where: { userId } });
  const filesProcessed = totalConversions;
  const lastHistory = await prisma.history.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  });

  return {
    totalConversions,
    filesProcessed,
    quotaBytes: limits.quotaBytes,
    usedBytes: usage.usedBytes,
    remainingBytes: Math.max(0, limits.quotaBytes - usage.usedBytes),
    maxUploadBytes: limits.maxUploadBytes,
    cycleCount: usage.cycleCount,
    maxCycles: plan === 'PRO' ? limits.maxCycles : null,
    resetAt: usage.resetAt.toISOString(),
    plan,
    role: plan,
    lastActivity: lastHistory?.createdAt.toISOString() ?? null,
  };
}

export async function resetUserQuota(userId: string, plan: Plan) {
  const limits = PLAN_LIMITS[plan];
  return prisma.usage.upsert({
    where: { userId },
    create: {
      userId,
      usedBytes: 0,
      cycleCount: 0,
      resetAt: addHours(new Date(), limits.resetHours),
    },
    update: {
      usedBytes: 0,
      cycleCount: 0,
      resetAt: addHours(new Date(), limits.resetHours),
    },
  });
}
