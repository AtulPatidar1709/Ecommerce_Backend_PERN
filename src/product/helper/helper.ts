import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/AppError';
import { UpdateProductInput } from '../product.schema';
import { deleteFromCloudinary } from '../utils/deleteFromCloudinary';

// Helper function to validate category exists
const validateCategory = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }
};

// Helper function to validate product exists
const getProductOrThrow = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

// Helper function to handle Cloudinary deletions
const deleteCloudinaryImages = async (imageUrls: string[]) => {
  await Promise.all(
    imageUrls.map(async (url) => {
      try {
        await deleteFromCloudinary(url);
      } catch (err) {
        console.error(`Failed to delete image ${url}:`, err);
      }
    }),
  );
};

// Helper function to process images for update
const processUpdateImages = (images: UpdateProductInput['images']) => {
  type PrismaImageAcc = {
    create: Array<{ imageUrl: string; isPrimary?: boolean }>;
    updateMany: Array<{ data: { isPrimary?: boolean }; where: { id: string } }>;
  };

  const prismaImages = images?.map((img) => {
    if (img.id) {
      return {
        update: { data: { isPrimary: img.isPrimary }, where: { id: img.id } },
      };
    }
    return { create: { imageUrl: img.imageUrl, isPrimary: img.isPrimary } };
  });

  return (
    prismaImages?.reduce<PrismaImageAcc>(
      (acc, val) => {
        if ('create' in val) acc.create.push(val.create!);
        if ('update' in val) acc.updateMany.push(val.update!);
        return acc;
      },
      { create: [], updateMany: [] },
    ) || { create: [], updateMany: [] }
  );
};

export {
  validateCategory,
  getProductOrThrow,
  deleteCloudinaryImages,
  processUpdateImages,
};
