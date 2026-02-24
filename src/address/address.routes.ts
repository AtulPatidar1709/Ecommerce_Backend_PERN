import { Router } from 'express';
import {
  createAddressController,
  getAllAddressesController,
  getAddressByIdController,
  updateAddressController,
  deleteAddressController,
} from "./address.controller.js";
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware.js';

const router = Router();

// Create a new address
router.post('/', requireAuth, createAddressController);

// Get all addresses for the authenticated user
router.get('/', requireAuth, getAllAddressesController);

// Get a specific address by ID
router.get('/:addressId', requireAuth, getAddressByIdController);

// Update an address
router.put('/:addressId', requireAuth, updateAddressController);

// Delete an address
router.delete('/:addressId', requireAuth, deleteAddressController);

export default router;
