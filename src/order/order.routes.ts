import { Router } from 'express';
import * as orderController from './order.controller';
import { authenticate } from '../middleware/authenticate';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';

const router = Router();

// Create order
router.post('/', requireAuth, orderController.createOrderController);

// Get user's orders with pagination and filtering
router.get('/', requireAuth, orderController.getUserOrdersController);

// Get specific order details
router.get('/:id', requireAuth, orderController.getOrderByIdController);

// Cancel order (user action)
router.patch('/:id/cancel', requireAuth, orderController.cancelOrderController);

// Update order status (admin action)
router.patch(
  '/:id/status',
  requireAuth,
  orderController.updateOrderStatusController,
);

export default router;
