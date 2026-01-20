import { Router } from 'express';
import {
  getUserProfileController,
  updateProfileController,
  changePasswordController,
  getUserStatsController,
  getAllUsersController,
  getUserByIdController,
  deactivateAccountController,
} from './user.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';

const router = Router();

// User routes (authenticated)
router.get('/profile', requireAuth, getUserProfileController);
router.put('/profile', requireAuth, updateProfileController);
router.post('/change-password', requireAuth, changePasswordController);
router.get('/stats', requireAuth, getUserStatsController);
router.post('/deactivate', requireAuth, deactivateAccountController);

// Admin routes
router.get('/', requireAuth, isAdmin, getAllUsersController);
router.get('/:id', requireAuth, isAdmin, getUserByIdController);

export default router;
