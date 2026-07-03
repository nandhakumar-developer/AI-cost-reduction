import type { NextFunction, Request, Response } from 'express';
import type { Role } from '../types/index.js';
import { getUserFromToken, toAuthUser } from '../services/auth.service.js';
import { AppError } from '../utils/apiResponse.js';

export interface AuthenticatedRequest extends Request {
  user?: Awaited<ReturnType<typeof getUserFromToken>>;
}

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token =
      req.cookies?.token ||
      req.headers.authorization?.replace(/^Bearer\s+/i, '');

    if (!token) {
      throw new AppError(401, 'Authentication required');
    }

    req.user = await getUserFromToken(token);
    next();
  } catch (error) {
    next(error);
  }
}

export function requireRoles(...roles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new AppError(401, 'Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new AppError(403, 'Insufficient permissions'));
      return;
    }

    next();
  };
}

export { toAuthUser };
