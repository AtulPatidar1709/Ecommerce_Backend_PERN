import { prisma } from '../../config/prisma';
import { ProductSummaryQuery } from './product.summary.schema';

export const getProductSummary = async (query: ProductSummaryQuery) => {
  const { promotion, category, limit = 4 } = query;

  return prisma.product.findMany({
    where: {
      isActive: true,

      ...(category && {
        category: {
          slug: category,
        },
      }),

      ...(promotion && {
        promotions: {
          some: {
            type: promotion,
            startsAt: { lte: new Date() },
            endsAt: { gte: new Date() },
          },
        },
      }),
    },

    take: limit,

    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      discountPrice: true,
      stock: true,

      images: {
        orderBy: { position: 'asc' },
        take: 2,
        select: {
          imageUrl: true,
          isPrimary: true,
        },
      },
    },
  });
};