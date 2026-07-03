import type { NextFunction, Request, Response } from 'express';
import { AppError, fail } from '../utils/apiResponse.js';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof AppError) {
    res.status(err.statusCode).json(fail(err.message, err.code, (err as AppError & { details?: unknown }).details));
    return;
  }

  if (err && typeof err === 'object' && 'name' in err && err.name === 'ZodError') {
    const zodErr = err as { errors?: Array<{ message: string }> };
    res.status(422).json(fail(zodErr.errors?.[0]?.message ?? 'Validation failed', 'VALIDATION_ERROR'));
    return;
  }

  if (err && typeof err === 'object' && 'name' in err && err.name === 'MulterError') {
    const multerErr = err as { code?: string; message?: string };
    if (multerErr.code === 'LIMIT_FILE_SIZE') {
      res.status(413).json(fail('File too large'));
      return;
    }
  }

  console.error(err);
  res.status(500).json(fail('Internal server error'));
}
