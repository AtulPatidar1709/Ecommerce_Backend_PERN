import { RequestStatus } from '@prisma/client';
import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import {
  CreateOrderCancellationInput,
  UpdateOrderCancellationInput,
} from "./orderCancellation.schema.js";

/**
 * Create cancellation request (USER)
 */
export const createOrderCancellation = async (
  userId: string,
  data: CreateOrderCancellationInput,
) => {
  // 1. Verify order exists and belongs to user
  const order = await prisma.order.findFirst({
    where: {
      id: data.orderId,
      userId,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // 2. Validate order status
  if (!['PENDING', 'CONFIRMED'].includes(order.status)) {
    throw new AppError(
      'Only pending or confirmed orders can be cancelled',
      400,
    );
  }

  // 3. Check if cancellation already exists
  const existingCancellation = await prisma.orderCancellation.findUnique({
    where: { orderId: data.orderId },
  });

  if (existingCancellation) {
    throw new AppError(
      'Cancellation request already exists for this order',
      409,
    );
  }

  // 4. Create cancellation
  const cancellation = await prisma.orderCancellation.create({
    data: {
      orderId: data.orderId,
      userId,
      reason: data.reason,
      status: RequestStatus.REQUESTED,
    },
  });

  return {
    success: true,
    message: 'Cancellation request created successfully',
    data: cancellation,
  };
};

/**
 * Get logged-in user's cancellation requests
 */
export const getUserOrderCancellations = async (
  userId: string,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const [cancellations, totalCount] = await Promise.all([
    prisma.orderCancellation.findMany({
      where: {
        order: { userId },
      },
      include: {
        order: {
          select: {
            id: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { requestedAt: 'desc' },
    }),
    prisma.orderCancellation.count({
      where: {
        order: { userId },
      },
    }),
  ]);

  return {
    success: true,
    message: 'Order cancellations fetched successfully',
    data: {
      cancellations,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

/**
 * Get single cancellation by ID (USER)
 */
export const getOrderCancellationById = async (
  userId: string,
  cancellationId: string,
) => {
  const cancellation = await prisma.orderCancellation.findFirst({
    where: {
      id: cancellationId,
      order: { userId },
    },
    include: {
      order: {
        select: {
          id: true,
          totalAmount: true,
          discountAmount: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!cancellation) {
    throw new AppError('Cancellation request not found', 404);
  }

  return {
    success: true,
    message: 'Cancellation request fetched successfully',
    data: cancellation,
  };
};

/**
 * Update cancellation status (ADMIN)
 */
export const updateOrderCancellation = async (
  cancellationId: string,
  data: UpdateOrderCancellationInput,
) => {
  const cancellation = await prisma.orderCancellation.findUnique({
    where: { id: cancellationId },
    include: { order: true },
  });

  if (!cancellation) {
    throw new AppError('Cancellation request not found', 404);
  }

  /**
   * STATUS TRANSITIONS
   *
   * REQUESTED -> APPROVED | REJECTED
   * APPROVED  -> COMPLETED
   * COMPLETED -> ❌
   */

  if (cancellation.status === RequestStatus.COMPLETED) {
    throw new AppError(
      'Completed cancellation requests cannot be modified',
      400,
    );
  }

  if (
    cancellation.status === RequestStatus.REQUESTED &&
    data.status !== RequestStatus.APPROVED &&
    data.status !== RequestStatus.REJECTED
  ) {
    throw new AppError('Cancellation can only be approved or rejected', 400);
  }

  if (
    cancellation.status === RequestStatus.APPROVED &&
    data.status !== RequestStatus.COMPLETED
  ) {
    throw new AppError('Approved cancellation can only be completed', 400);
  }

  // Update cancellation
  const updatedCancellation = await prisma.orderCancellation.update({
    where: { id: cancellationId },
    data: {
      status: data.status,
      ...(data.status !== RequestStatus.REQUESTED && {
        processedAt: new Date(),
      }),
    },
    include: {
      order: {
        select: {
          id: true,
          totalAmount: true,
          status: true,
        },
      },
    },
  });

  // If approved → cancel order
  if (data.status === RequestStatus.APPROVED) {
    await prisma.order.update({
      where: { id: cancellation.orderId },
      data: { status: 'CANCELLED' },
    });
  }

  return {
    success: true,
    message: 'Cancellation request updated successfully',
    data: updatedCancellation,
  };
};

/**
 * Get all cancellations (ADMIN)
 */
export const getAllOrderCancellations = async (
  page = 1,
  limit = 10,
  status?: RequestStatus,
) => {
  const skip = (page - 1) * limit;

  const where = status ? { status } : {};

  const [cancellations, totalCount] = await Promise.all([
    prisma.orderCancellation.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            userId: true,
            totalAmount: true,
            status: true,
            createdAt: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { requestedAt: 'desc' },
    }),
    prisma.orderCancellation.count({ where }),
  ]);

  return {
    success: true,
    message: 'Order cancellations fetched successfully',
    data: {
      cancellations,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};
