import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcrypt';
import { UpdateProfileInput, ChangePasswordInput } from './user.schema';

export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      role: true,
      isVerified: true,
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    success: true,
    message: 'User profile fetched successfully',
    data: user,
  };
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileInput,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      phone: data.phone || user.phone,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isVerified: true,
      updatedAt: true,
    },
  });

  return {
    success: true,
    message: 'Profile updated successfully',
    data: updatedUser,
  };
};

export const changePassword = async (
  userId: string,
  data: ChangePasswordInput,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify current password
  const isPasswordValid = await bcrypt.compare(
    data.currentPassword,
    user.password!,
  );

  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(data.newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return {
    success: true,
    message: 'Password changed successfully',
  };
};

export const getUserStats = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  const [totalOrders, totalSpent, totalAddresses, totalReviews, pendingOrders] =
    await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.order.aggregate({
        where: { userId },
        _sum: { totalAmount: true },
      }),
      prisma.address.count({ where: { userId } }),
      prisma.review.count({ where: { userId } }),
      prisma.order.count({
        where: { userId, status: 'PENDING' },
      }),
    ]);

  return {
    success: true,
    message: 'User stats fetched successfully',
    data: {
      totalOrders,
      totalSpent: totalSpent._sum.totalAmount || 0,
      totalAddresses,
      totalReviews,
      pendingOrders,
    },
  };
};

export const getAllUsers = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        isVerified: true,
        createdAt: true,
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.user.count(),
  ]);

  return {
    success: true,
    message: 'Users fetched successfully',
    data: {
      users,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isVerified: true,
      createdAt: true,
      updatedAt: true,
      orders: {
        select: {
          id: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
      },
      addresses: {
        select: {
          id: true,
          name: true,
          city: true,
        },
      },
    },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return {
    success: true,
    message: 'User fetched successfully',
    data: user,
  };
};

export const deactivateAccount = async (userId: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password!);

  if (!isPasswordValid) {
    throw new AppError('Password is incorrect', 401);
  }

  // Update user status
  await prisma.user.update({
    where: { id: userId },
    data: { isActive: false },
  });

  return {
    success: true,
    message: 'Account deactivated successfully',
  };
};
