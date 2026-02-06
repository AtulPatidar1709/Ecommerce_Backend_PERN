import { Request, Response, NextFunction } from 'express';
import {
  createAddressSchema,
  updateAddressSchema,
  getAddressSchema,
} from './address.schema';
import * as addressService from './address.service';
import { AppError } from '../utils/AppError';

export const createAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const data = createAddressSchema.parse(req.body.data);
    const result = await addressService.createAddress(userId, data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllAddressesController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const result = await addressService.getAllAddresses(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAddressByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const { addressId } = getAddressSchema.parse({
      addressId: req.params.addressId,
    });
    const result = await addressService.getAddressById(userId, addressId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const { addressId } = getAddressSchema.parse({
      addressId: req.params.addressId,
    });
    const data = updateAddressSchema.parse(req.body);
    const result = await addressService.updateAddress(userId, addressId, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const { addressId } = getAddressSchema.parse({
      addressId: req.params.addressId,
    });
    const result = await addressService.deleteAddress(userId, addressId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
