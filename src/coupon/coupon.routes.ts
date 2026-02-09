import { Router } from 'express';
import {
  createCouponController,
  getAllCouponsController,
  getCouponByIdController,
  validateCouponController,
  updateCouponController,
  toggleCouponStatusController,
  deleteCouponController,
} from './coupon.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';

const router = Router();

router.use(requireAuth);

// User routes
router.post('/validate', validateCouponController);

// Admin routes
router.get('/', isAdmin, getAllCouponsController);
router.get('/:id', isAdmin, getCouponByIdController);
router.post('/', isAdmin, createCouponController);
router.put('/:id', isAdmin, updateCouponController);
router.patch('/:id/toggle-status', isAdmin, toggleCouponStatusController);
router.delete('/:id', isAdmin, deleteCouponController);

export default router;
