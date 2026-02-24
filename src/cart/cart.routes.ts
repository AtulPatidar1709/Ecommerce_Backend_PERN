import { Router } from 'express';
import {
  addToCartController,
  getCartItemsController,
  updateCartItemController,
  removeFromCartController,
  clearCartController,
} from "./cart.controller.js";
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware.js';

const router = Router();

// All cart routes require authentication
router.use(requireAuth);

// Add item to cart
router.post('/', addToCartController);

// Get all cart items with summary
router.get('/', getCartItemsController);

// Update cart item quantity
router.patch('/:productId', updateCartItemController);

// Remove item from cart
router.delete('/:productId', removeFromCartController);

// Clear entire cart
router.delete('/', clearCartController);

export default router;
