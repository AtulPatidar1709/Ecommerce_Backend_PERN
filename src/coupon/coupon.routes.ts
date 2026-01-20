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

// User routes
router.post('/validate', requireAuth, validateCouponController);

// Admin routes
router.get('/', requireAuth, isAdmin, getAllCouponsController);
router.get('/:id', requireAuth, isAdmin, getCouponByIdController);
router.post('/', requireAuth, isAdmin, createCouponController);
router.put('/:id', requireAuth, isAdmin, updateCouponController);
router.patch(
  '/:id/toggle-status',
  requireAuth,
  isAdmin,
  toggleCouponStatusController,
);
router.delete('/:id', requireAuth, isAdmin, deleteCouponController);

export default router;
