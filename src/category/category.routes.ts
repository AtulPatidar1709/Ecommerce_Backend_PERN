import { Router } from 'express';
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  getCategoryBySlugController,
  updateCategoryController,
  toggleCategoryStatusController,
  deleteCategoryController,
} from "./category.controller.js";
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware.js';
import isAdmin from '../middlewares/auth_middlewares/isAdmin.js';
import { upload } from '../product/middlewares.js';

const router = Router();

// Public routes
router.get('/', getAllCategoriesController);
router.get('/slug/:slug', getCategoryBySlugController);
router.get('/:id', getCategoryByIdController);

// Admin routes
router.post(
  '/',
  requireAuth,
  isAdmin,
  upload.array('imageUrl', 1),
  createCategoryController,
);
router.put('/:id', requireAuth, isAdmin, updateCategoryController);
router.patch(
  '/:id/toggle-status',
  requireAuth,
  isAdmin,
  toggleCategoryStatusController,
);
router.delete('/:id', requireAuth, isAdmin, deleteCategoryController);

export default router;
