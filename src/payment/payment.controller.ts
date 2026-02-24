import { Request, Response, NextFunction } from 'express';
import {
  verifyRazorpayPaymentSchema,
  getPaymentSchema,
} from "./payment.schema.js";
import * as paymentService from "./payment.service.js";
import { AppError } from '../utils/AppError.js';
import { getUserId } from '../auth/helper/helper.js';
import { AuthenticatedRequest } from '../middlewares/auth_middlewares/types/AuthenticatedRequestTypes.js';

export const getPaymentByOrderIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const { orderId } = req.params;
    if (!orderId || typeof orderId !== 'string') {
      throw new AppError('Order ID is required', 400);
    }

    const result = await paymentService.getPaymentByOrderId(userId, orderId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPaymentByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const { id } = getPaymentSchema.parse({ id: req.params.id });
    const result = await paymentService.getPaymentById(userId, id);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const verifyRazorpayPaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = getUserId(req);
    if (!userId) {
      throw new AppError('User ID not found', 401);
    }

    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } =
      verifyRazorpayPaymentSchema.parse(req.body);

    const result = await paymentService.verifyRazorpayPayment(
      userId,
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    );
    res.status(200).json({
      success: 'success',
      message: 'Payment verified successfully',
      result: result,
    });
  } catch (error) {
    next(error);
  }
};

export const initiatePaymentController = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new AppError('User ID not found', 401);
    }
    const result = await paymentService.initiatePayment(user, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

export const updatePaymentStatusController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = getPaymentSchema.parse({ id: req.params.id });
    const { status } = req.body;

    if (!status || typeof status !== 'string') {
      throw new AppError(
        'Payment status is required and must be a string',
        400,
      );
    }

    const result = await paymentService.updatePaymentStatus(id, status);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getAllPaymentsController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await paymentService.getAllPayments(page, limit);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
