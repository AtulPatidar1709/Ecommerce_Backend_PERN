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

const validateProductsByCart = async (
  userId: string,
): Promise<{
  productMap: Map<string, [number, number]>;
  totalAmount: number;
}> => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { product: true },
  });

  console.log('Cart Items:', cartItems); // Debugging log

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

// ✅ Main createOrder function using only cart IDs
export const createOrder = async (
  userId: string,
  data: { addressId: string; couponId?: string },
) => {
  // Validate user address
  await validateUserAddress(userId, data.addressId);

  // Validate products and calculate total
  const { totalAmount, productMap } = await validateProductsByCart(userId);

  // Apply coupon
  const { discountAmount, finalAmount } = await applyCoupon(
    data.couponId,
    totalAmount,
  );

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Decrement stock for all products
      for (const [productId, quantity] of productMap.entries()) {
        await tx.product.update({
          where: { id: productId },
          data: { stock: { decrement: quantity[0] } },
        });
      }

      // Create order
      return tx.order.create({
        data: {
          userId,
          addressId: data.addressId,
          couponId: data.couponId,
          totalAmount: finalAmount,
          discountAmount,
          orderItems: {
            create: Array.from(productMap.entries()).map(
              ([productId, quantity]) => {
                return {
                  productId,
                  quantity: quantity[0] || 0,
                  price: quantity[1] || 0, // save actual paid price
                };
              },
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
    });

    return order;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Failed to create order', 500);
  }
};

export const getUserOrders = async (userId: string, query: GetOrdersQuery) => {
  const skip = (Number(query.page) - 1) * Number(query.limit);
  const limit = Number(query.limit);

  const whereClause = {
    userId,
    ...(query.status && { status: query.status }),
  };

  // Run both queries in parallel
  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        [query.sortBy === 'totalAmount' ? 'totalAmount' : 'createdAt']:
          query.order === 'asc' ? 'asc' : 'desc',
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                title: true,
                images: true,
                price: true,
                discountPrice: true,
              },
            },
          },
        },
        address: true,
        coupon: true,
        payment: { select: { status: true, paymentMethod: true } },
        cancellation: true,
        return: true,
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
              description: true,
              price: true,
              discountPrice: true,
              images: {
                select: { imageUrl: true },
              },
            },
          },
        },
      },
      coupon: {
        select: {
          id: true,
        },
      },
      payment: {
        select: {
          id: true,
          status: true,
          paymentMethod: true,
        },
      },
      cancellation: {
        select: {
          id: true,
          reason: true,
          requestedAt: true,
          status: true,
          processedAt: true,
        },
      },
      return: {
        select: {
          id: true,
          reason: true,
          requestedAt: true,
          status: true,
          processedAt: true,
        },
      },
      user: { select: { email: true, phone: true } },
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
