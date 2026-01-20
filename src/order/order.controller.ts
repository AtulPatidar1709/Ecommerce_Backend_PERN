import { Request, Response, NextFunction } from 'express';
import * as orderService from './order.service';
import {
  getOrdersQuerySchema,
  getOrderByIdSchema,
  createOrderSchema,
  updateOrderStatusSchema,
} from './oder.schema';
import { AppError } from '../utils/AppError';

// Helper to extract user ID from authenticated request
const getUserId = (req: Request): string => {
  const userId = (req as any).user?.id;
  if (!userId) {
    throw new AppError('User not authenticated', 401);
  }
  return userId;
};

// Helper to parse and validate query parameters
const parseQuery = (query: Record<string, unknown>) => {
  return getOrdersQuerySchema.parse(query);
};

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    const data = createOrderSchema.parse(req.body);

    const order = await orderService.createOrder(userId, data);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    const query = parseQuery(req.query);

    const result = await orderService.getUserOrders(userId, query);

    res.status(200).json({
      success: true,
      data: result.orders,
      pagination: result.pagination,
    });
  } catch (err) {
    next(err);
  }
};

export const getOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    const input = getOrderByIdSchema.parse({ id: req.params.id });

    const order = await orderService.getOrderById(userId, input);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = updateOrderStatusSchema.parse(req.body);
    const orderId = req.params.id as string;

    const order = await orderService.updateOrderStatus(orderId, data);

    res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};

export const cancelOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    const orderId = req.params.id as string;

    const order = await orderService.cancelOrder(userId, orderId);

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (err) {
    next(err);
  }
};
