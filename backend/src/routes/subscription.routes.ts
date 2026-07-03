import { Router } from 'express';
import {
  getSubscriptionInfo,
  submitSubscriptionRequest,
} from '../controllers/subscription.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', authenticate, asyncHandler(getSubscriptionInfo));
router.post('/request', authenticate, asyncHandler(submitSubscriptionRequest));

export default router;
