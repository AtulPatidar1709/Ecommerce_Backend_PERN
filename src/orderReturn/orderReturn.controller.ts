import { Request, Response, NextFunction } from 'express';
import {
  createOrderReturnSchema,
  updateOrderReturnSchema,
  getOrderReturnSchema,
} from "./orderReturn.schema.js";
import * as orderReturnService from "./orderReturn.service.js";
import { AppError } from '../utils/AppError.js';
import { getUserId } from '../auth/helper/helper.js';

export const createOrderReturnController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const data = createOrderReturnSchema.parse(req.body);
    const result = await orderReturnService.createOrderReturn(userId, data);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserOrderReturnsController = async (
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

    const result = await orderReturnService.getUserOrderReturns(
      userId,
      page,
      limit,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrderReturnByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const { id } = getOrderReturnSchema.parse({ id: req.params.id });
    const result = await orderReturnService.getOrderReturnById(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateOrderReturnController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getOrderReturnSchema.parse({ id: req.params.id });
    const data = updateOrderReturnSchema.parse(req.body);
    const result = await orderReturnService.updateOrderReturn(id, data);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllOrderReturnsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as string | undefined;

    const result = await orderReturnService.getAllOrderReturns(
      page,
      limit,
      status,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
