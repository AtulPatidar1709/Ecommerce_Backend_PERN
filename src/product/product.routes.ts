import { Router } from 'express';
import {
  createProductController,
  getAllProductsController,
  updateProductController,
  deleteProductController,
  getProductBySlugController,
} from './product.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';
import isAdmin from '../middlewares/auth_middlewares/isAdmin';
import { upload } from './middlewares';
import { getProductSummaryController } from './summary/product.summary.controller';

const router = Router();

// Public
router.get('/', getAllProductsController);

//must be before any :id route, summary express think it like id.
router.get('/summary', getProductSummaryController);

router.get('/:slug', getProductBySlugController);

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
