import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import {
  GetOrderByIdInput,
  GetOrdersQuery,
  UpdateOrderStatusInput,
} from './oder.schema';
// ✅ Validate products using only cartItem IDs

const validateUserAddress = async (userId: string, addressId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new AppError('Address not found or does not belong to user', 404);
  }
};

export const validateProductsByCart = async (
  userId: string,
): Promise<{
  productMap: Map<string, [number, number]>;
  totalAmount: number;
}> => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  if (cartItems.length === 0) {
    throw new AppError('Cart is empty', 400);
  }

  let totalAmount = 0;
  const productMap = new Map<string, [number, number]>(); // [quantity, price]

  cartItems.forEach((item) => {
    const product = item.product;

    if (!product) {
      throw new AppError(`Product ${item.productId} not found`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for product ${product.title}. Available: ${product.stock}`,
        400,
      );
    }

    totalAmount += (product.discountPrice ?? product.price) * item.quantity;
    productMap.set(item.productId, [
      item.quantity,
      product.discountPrice ?? product.price,
    ]);
  });

  return { productMap, totalAmount };
};

const applyCoupon = async (
  couponId: string | undefined,
  totalAmount: number,
) => {
  if (!couponId) return { discountAmount: 0, finalAmount: totalAmount };

  const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });

  if (!coupon) throw new AppError('Coupon not found', 404);
  if (!coupon.isActive) throw new AppError('Coupon is inactive', 400);

  if (coupon.minOrderAmount && totalAmount < coupon.minOrderAmount) {
    throw new AppError(
      `Minimum order amount of ${coupon.minOrderAmount} required`,
      400,
    );
  }

  const discountAmount =
    coupon.discountType === 'PERCENTAGE'
      ? (totalAmount * coupon.discountValue) / 100
      : coupon.discountValue;

  return {
    discountAmount: Math.min(discountAmount, totalAmount),
    finalAmount: totalAmount - Math.min(discountAmount, totalAmount),
  };
};

export const createOrder = async (
  userId: string,
  data: {
    addressId: string;
    couponId?: string;
    paymentMethod?: 'COD' | 'RAZORPAY';
  },
) => {
  // Validate address
  await validateUserAddress(userId, data.addressId);

  // Validate cart + compute totals
  const { totalAmount, productMap } = await validateProductsByCart(userId);

  if (!productMap || productMap.size === 0) {
    throw new AppError('Cart is empty', 400);
  }

  // Apply coupon
  const { discountAmount, finalAmount } = await applyCoupon(
    data.couponId,
    totalAmount,
  );

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock (atomic)
      for (const [productId, quantity] of productMap.entries()) {
        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity[0] } },
        });
      }

      // Create order + items
      const orderData = await tx.order.create({
        data: {
          userId,
          addressId: data.addressId,
          couponId: data.couponId,
          totalAmount: finalAmount,
          discountAmount,
          status: 'CONFIRMED',
          orderItems: {
            create: Array.from(productMap.entries()).map(
              ([productId, quantity]) => ({
                productId,
                quantity: quantity[0] || 0,
                price: quantity[1] || 0,
              }),
            ),
          },
        },
        include: {
          orderItems: { include: { product: true } },
          address: true,
          coupon: true,
          payment: true,
        },
      });

      // Create payment row (COD or Razorpay-confirmed)
      await tx.payment.create({
        data: {
          orderId: orderData.id,
          amount: finalAmount,
          paymentMethod: data.paymentMethod ?? 'COD',
          status: data.paymentMethod === 'RAZORPAY' ? 'CREATED' : 'SUCCESS',
        },
      });

      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return orderData;
    });

    return order;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to create order', 500);
  }
};

export const createPendingOrder = async (
  userId: string,
  data: {
    addressId: string;
    couponId?: string;
  },
) => {
  await validateUserAddress(userId, data.addressId);

  const { totalAmount, productMap } = await validateProductsByCart(userId);

  if (!productMap || productMap.size === 0) {
    throw new AppError('Cart is empty', 400);
  }

  const { discountAmount, finalAmount } = await applyCoupon(
    data.couponId,
    totalAmount,
  );

  return prisma.order.create({
    data: {
      userId,
      addressId: data.addressId,
      couponId: data.couponId,
      totalAmount: finalAmount,
      discountAmount,
      status: 'PENDING',
      orderItems: {
        create: Array.from(productMap.entries()).map(
          ([productId, quantity]) => ({
            productId,
            quantity: quantity[0] || 0,
            price: quantity[1] || 0,
          }),
        ),
      },
    },
    include: {
      orderItems: { include: { product: true } },
      address: {
        select: {
          id: true,
          street: true,
        },
      },
    },
  });
};

export const getUserOrders = async (userId: string, query: GetOrdersQuery) => {
  const skip = (query.page - 1) * query.limit;
  const limit = query.limit;

  const whereClause = {
    userId,
    ...(query.status && { status: query.status }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      skip,
      take: limit,
      orderBy: {
        [query.sortBy === 'totalAmount' ? 'totalAmount' : 'createdAt']:
          query.order === 'asc' ? 'asc' : 'desc',
      },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        orderItems: {
          select: {
            product: {
              select: {
                id: true,
              },
            },
          },
        },
        address: {
          select: {
            id: true,
          },
        },
      },
    }),
    prisma.order.count({ where: whereClause }),
  ]);

  return {
    orders,
    pagination: {
      total,
      page: Number(query.page),
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

export const getOrderById = async (
  userId: string,
  input: GetOrderByIdInput,
) => {
  const order = await prisma.order.findUnique({
    where: { id: input.id },
    include: {
      orderItems: {
        include: {
          product: {
            select: {
              id: true,
              title: true,
              price: true,
              discountPrice: true,
              images: {
                take: 1,
                select: { publicId: true },
              },
            },
          },
        },
      },
      payment: {
        select: {
          status: true,
          paymentMethod: true,
          amount: true,
        },
      },
    },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  if (order.userId !== userId) {
    throw new AppError('Unauthorized access to this order', 403);
  }

  return order;
};

export const updateOrderStatus = async (
  orderId: string,
  data: UpdateOrderStatusInput,
) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) {
    throw new AppError('Order not found', 404);
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: data.status },
    include: {
      orderItems: { include: { product: true } },
      payment: true,
    },
  });
};

export const cancelOrder = async (userId: string, orderId: string) => {
  const order = await getOrderById(userId, { id: orderId });

  if (order.status !== 'PENDING') {
    throw new AppError('Only pending orders can be cancelled', 400);
  }

  try {
    return await prisma.$transaction(async (tx) => {
      await Promise.all(
        order.orderItems.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { increment: item.quantity } },
          }),
        ),
      );

      return tx.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' },
        include: { orderItems: true, payment: true },
      });
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to cancel order', 500);
  }
};
