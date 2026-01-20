import { Request, Response, NextFunction } from 'express';
import {
  updateProfileSchema,
  changePasswordSchema,
  getUserSchema,
} from './user.schema';
import * as userService from './user.service';
import { AppError } from '../utils/AppError';

export const getUserProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const result = await userService.getUserProfile(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const data = updateProfileSchema.parse(req.body);
    const result = await userService.updateProfile(userId, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const changePasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const data = changePasswordSchema.parse(req.body);
    const result = await userService.changePassword(userId, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserStatsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const result = await userService.getUserStats(userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await userService.getAllUsers(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getUserSchema.parse({ id: req.params.id });
    const result = await userService.getUserById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deactivateAccountController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      throw new AppError('Password is required', 400);
    }

    const result = await userService.deactivateAccount(userId, password);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
