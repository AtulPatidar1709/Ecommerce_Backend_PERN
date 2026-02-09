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

router.use(requireAuth);

// User routes (authenticated)
router.post('/', createReviewController);
router.get('/', getUserReviewsController);
router.put('/:id', updateReviewController);
router.delete('/:id', deleteReviewController);

// Admin routes
router.delete('/:id/admin', isAdmin, deleteReviewByAdminController);

export default router;
