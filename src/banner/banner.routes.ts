import { Router } from 'express';
import {
  createBannerController,
  getAllBannersController,
  getActiveBannersController,
  getBannerByIdController,
  updateBannerController,
  toggleBannerStatusController,
  deleteBannerController,
} from './banner.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';
import { upload } from '../product/middlewares';

const router = Router();

// Public routes
router.get('/active', getActiveBannersController);
router.get('/:id', getBannerByIdController);

// Admin routes
router.get('/', requireAuth, isAdmin, getAllBannersController);
router.post(
  '/',
  requireAuth,
  isAdmin,
  upload.array('imageUrl', 1),
  createBannerController,
);
router.put('/:id', requireAuth, isAdmin, updateBannerController);
router.patch(
  '/:id/toggle-status',
  requireAuth,
  isAdmin,
  toggleBannerStatusController,
);
router.delete('/:id', requireAuth, isAdmin, deleteBannerController);

export default router;
