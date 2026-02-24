import { prisma } from '../../config/prisma.js';
import { AppError } from '../../utils/AppError.js';
import { UpdateProductInput } from '../product.schema.js';
import { deleteFromCloudinary } from '../utils/cloudinary/deleteFromCloudinary.js';

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
  type CreateImage = {
    create: {
      publicId: string;
      isPrimary?: boolean;
      position?: number;
    };
  };

  type UpdateImage = {
    update: {
      where: { id: string };
      data: {
        isPrimary?: boolean;
        position?: number;
      };
    };
  };

  type MappedImage = CreateImage | UpdateImage;

  type PrismaImageAcc = {
    create: CreateImage['create'][];
    update: UpdateImage['update'][];
  };

  if (!images || images.length === 0) {
    return { create: [], update: [] };
  }

  const mapped: MappedImage[] = images.map((img, index) => {
    if (img.id) {
      return {
        update: {
          where: { id: img.id },
          data: {
            isPrimary: img.isPrimary,
            position: index,
          },
        },
      };
    }

    if (!img.publicId) {
      throw new Error('publicId is required for new images');
    }

    return {
      create: {
        publicId: img.publicId,
        isPrimary: img.isPrimary,
        position: index,
      },
    };
  });

  return mapped.reduce<PrismaImageAcc>(
    (acc, item) => {
      if ('create' in item) {
        acc.create.push(item.create);
      } else {
        acc.update.push(item.update);
      }
      return acc;
    },
    { create: [], update: [] },
  );
};

export {
  validateCategory,
  getProductOrThrow,
  deleteCloudinaryImages,
  processUpdateImages,
};
