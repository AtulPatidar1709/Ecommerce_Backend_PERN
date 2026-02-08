import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { AddToCartInput } from './cart.schema';

export const addToCart = async (userId: string, data: AddToCartInput) => {
  // Verify product exists and has stock
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (product.stock < data.quantity) {
    throw new AppError('Insufficient stock available', 400);
  }

  // Check if item already exists in cart
  const existingItem = await prisma.cartItem.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: data.productId,
      },
    },
    // include: { product: true },
  });

  if (existingItem) {
    // Update quantity if item exists
    const newQuantity = data.quantity;

    if (newQuantity > product.stock) {
      throw new AppError('Insufficient stock for this quantity', 400);
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        userId_productId: {
          userId,
          productId: data.productId,
        },
      },
      data: { quantity: newQuantity },
      // include: { product: true },
    });

    return {
      success: true,
      message: 'Cart item updated',
      data: updatedItem,
    };
  }

  // Create new cart item
  const cartItem = await prisma.cartItem.create({
    data: {
      userId,
      productId: data.productId,
      quantity: data.quantity,
    },
    // include: { product: true },
  });

  return {
    success: true,
    message: 'Product added to cart',
    cartItem: cartItem,
  };
};

export const getCartItems = async (userId: string) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      quantity: true,
      productId: true,
      product: {
        select: {
          title: true,
          price: true,
          discountPrice: true,
          images: {
            select: {
              imageUrl: true,
            },
          },
        },
      },
    },
  });

  // Add subtotal for each item and calculate cart totals
  const cartItemsWithSubtotal = cartItems.map((item) => ({
    ...item,
    subtotal:
      (item.product.discountPrice || item.product.price) * item.quantity,
  }));

  // Calculate cart totals
  const summary = cartItemsWithSubtotal.reduce(
    (acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalProducts: acc.totalProducts + 1,
      subtotal: acc.subtotal + item.subtotal,
    }),
    { totalItems: 0, totalProducts: 0, subtotal: 0 },
  );

  return {
    success: true,
    message: 'Cart items fetched successfully',
    cartItems: cartItemsWithSubtotal,
    summary,
  };
};

export const updateCartItem = async (
  userId: string,
  productId: string,
  quantity: number,
) => {
  // Verify cart item exists and belongs to user
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      userId,
      productId,
    },
    include: { product: true },
  });

  if (!cartItem) {
    throw new AppError('Cart item not found', 404);
  }

  // Check if product has enough stock
  if (cartItem.product.stock < quantity) {
    throw new AppError('Insufficient stock for requested quantity', 400);
  }

  const updatedItem = await prisma.cartItem.update({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    data: { quantity },
    include: { product: true },
  });

  return {
    success: true,
    message: 'Cart item updated successfully',
    cartItem: updatedItem,
  };
};

export const removeFromCart = async (userId: string, productId: string) => {
  // Verify cart item exists and belongs to user
  const cartItem = await prisma.cartItem.findFirst({
    where: {
      userId,
      productId,
    },
  });

  if (!cartItem) {
    throw new AppError('Cart item not found', 404);
  }

  await prisma.cartItem.delete({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  return {
    success: true,
    message: 'Item removed from cart',
  };
};

export const clearCart = async (userId: string) => {
  const deletedCount = await prisma.cartItem.deleteMany({
    where: { userId },
  });

  return {
    success: true,
    message: 'Cart cleared successfully',
    deletedCount: deletedCount.count,
  };
};
