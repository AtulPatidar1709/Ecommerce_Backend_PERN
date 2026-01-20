import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { CreateReviewInput, UpdateReviewInput } from './review.schema';

export const createReview = async (userId: string, data: CreateReviewInput) => {
  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  // Check if user already reviewed this product
  const existingReview = await prisma.review.findUnique({
    where: {
      userId_productId: {
        userId,
        productId: data.productId,
      },
    },
  });

  if (existingReview) {
    throw new AppError('You have already reviewed this product', 409);
  }

  // Verify user has purchased this product
  const purchasedProduct = await prisma.orderItem.findFirst({
    where: {
      productId: data.productId,
      order: {
        userId,
        status: 'DELIVERED',
      },
    },
  });

  if (!purchasedProduct) {
    throw new AppError('You can only review products you have purchased', 403);
  }

  const review = await prisma.review.create({
    data: {
      userId,
      productId: data.productId,
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  return {
    success: true,
    message: 'Review created successfully',
    data: review,
  };
};

export const getReviewsByProductId = async (
  productId: string,
  page: number = 1,
  limit: number = 10,
) => {
  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const skip = (page - 1) * limit;

  const [reviews, totalCount] = await Promise.all([
    prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({ where: { productId } }),
  ]);

  const averageRating = await prisma.review.aggregate({
    where: { productId },
    _avg: { rating: true },
    _count: true,
  });

  return {
    success: true,
    message: 'Reviews fetched successfully',
    data: {
      reviews,
      averageRating: averageRating._avg.rating || 0,
      totalReviews: averageRating._count,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const getUserReviews = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  const skip = (page - 1) * limit;

  const [reviews, totalCount] = await Promise.all([
    prisma.review.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.review.count({ where: { userId } }),
  ]);

  return {
    success: true,
    message: 'User reviews fetched successfully',
    data: {
      reviews,
      totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
    },
  };
};

export const getReviewById = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      product: {
        select: {
          id: true,
          title: true,
        },
      },
    },
  });

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  return {
    success: true,
    message: 'Review fetched successfully',
    data: review,
  };
};

export const updateReview = async (
  userId: string,
  reviewId: string,
  data: UpdateReviewInput,
) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.userId !== userId) {
    throw new AppError('You can only update your own reviews', 403);
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: data.rating,
      comment: data.comment,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  return {
    success: true,
    message: 'Review updated successfully',
    data: updatedReview,
  };
};

export const deleteReview = async (userId: string, reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  if (review.userId !== userId) {
    throw new AppError('You can only delete your own reviews', 403);
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return {
    success: true,
    message: 'Review deleted successfully',
  };
};

export const deleteReviewByAdmin = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError('Review not found', 404);
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  return {
    success: true,
    message: 'Review deleted successfully by admin',
  };
};
