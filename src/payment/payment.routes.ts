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

router.use(requireAuth);

// User routes (authenticated)
router.post('/', initiatePaymentController);
router.get('/order/:orderId', getPaymentByOrderIdController);
router.get('/:id', getPaymentByIdController);
router.post('/verify/razorpay', verifyRazorpayPaymentController);

// Admin routes
router.get('/', isAdmin, getAllPaymentsController);
router.patch('/:id/status', isAdmin, updatePaymentStatusController);

export default router;
