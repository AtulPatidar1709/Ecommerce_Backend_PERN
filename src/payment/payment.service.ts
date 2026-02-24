import Razorpay from 'razorpay';
import { config } from '../config/config.js';
import { prisma } from '../config/prisma.js';
import { CreateOrderInput, createOrderSchema } from '../order/oder.schema.js';
import {
  createPendingOrder,
  validateProductsByCart,
} from '../order/order.service.js';
import { AppError } from '../utils/AppError.js';
import crypto from 'crypto';
import { PaymentStatus } from '@prisma/client';

const rzp = new Razorpay({
  key_id: config.rzpTestApiKey!,
  key_secret: config.rzpTestKeySecret!,
});

export const createRazorpayOrder = async (amount: number, orderId: string) => {
  const options = {
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    notes: {
      orderId: orderId.toString(),
    },
  };
  const order = await rzp.orders.create(options);
  return order;
};

export const initiatePayment = async (
  user: { id: string; email: string; role: 'USER' | 'ADMIN' },
  data: CreateOrderInput,
) => {
  // Verify order exists and belongs to user
  const parsedData = createOrderSchema.parse(data);

  const order = await createPendingOrder(user.id, data);

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  // Check if payment already exists
  const existingPayment = await prisma.payment.findUnique({
    where: { orderId: order.id },
  });

  if (existingPayment) {
    throw new AppError('Payment already initiated for this order', 409);
  }

  const orderData = await createRazorpayOrder(
    order.totalAmount - order.discountAmount,
    order.id,
  );

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: order.totalAmount - order.discountAmount,
      paymentMethod: parsedData.paymentMethod,
      razorpayOrderId: orderData.id,
      status: 'CREATED',
    },
  });

  return {
    success: true,
    message: 'Payment initiated successfully',
    data: {
      rzorderData: orderData,
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
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
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

  // 🔐 Signature verification (unchanged)
  const keySecret = config.rzpTestKeySecret;
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;

  if (!keySecret) {
    throw new AppError('Razorpay secret missing');
  }

  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    throw new AppError('Invalid payment signature', 400);
  }

  const rzOrder = await rzp.orders.fetch(razorpayOrderId);

  if (rzOrder.status !== 'paid') {
    throw new AppError('Payment not completed', 400);
  }

  if (
    Number(rzOrder.amount) !==
    Number(order.totalAmount - order.discountAmount) * 100
  ) {
    throw new AppError('Amount mismatch', 400);
  }

  // 🚨 FINALIZATION STARTS HERE
  await prisma.$transaction(async (tx) => {
    // 1️⃣ Validate cart again
    const { productMap } = await validateProductsByCart(userId);

    if (!productMap || productMap.size === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // 2️⃣ Decrement stock
    for (const [productId, quantity] of productMap.entries()) {
      await tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity[0] } },
      });
    }

    // 3️⃣ Create order items
    await tx.orderItem.createMany({
      data: Array.from(productMap.entries()).map(([productId, quantity] : any) => ({
        orderId,
        productId,
        quantity: quantity[0] || 0,
        price: quantity[1] || 0,
      })),
    });

    // 4️⃣ Update payment
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: 'SUCCESS',
        paymentMethod: 'RAZORPAY',
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature,
      },
    });

    // 5️⃣ Update order
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CONFIRMED' },
    });

    // 6️⃣ Clear cart
    await tx.cartItem.deleteMany({
      where: { userId },
    });
  });

  return {
    status: 'success',
    message: 'Payment verified and order confirmed successfully',
    data: {
      orderId,
      paymentId: payment.id,
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
