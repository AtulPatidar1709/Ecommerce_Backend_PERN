import { Router } from 'express';
import {
  getUserProfileController,
  updateProfileController,
  changePasswordController,
  getUserStatsController,
  getAllUsersController,
  getUserByIdController,
  deactivateAccountController,
} from "./user.controller.js";
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware.js';
import isAdmin from '../middlewares/auth_middlewares/isAdmin.js';

const router = Router();

router.use(requireAuth);

// User routes (authenticated)
router.get('/profile', getUserProfileController);
router.put('/profile', updateProfileController);
router.post('/change-password', changePasswordController);
router.get('/stats', getUserStatsController);
router.post('/deactivate', deactivateAccountController);

// Admin routes
router.get('/', isAdmin, getAllUsersController);
router.get('/:id', isAdmin, getUserByIdController);

export default router;
