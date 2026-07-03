import fs from 'fs/promises';
import path from 'path';
import type { Plan, DbUser } from '../types/index.js';
import { PLAN_LIMITS } from '../config/constants.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/apiResponse.js';
import { convertWithMarkItDown, fallbackMarkdown } from './conversion.service.js';
import { checkQuota, consumeQuota } from './usage.service.js';

export async function processConversion(user: DbUser, file: Express.Multer.File) {
  const limits = PLAN_LIMITS[user.plan as Plan];
  await checkQuota(user.id, user.plan, file.size);

  if (file.size > limits.maxUploadBytes) {
    throw new AppError(413, `File exceeds ${user.plan === 'PRO' ? '15MB' : '8MB'} upload limit`);
  }

  const start = Date.now();
  let markdown: string;
  let status: 'COMPLETED' | 'FAILED' = 'COMPLETED';

  try {
    markdown = await convertWithMarkItDown(file.path);
  } catch {
    try {
      const text = await fs.readFile(file.path, 'utf-8');
      markdown = fallbackMarkdown(file.originalname, text);
    } catch {
      markdown = fallbackMarkdown(file.originalname);
      status = 'COMPLETED';
    }
  }

  const processingTime = Date.now() - start;

  const history = await prisma.history.create({
    data: {
      userId: user.id,
      filename: file.originalname,
      filesize: file.size,
      markdown,
      processingTime,
      status,
    },
  });

  await consumeQuota(user.id, user.plan, file.size);

  try {
    await fs.unlink(file.path);
  } catch {
    // ignore cleanup errors
  }

  return {
    id: history.id,
    filename: history.filename,
    fileSize: history.filesize,
    status: 'completed' as const,
    markdown: history.markdown,
    processingTime: history.processingTime,
    createdAt: history.createdAt.toISOString(),
  };
}

export async function getHistory(
  userId: string,
  options: { search?: string; page?: number; limit?: number }
) {
  const page = options.page ?? 1;
  const limit = Math.min(options.limit ?? 10, 50);
  const skip = (page - 1) * limit;

  const where = {
    userId,
    ...(options.search
      ? { filename: { contains: options.search } }
      : {}),
  };

  const [items, total] = await Promise.all([
    prisma.history.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        filename: true,
        filesize: true,
        processingTime: true,
        status: true,
        createdAt: true,
        markdown: true,
      },
    }),
    prisma.history.count({ where }),
  ]);

  return {
    items: items.map((item: (typeof items)[number]) => ({
      id: item.id,
      filename: item.filename,
      fileType: path.extname(item.filename).replace('.', '').toUpperCase() || 'FILE',
      fileSize: item.filesize,
      status: item.status === 'COMPLETED' ? 'completed' : 'failed',
      processingTime: item.processingTime,
      markdownLength: item.markdown.length,
      createdAt: item.createdAt.toISOString(),
      markdown: item.markdown,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getHistoryById(userId: string, id: string) {
  const item = await prisma.history.findFirst({ where: { id, userId } });
  if (!item) throw new AppError(404, 'Conversion not found');
  return item;
}

export async function deleteHistory(userId: string, id: string) {
  const item = await prisma.history.findFirst({ where: { id, userId } });
  if (!item) throw new AppError(404, 'Conversion not found');
  await prisma.history.delete({ where: { id } });
}
