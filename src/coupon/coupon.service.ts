import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import {
  CreateCouponInput,
  UpdateCouponInput,
  ValidateCouponInput,
} from './coupon.schema';

export const createCoupon = async (data: CreateCouponInput) => {
  // Check if coupon code already exists
  const existingCoupon = await prisma.coupon.findUnique({
    where: { code: data.code },
  });

  if (existingCoupon) {
    throw new AppError('Coupon with this code already exists', 409);
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minOrderAmount: data.minOrderAmount,
      maxDiscountAmount: data.maxDiscountAmount,
      validFrom: data.validFrom,
      validTo: data.validTo,
    },
  });

  return {
    success: true,
    message: 'Coupon created successfully',
    data: coupon,
  };
};

export const getAllCoupons = async (isActive?: boolean) => {
  const where = isActive !== undefined ? { isActive } : {};

  const coupons = await prisma.coupon.findMany({
    where,
    include: {
      _count: {
        select: { orders: true, couponUsages: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    success: true,
    message: 'Coupons fetched successfully',
    data: coupons,
    count: coupons.length,
  };
};

export const getCouponById = async (couponId: string) => {
  const coupon = await prisma.coupon.findUnique({
    where: { id: couponId },
    include: {
      _count: {
        select: { orders: true, couponUsages: true },
      },
    },
  });

  if (!coupon) {
    throw new AppError('Coupon not found', 404);
  }

  return {
    success: true,
    message: 'Coupon fetched successfully',
    data: coupon,
  };
};

export const validateCoupon = async (
  userId: string,
  data: ValidateCouponInput,
) => {
  const coupon = await prisma.coupon.findUnique({
    where: { code: data.code },
  });

  console.log('coupon details ', coupon);

  if (!coupon) {
    throw new AppError('Invalid coupon code', 404);
  }

  if (!coupon.isActive) {
    throw new AppError('This coupon is no longer active', 400);
  }

  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validTo) {
    throw new AppError('This coupon has expired or not yet valid', 400);
  }

  if (data.orderAmount < coupon.minOrderAmount) {
    throw new AppError(
      `Minimum order amount of ${coupon.minOrderAmount} is required for this coupon`,
      400,
    );
  }

  // Check if user has already used this coupon
  const userCouponUsage = await prisma.userCoupon.findFirst({
    where: {
      userId,
      couponId: coupon.id,
    },
  });

  if (userCouponUsage) {
    throw new AppError('You have already used this coupon', 400);
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discountType === 'PERCENTAGE') {
    discountAmount = (data.orderAmount * coupon.discountValue) / 100;
    discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
  } else {
    discountAmount = Math.min(coupon.discountValue, coupon.maxDiscountAmount);
  }

  return {
    success: true,
    message: 'Coupon is valid',
    couponData: {
      couponId: coupon.id,
      code: coupon.code,
      discountAmount,
      discountType: coupon.discountType,
      finalAmount: data.orderAmount - discountAmount,
    },
  };
};

export const updateCoupon = async (
  couponId: string,
  data: UpdateCouponInput,
) => {
  const existingCoupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!existingCoupon) {
    throw new AppError('Coupon not found', 404);
  }

  // Check if new code is unique (if code is being updated)
  if (data.code && data.code !== existingCoupon.code) {
    const codeExists = await prisma.coupon.findUnique({
      where: { code: data.code },
    });

    if (codeExists) {
      throw new AppError('Coupon with this code already exists', 409);
    }
  }

  const coupon = await prisma.coupon.update({
    where: { id: couponId },
    data,
  });

  return {
    success: true,
    message: 'Coupon updated successfully',
    data: coupon,
  };
};

export const toggleCouponStatus = async (couponId: string) => {
  const existingCoupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!existingCoupon) {
    throw new AppError('Coupon not found', 404);
  }

  const coupon = await prisma.coupon.update({
    where: { id: couponId },
    data: { isActive: !existingCoupon.isActive },
  });

  return {
    success: true,
    message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
    data: coupon,
  };
};

export const deleteCoupon = async (couponId: string) => {
  const existingCoupon = await prisma.coupon.findUnique({
    where: { id: couponId },
  });

  if (!existingCoupon) {
    throw new AppError('Coupon not found', 404);
  }

  await prisma.coupon.delete({
    where: { id: couponId },
  });

  return {
    success: true,
    message: 'Coupon deleted successfully',
  };
};
