import { Router } from 'express';
import {
  createAddressController,
  getAllAddressesController,
  getAddressByIdController,
  updateAddressController,
  deleteAddressController,
} from './address.controller';
import { requireAuth } from '../middlewares/auth_middlewares/authMiddleware';

const router = Router();

// All address routes require authentication
router.use(requireAuth);

// Create a new address
router.post('/', createAddressController);

// Get all addresses for the authenticated user
router.get('/', getAllAddressesController);

// Get a specific address by ID
router.get('/:addressId', getAddressByIdController);

// Update an address
router.put('/:addressId', updateAddressController);

// Delete an address
router.delete('/:addressId', deleteAddressController);

export default router;
