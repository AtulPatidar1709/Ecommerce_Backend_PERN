import { Router } from 'express';
import {
  initiatePaymentController,
  getPaymentByOrderIdController,
  getPaymentByIdController,
  verifyRazorpayPaymentController,
  updatePaymentStatusController,
  getAllPaymentsController,
} from "./payment.controller.js";
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware.js';
import isAdmin from '../middlewares/auth_middlewares/isAdmin.js';

const router = Router();

router.use(requireAuth);

// User routes (authenticated)
// router.post('/', initiatePaymentController);

router.get('/order/:orderId', getPaymentByOrderIdController);
router.get('/:id', getPaymentByIdController);
router.post('/verify/razorpay', verifyRazorpayPaymentController);
router.post('/verify/initiate-payment', initiatePaymentController);

// Admin routes
router.get('/', isAdmin, getAllPaymentsController);
router.patch('/:id/status', isAdmin, updatePaymentStatusController);

export default router;
