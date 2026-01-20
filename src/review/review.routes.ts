import { Router } from 'express';
import {
  createReviewController,
  getReviewsByProductIdController,
  getUserReviewsController,
  getReviewByIdController,
  updateReviewController,
  deleteReviewController,
  deleteReviewByAdminController,
} from './review.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';

const router = Router();

// Public routes
router.get('/product/:productId', getReviewsByProductIdController);
router.get('/:id', getReviewByIdController);

// User routes (authenticated)
router.post('/', requireAuth, createReviewController);
router.get('/', requireAuth, getUserReviewsController);
router.put('/:id', requireAuth, updateReviewController);
router.delete('/:id', requireAuth, deleteReviewController);

// Admin routes
router.delete(
  '/:id/admin',
  requireAuth,
  isAdmin,
  deleteReviewByAdminController,
);

export default router;
