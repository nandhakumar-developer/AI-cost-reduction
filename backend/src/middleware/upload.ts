import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import type { Request } from 'express';
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  BLOCKED_EXTENSIONS,
  PLAN_LIMITS,
} from '../config/constants.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/apiResponse.js';
import type { AuthenticatedRequest } from './auth.js';
import { getExtension } from '../utils/helpers.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, '../../uploads/temp');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `${Date.now()}_${safeName}`);
  },
});

function validateFile(file: Express.Multer.File) {
  const ext = getExtension(file.originalname);

  if (BLOCKED_EXTENSIONS.has(ext)) {
    throw new AppError(400, `File type not allowed: ${ext}`);
  }

  if (!ALLOWED_EXTENSIONS.has(ext)) {
    throw new AppError(400, `Unsupported file extension: ${ext}`);
  }

  if (file.mimetype && !ALLOWED_MIME_TYPES.has(file.mimetype)) {
    const allowedByExt = ALLOWED_EXTENSIONS.has(ext);
    if (!allowedByExt) {
      throw new AppError(400, `Unsupported MIME type: ${file.mimetype}`);
    }
  }
}

export const upload = multer({
  storage,
  limits: {
    fileSize: PLAN_LIMITS.PRO.maxUploadBytes,
    files: env.maxFilesPerUpload,
  },
  fileFilter: (_req, file, cb) => {
    try {
      validateFile(file);
      cb(null, true);
    } catch (error) {
      cb(error as Error);
    }
  },
});

export function validateUploadBatch(req: AuthenticatedRequest) {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files?.length) {
    throw new AppError(400, 'No files uploaded');
  }

  if (files.length > env.maxFilesPerUpload) {
    throw new AppError(400, `Maximum ${env.maxFilesPerUpload} files per upload`);
  }

  const plan = (req.user?.plan ?? 'FREE') as keyof typeof PLAN_LIMITS;
  const maxBytes = PLAN_LIMITS[plan].maxUploadBytes;
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  if (totalSize > maxBytes) {
    throw new AppError(
      413,
      `Combined upload size exceeds ${plan === 'PRO' ? '15MB' : '8MB'} limit`
    );
  }

  return files;
}
