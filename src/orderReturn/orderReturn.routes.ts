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

router.use(requireAuth);

// User routes (authenticated)
router.post('/', createOrderReturnController);
router.get('/', getUserOrderReturnsController);
router.get('/:id', getOrderReturnByIdController);

// Admin routes
router.get('/all', isAdmin, getAllOrderReturnsController);
router.patch('/:id', isAdmin, updateOrderReturnController);

export default router;
