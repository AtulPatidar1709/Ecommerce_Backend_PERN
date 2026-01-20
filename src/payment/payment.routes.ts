import { Router } from 'express';
import {
  initiatePaymentController,
  getPaymentByOrderIdController,
  getPaymentByIdController,
  verifyRazorpayPaymentController,
  updatePaymentStatusController,
  getAllPaymentsController,
} from './payment.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';

const router = Router();

// User routes (authenticated)
router.post('/', requireAuth, initiatePaymentController);
router.get('/order/:orderId', requireAuth, getPaymentByOrderIdController);
router.get('/:id', requireAuth, getPaymentByIdController);
router.post('/verify/razorpay', requireAuth, verifyRazorpayPaymentController);

// Admin routes
router.get('/', requireAuth, isAdmin, getAllPaymentsController);
router.patch(
  '/:id/status',
  requireAuth,
  isAdmin,
  updatePaymentStatusController,
);

export default router;
