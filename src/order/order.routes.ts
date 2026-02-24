import { Router } from 'express';
import * as orderController from "./order.controller.js";
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware.js';

const router = Router();

router.use(requireAuth);

// Create order
router.post('/', orderController.createOrderController);

// Get user's orders with pagination and filtering
router.get('/', orderController.getUserOrdersController);

// Get specific order details
router.get('/:id', orderController.getOrderByIdController);

// Cancel order (user action)
router.patch('/:id/cancel', orderController.cancelOrderController);

// Update order status (admin action)
router.patch('/:id/status', orderController.updateOrderStatusController);

export default router;
