import { Request, Response, NextFunction } from 'express';
import {
  createOrderCancellationSchema,
  updateOrderCancellationSchema,
  getOrderCancellationSchema,
} from "./orderCancellation.schema.js";
import * as orderCancellationService from "./orderCancellation.service.js";
import { AppError } from '../utils/AppError.js';
import { getUserId } from '../auth/helper/helper.js';
import { RequestStatus } from '@prisma/client';

export const createOrderCancellationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const data = createOrderCancellationSchema.parse(req.body);
    const result = await orderCancellationService.createOrderCancellation(
      userId,
      data,
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserOrderCancellationsController = async (
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

    const result = await orderCancellationService.getUserOrderCancellations(
      userId,
      page,
      limit,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getOrderCancellationByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const { id } = getOrderCancellationSchema.parse({ id: req.params.id });
    const result = await orderCancellationService.getOrderCancellationById(
      userId,
      id,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const updateOrderCancellationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getOrderCancellationSchema.parse({ id: req.params.id });
    const data = updateOrderCancellationSchema.parse(req.body);
    const result = await orderCancellationService.updateOrderCancellation(
      id,
      data,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllOrderCancellationsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    let status: RequestStatus | undefined;
    if (req.query.status) {
      if (
        req.query.status === RequestStatus.REQUESTED ||
        req.query.status === RequestStatus.APPROVED ||
        req.query.status === RequestStatus.REJECTED ||
        req.query.status === RequestStatus.COMPLETED
      ) {
        status = req.query.status as RequestStatus;
      } else {
        throw new AppError('Invalid status query parameter', 400);
      }
    }

    const result = await orderCancellationService.getAllOrderCancellations(
      page,
      limit,
      status,
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
