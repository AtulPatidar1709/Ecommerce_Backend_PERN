import { Router } from 'express';
import {
  createOrderReturnController,
  getUserOrderReturnsController,
  getOrderReturnByIdController,
  updateOrderReturnController,
  getAllOrderReturnsController,
} from './orderReturn.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';

const router = Router();

// User routes (authenticated)
router.post('/', requireAuth, createOrderReturnController);
router.get('/', requireAuth, getUserOrderReturnsController);
router.get('/:id', requireAuth, getOrderReturnByIdController);

// Admin routes
router.get('/all', requireAuth, isAdmin, getAllOrderReturnsController);
router.patch('/:id', requireAuth, isAdmin, updateOrderReturnController);

export default router;
