import { Router } from 'express';
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from './product.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';
import { upload } from './middlewares';

const router = Router();

// Public
router.get('/', getAllProductsController);
router.get('/:id', getProductByIdController);

// Admin
router.post(
  '/',
  requireAuth,
  isAdmin,
  upload.array('images', 10),
  createProductController,
);

router.put(
  '/:id',
  requireAuth,
  isAdmin,
  upload.array('images', 10),
  updateProductController,
);

router.delete('/:id', requireAuth, isAdmin, deleteProductController);

export default router;
