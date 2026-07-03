import { Router } from 'express';
import { googleAuth, getMe, logoutUser } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/google', asyncHandler(googleAuth));
router.post('/logout', authenticate, asyncHandler(logoutUser));
router.get('/me', authenticate, asyncHandler(getMe));

export default router;
