import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { v4 as uuidv4 } from 'uuid';
import type { Plan, Role, DbUser } from '../types/index.js';
import { env } from '../config/env.js';
import { PLAN_LIMITS } from '../config/constants.js';
import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/apiResponse.js';
import { addHours } from '../utils/helpers.js';

const googleClient = new OAuth2Client(env.googleClientId);

export interface JwtPayload {
  userId: string;
  sessionId: string;
  role: Role;
  plan: Plan;
}

export interface AuthUserResponse {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  plan: Plan;
  provider: string;
  createdAt: string;
}

function toAuthUser(user: DbUser): AuthUserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=3525cd&color=fff`,
    role: user.role,
    plan: user.plan,
    provider: 'google',
    createdAt: user.createdAt.toISOString(),
  };
}

async function ensureUsage(userId: string, plan: Plan) {
  const limits = PLAN_LIMITS[plan];
  const existing = await prisma.usage.findUnique({ where: { userId } });
  if (existing) return existing;

  return prisma.usage.create({
    data: {
      userId,
      usedBytes: 0,
      resetAt: addHours(new Date(), limits.resetHours),
      cycleCount: 0,
    },
  });
}

export async function verifyGoogleToken(credential: string) {
  if (env.allowDevAuth && credential.startsWith('dev:')) {
    const email = credential.replace('dev:', '') || 'dev@example.com';
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return {
        googleId: existing.googleId,
        email: existing.email,
        name: existing.name,
        avatar: existing.avatar,
      };
    }
    return {
      googleId: `dev_${email}`,
      email,
      name: email.split('@')[0] ?? 'Dev User',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=3525cd&color=fff`,
    };
  }

  if (!env.googleClientId) {
    throw new AppError(500, 'Google OAuth is not configured');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.googleClientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.sub || !payload.email) {
    throw new AppError(401, 'Invalid Google token');
  }

  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name ?? payload.email.split('@')[0] ?? 'User',
    avatar: payload.picture ?? null,
  };
}

export async function loginWithGoogle(credential: string) {
  const profile = await verifyGoogleToken(credential);
  const sessionId = uuidv4();

  let user = await prisma.user.findUnique({ where: { googleId: profile.googleId } });

  if (user?.banned) {
    throw new AppError(403, 'Your account has been banned');
  }

  if (!user) {
    user = await prisma.user.create({
      data: {
        googleId: profile.googleId,
        email: profile.email,
        name: profile.name,
        avatar: profile.avatar,
        sessionId,
      },
    });
    await ensureUsage(user.id, user.plan);
  } else {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { sessionId, avatar: profile.avatar ?? user.avatar },
    });
  }

  const token = jwt.sign(
    { userId: user.id, sessionId, role: user.role, plan: user.plan } satisfies JwtPayload,
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
  );

  const decoded = jwt.decode(token) as { exp?: number } | null;
  const expiresAt = decoded?.exp ? decoded.exp * 1000 : Date.now() + 8 * 60 * 60 * 1000;

  return {
    user: toAuthUser(user),
    token,
    expiresAt,
  };
}

export async function getUserFromToken(token: string): Promise<DbUser> {
  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
  } catch {
    throw new AppError(401, 'Invalid or expired session');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || user.banned) {
    throw new AppError(401, 'Unauthorized');
  }

  if (!user.sessionId || user.sessionId !== payload.sessionId) {
    throw new AppError(401, 'Session expired. You have been logged in on another device.');
  }

  return user;
}

export async function logout(userId: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { sessionId: null },
  });
}

export { toAuthUser };
