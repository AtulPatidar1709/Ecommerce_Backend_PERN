import { Router } from 'express';
import {
  createCategoryController,
  getAllCategoriesController,
  getCategoryByIdController,
  getCategoryBySlugController,
  updateCategoryController,
  toggleCategoryStatusController,
  deleteCategoryController,
} from './category.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';

const router = Router();

// Public routes
router.get('/', getAllCategoriesController);
router.get('/slug/:slug', getCategoryBySlugController);
router.get('/:id', getCategoryByIdController);

// Admin routes
router.post('/', requireAuth, isAdmin, createCategoryController);
router.put('/:id', requireAuth, isAdmin, updateCategoryController);
router.patch(
  '/:id/toggle-status',
  requireAuth,
  isAdmin,
  toggleCategoryStatusController,
);
router.delete('/:id', requireAuth, isAdmin, deleteCategoryController);

export default router;
