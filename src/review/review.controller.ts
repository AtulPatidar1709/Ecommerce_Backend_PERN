import { Request, Response, NextFunction } from 'express';
import {
  createReviewSchema,
  updateReviewSchema,
  getReviewSchema,
} from "./review.schema.js";
import * as reviewService from "./review.service.js";
import { AppError } from '../utils/AppError.js';
import { getUserId } from '../auth/helper/helper.js';

export const createReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const data = createReviewSchema.parse(req.body);
    const result = await reviewService.createReview(userId, data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getReviewsByProductIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!productId) {
      throw new AppError('Product ID is required', 400);
    }

    const result = await reviewService.getReviewsByProductId(
      productId as string,
      page,
      limit,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserReviewsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await reviewService.getUserReviews(userId, page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getReviewByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getReviewSchema.parse({ id: req.params.id });
    const result = await reviewService.getReviewById(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const revId = req.params.id as string;

    const { id } = getReviewSchema.parse({ revId });
    const data = updateReviewSchema.parse(req.body);
    const result = await reviewService.updateReview(userId, id, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteReviewController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const { id } = getReviewSchema.parse({ id: req.params.id });
    const result = await reviewService.deleteReview(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const deleteReviewByAdminController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getReviewSchema.parse({ id: req.params.id });
    const result = await reviewService.deleteReviewByAdmin(id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
