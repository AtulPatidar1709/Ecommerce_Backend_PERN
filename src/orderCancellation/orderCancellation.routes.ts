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

router.use(requireAuth);

// User routes (authenticated)
router.post('/', createOrderCancellationController);
router.get('/', getUserOrderCancellationsController);
router.get('/:id', getOrderCancellationByIdController);

// Admin routes
router.get('/all', isAdmin, getAllOrderCancellationsController);
router.patch('/:id', isAdmin, updateOrderCancellationController);

export default router;
