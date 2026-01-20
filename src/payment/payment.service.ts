import { PaymentStatus } from '../../prisma/generated/prisma/enums';
import { config } from '../config/config';
import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { InitiatePaymentInput } from './payment.schema';
import crypto from 'crypto';

export const initiatePayment = async (
  userId: string,
  data: InitiatePaymentInput,
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

  // Check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { orderId: data.orderId },
  });

  if (existingPayment) {
    throw new AppError('Payment already initiated for this order', 409);
  }

  const payment = await prisma.payment.create({
    data: {
      orderId: data.orderId,
      amount: order.totalAmount - order.discountAmount,
      paymentMethod: data.paymentMethod,
      status: 'CREATED',
    },
  });

  return {
    success: true,
    message: 'Payment initiated successfully',
    data: {
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
    },
  };
};

export const getPaymentByOrderId = async (userId: string, orderId: string) => {
  // Verify order exists and belongs to user
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const payment = await prisma.payment.findUnique({
    where: { orderId },
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

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  return {
    success: true,
    message: 'Payment fetched successfully',
    data: payment,
  };
};

export const getPaymentById = async (userId: string, paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      order: {
        select: {
          id: true,
          userId: true,
          totalAmount: true,
          discountAmount: true,
          status: true,
          createdAt: true,
        },
      },
    },
  });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  if (payment.order.userId !== userId) {
    throw new AppError('You do not have access to this payment', 403);
  }

  return {
    success: true,
    message: 'Payment fetched successfully',
    data: payment,
  };
};

export const verifyRazorpayPayment = async (
  userId: string,
  orderId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
) => {
  // Verify order exists and belongs to user
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId,
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  const payment = await prisma.payment.findUnique({
    where: { orderId },
  });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  // Verify signature
  const key_secret = config.rzpTestKeySecret;
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;

  if (!key_secret || key_secret === undefined) {
    throw new AppError('Something went wrong');
  }

  const expectedSignature = crypto
    .createHmac('sha256', key_secret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError(
      'Invalid payment signature. Payment verification failed',
      400,
    );
  }

  // Update payment status
  const updatedPayment = await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'SUCCESS',
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    },
  });

  // Update order status
  await prisma.order.update({
    where: { id: orderId },
    data: { status: 'CONFIRMED' },
  });

  return {
    success: true,
    message: 'Payment verified and confirmed successfully',
    data: {
      paymentId: updatedPayment.id,
      orderId: updatedPayment.orderId,
      status: updatedPayment.status,
    },
  };
};

export const updatePaymentStatus = async (
  paymentId: string,
  status: string,
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
  });

  if (!payment) {
    throw new AppError('Payment not found', 404);
  }

  const validStatuses: PaymentStatus[] = [
    'CREATED',
    'SUCCESS',
    'FAILED',
    'REFUNDED',
  ];

  if (!validStatuses.includes(status as PaymentStatus)) {
    throw new AppError('Invalid payment status', 400);
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: paymentId },
    data: { status: status as PaymentStatus },
  });

  return {
    success: true,
    message: 'Payment status updated successfully',
    data: updatedPayment,
  };
};

export const getAllPayments = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [payments, totalCount] = await Promise.all([
    prisma.payment.findMany({
      include: {
        order: {
          select: {
            id: true,
            userId: true,
            totalAmount: true,
            status: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.payment.count(),
  ]);

  return {
    success: true,
    message: 'Payments fetched successfully',
    data: {
      payments,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};
