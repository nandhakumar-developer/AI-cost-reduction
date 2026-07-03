import { Router } from 'express';
import {
  downloadMarkdown,
  getOne,
  getRecent,
  getStats,
  listHistory,
  removeOne,
} from '../controllers/history.controller.js';
import { authenticate } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', authenticate, asyncHandler(listHistory));
router.get('/recent', authenticate, asyncHandler(getRecent));
router.get('/stats', authenticate, asyncHandler(getStats));
router.get('/:id/download', authenticate, asyncHandler(downloadMarkdown));
router.get('/:id', authenticate, asyncHandler(getOne));
router.delete('/:id', authenticate, asyncHandler(removeOne));

export default router;
