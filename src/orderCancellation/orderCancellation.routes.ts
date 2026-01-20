import { Router } from 'express';
import {
  createOrderCancellationController,
  getUserOrderCancellationsController,
  getOrderCancellationByIdController,
  updateOrderCancellationController,
  getAllOrderCancellationsController,
} from './orderCancellation.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';

const router = Router();

// User routes (authenticated)
router.post('/', requireAuth, createOrderCancellationController);
router.get('/', requireAuth, getUserOrderCancellationsController);
router.get('/:id', requireAuth, getOrderCancellationByIdController);

// Admin routes
router.get('/all', requireAuth, isAdmin, getAllOrderCancellationsController);
router.patch('/:id', requireAuth, isAdmin, updateOrderCancellationController);

export default router;
