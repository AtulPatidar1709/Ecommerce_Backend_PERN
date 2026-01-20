import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import {
  CreateOrderReturnInput,
  UpdateOrderReturnInput,
} from './orderReturn.schema';

type OrderReturnStatusType =
  | 'REQUESTED'
  | 'APPROVED'
  | 'REJECTED'
  | 'COMPLETED';

export const createOrderReturn = async (
  userId: string,
  data: CreateOrderReturnInput,
) => {
  // Verify order exists and belongs to user
  const order = await prisma.order.findFirst({
    where: {
      id: data.orderId,
      userId,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if order is delivered
  if (order.status !== 'DELIVERED') {
    throw new AppError(
      'Order must be delivered before initiating a return',
      400,
    );
  }

  // Check if return already exists
  const existingReturn = await prisma.orderReturn.findFirst({
    where: { orderId: data.orderId },
  });

  if (existingReturn) {
    throw new AppError('Return request already exists for this order', 409);
  }

  const orderReturn = await prisma.orderReturn.create({
    data: {
      orderId: data.orderId,
      userId: userId,
      reason: data.reason,
      status: 'REQUESTED',
    },
  });

  return {
    success: true,
    message: 'Return request created successfully',
    data: orderReturn,
  };
};

export const getUserOrderReturns = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [returns, totalCount] = await Promise.all([
    prisma.orderReturn.findMany({
      where: {
        order: {
          userId,
        },
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
    prisma.orderReturn.count({
      where: {
        order: {
          userId,
        },
      },
    }),
  ]);

  return {
    success: true,
    message: 'Order returns fetched successfully',
    data: {
      returns,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const getOrderReturnById = async (userId: string, returnId: string) => {
  const orderReturn = await prisma.orderReturn.findFirst({
    where: {
      id: returnId,
      order: {
        userId,
      },
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

  if (!orderReturn) {
    throw new AppError('Return request not found', 404);
  }

  return {
    success: true,
    message: 'Return request fetched successfully',
    data: orderReturn,
  };
};

export const updateOrderReturn = async (
  returnId: string,
  data: UpdateOrderReturnInput,
) => {
  const orderReturn = await prisma.orderReturn.findUnique({
    where: { id: returnId },
  });

  if (!orderReturn) {
    throw new AppError('Return request not found', 404);
  }

  // Only allow status updates for pending returns
  if (
    orderReturn.status !== 'REQUESTED' &&
    data.status !== orderReturn.status
  ) {
    throw new AppError(
      'Can only update status for pending return requests',
      400,
    );
  }

  const updatedReturn = await prisma.orderReturn.update({
    where: { id: returnId },
    data: {
      status: data.status as OrderReturnStatusType,
      processedAt: data.status === 'APPROVED' ? new Date() : undefined,
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

  return {
    success: true,
    message: 'Return request updated successfully',
    data: updatedReturn,
  };
};

export const getAllOrderReturns = async (
  page: number = 1,
  limit: number = 10,
  status?: string,
) => {
  const skip = (page - 1) * limit;
  const where: { status?: OrderReturnStatusType } = status
    ? { status: status as OrderReturnStatusType }
    : {};

  if (
    status &&
    !['REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED'].includes(status)
  ) {
    throw new AppError('Invalid status value', 400);
  }

  const [returns, totalCount] = await Promise.all([
    prisma.orderReturn.findMany({
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
    prisma.orderReturn.count({ where }),
  ]);

  return {
    success: true,
    message: 'Order returns fetched successfully',
    data: {
      returns,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};
