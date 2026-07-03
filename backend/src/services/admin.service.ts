import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/apiResponse.js';
import { resetUserQuota } from './usage.service.js';

export async function getDashboardStats() {
  const [totalUsers, proUsers, conversions, pendingPayments] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { plan: 'PRO' } }),
    prisma.history.count(),
    prisma.subscription.count({ where: { status: 'PENDING' } }),
  ]);

  const storageAgg = await prisma.history.aggregate({ _sum: { filesize: true } });

  return {
    totalUsers,
    proUsers,
    conversions,
    storageUsed: storageAgg._sum.filesize ?? 0,
    revenue: proUsers * 9.99,
    pendingPayments,
  };
}

export async function searchUsers(query?: string) {
  return prisma.user.findMany({
    where: query
      ? {
          OR: [
            { email: { contains: query } },
            { name: { contains: query } },
          ],
        }
      : undefined,
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: { usage: true },
  });
}

export async function banUser(adminId: string, userId: string, banned: boolean) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { banned, sessionId: banned ? null : undefined },
  });

  await prisma.adminLog.create({
    data: {
      adminId,
      action: banned ? 'USER_BANNED' : 'USER_UNBANNED',
      details: JSON.stringify({ userId }),
    },
  });

  return user;
}

export async function deleteUser(adminId: string, userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'User not found');
  if (user.role === 'ADMIN') throw new AppError(403, 'Cannot delete admin users');

  await prisma.user.delete({ where: { id: userId } });

  await prisma.adminLog.create({
    data: {
      adminId,
      action: 'USER_DELETED',
      details: JSON.stringify({ userId, email: user.email }),
    },
  });
}

export async function adminResetQuota(adminId: string, userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(404, 'User not found');

  await resetUserQuota(userId, user.plan);

  await prisma.adminLog.create({
    data: {
      adminId,
      action: 'QUOTA_RESET',
      details: JSON.stringify({ userId }),
    },
  });
}

export async function getAdminLogs(limit = 50) {
  return prisma.adminLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: { admin: { select: { id: true, name: true, email: true } } },
  });
}
