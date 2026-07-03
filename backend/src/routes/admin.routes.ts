import { Router } from 'express';
import {
  ban,
  dashboard,
  logs,
  removeUser,
  resetQuota,
  reviewSub,
  subscriptions,
  users,
} from '../controllers/admin.controller.js';
import { authenticate, requireRoles } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate, requireRoles('ADMIN'));

router.get('/dashboard', asyncHandler(dashboard));
router.get('/users', asyncHandler(users));
router.patch('/users/:userId/ban', asyncHandler(ban));
router.delete('/users/:userId', asyncHandler(removeUser));
router.post('/users/:userId/reset-quota', asyncHandler(resetQuota));
router.get('/subscriptions', asyncHandler(subscriptions));
router.patch('/subscriptions/:id', asyncHandler(reviewSub));
router.get('/logs', asyncHandler(logs));

export default router;
