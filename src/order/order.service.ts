import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import {
  CreateOrderInput,
  GetOrderByIdInput,
  GetOrdersQuery,
  UpdateOrderStatusInput,
} from './oder.schema';

const validateUserAddress = async (userId: string, addressId: string) => {
  const address = await prisma.address.findUnique({
    where: { id: addressId },
  });

  if (!address || address.userId !== userId) {
    throw new AppError('Address not found or does not belong to user', 404);
  }
};

const validateProducts = async (
  items: CreateOrderInput['cartItems'],
): Promise<Map<string, number>> => {
  const productMap = new Map<string, number>();

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.productId) } },
  });

  if (products.length !== items.length) {
    throw new AppError('One or more products not found', 404);
  }

  items.forEach((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) {
      throw new AppError(`Product ${item.productId} not found`, 404);
    }

    if (product.stock < item.quantity) {
      throw new AppError(
        `Insufficient stock for product ${product.title}`,
        400,
      );
    }

    productMap.set(item.productId, item.quantity);
  });

  return productMap;
};

const applyCoupon = async (
  couponId: string | undefined,
  totalAmount: number,
) => {
  if (!couponId) {
    return { discountAmount: 0, finalAmount: totalAmount };
  }

  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }

  if (!coupon.isActive) {
    throw new AppError('Coupon is inactive', 400);
  }

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

export const createOrder = async (userId: string, data: CreateOrderInput) => {
  await validateUserAddress(userId, data.addressId);
  await validateProducts(data.cartItems);

  const totalAmount = data.cartItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );

  const { discountAmount, finalAmount } = await applyCoupon(
    data.couponId,
    totalAmount,
  );

  const order = await prisma.order.create({
    data: {
      userId,
      addressId: data.addressId,
      couponId: data.couponId,
      totalAmount: finalAmount,
      discountAmount,
      orderItems: {
        create: data.cartItems.map((item) => ({
          productId: item.productId,
          price: item.price,
          quantity: item.quantity,
        })),
      },
    },
    include: {
      orderItems: {
        include: { product: true },
      },
      address: true,
      coupon: true,
      payment: true,
    },
  });

  return order;
};

export const getUserOrders = async (userId: string, query: GetOrdersQuery) => {
  const skip = (Number(query.page) - 1) * Number(query.limit);

  const whereClause = {
    userId,
    ...(query.status && { status: query.status }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: whereClause,
      skip,
      take: Number(query.limit),
      orderBy: {
        [query.sortBy || 'createdAt']: query.order,
      },
      include: {
        orderItems: {
          include: { product: { select: { title: true, images: true } } },
        },
        address: true,
        coupon: true,
        payment: { select: { status: true } },
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
      limit: Number(query.limit),
      pages: Math.ceil(total / Number(query.limit)),
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
        include: { product: true },
      },
      address: true,
      coupon: true,
      payment: true,
      cancellation: true,
      return: true,
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

  return prisma.order.update({
    where: { id: orderId },
    data: { status: 'CANCELLED' },
    include: { orderItems: true, payment: true },
  });
};
