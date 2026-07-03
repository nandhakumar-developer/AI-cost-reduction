import type { Response } from 'express';
import { z } from 'zod';
import {
  loginWithGoogle,
  logout,
  toAuthUser,
} from '../services/auth.service.js';
import { getUsageStats } from '../services/usage.service.js';
import { env } from '../config/env.js';
import { success } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from '../middleware/auth.js';

const googleSchema = z.object({
  credential: z.string().min(1),
});

export async function googleAuth(req: AuthenticatedRequest, res: Response) {
  const { credential } = googleSchema.parse(req.body);
  const result = await loginWithGoogle(credential);

  res.cookie('token', result.token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: 'strict',
    maxAge: 8 * 60 * 60 * 1000,
  });

  res.json(
    success({
      user: result.user,
      session: {
        token: result.token,
        expiresAt: result.expiresAt,
      },
    })
  );
}

export async function logoutUser(req: AuthenticatedRequest, res: Response) {
  if (req.user) {
    await logout(req.user.id);
  }

  res.clearCookie('token');
  res.json(success({ message: 'Logged out' }));
}

export async function getMe(req: AuthenticatedRequest, res: Response) {
  if (!req.user) {
    res.status(401).json({ success: false, error: { message: 'Unauthorized' } });
    return;
  }

  const usage = await getUsageStats(req.user.id, req.user.plan);

  res.json(
    success({
      user: toAuthUser(req.user),
      usage,
    })
  );
}
