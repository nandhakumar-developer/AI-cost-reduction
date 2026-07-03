import { Router } from 'express';
import { convertFiles, uploadMiddleware } from '../controllers/convert.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/', authenticate, uploadMiddleware, asyncHandler(convertFiles));

export default router;
