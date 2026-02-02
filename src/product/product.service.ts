import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import {
  deleteCloudinaryImages,
  getProductOrThrow,
  processUpdateImages,
  validateCategory,
} from './helper/helper';
import { CreateProductInput, UpdateProductInput } from './product.schema';

export const createProduct = async (data: CreateProductInput) => {
  await validateCategory(data.categoryId);

  const product = await prisma.product.create({
    data: {
      title: data.title,
      description: data.description,
      price: data.price,
      discountPrice: data.discountPrice,
      stock: data.stock,
      brand: data.brand,
      categoryId: data.categoryId,
      images: {
        create: data.images.map((img, index) => ({
          imageUrl: img.imageUrl,
          isPrimary: index === data.primaryIndex,
          position: index,
        })),
      },
    },
    include: {
      images: true,
      category: true,
    },
  });

  return product;
};

export const getAllProducts = async () => {
  return prisma.product.findMany({
    where: {
      isActive: true,
    },
    select: {
      id: true,
      title: true,
      price: true,
      discountPrice: true,
      brand: true,
      stock: true,

      images: {
        orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }],
        take: 2,
        select: {
          imageUrl: true,
          isPrimary: true,
        },
      },
    },
  });
};

export const getProductById = async (id: string) => {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: 'asc' } },
      category: true,
      reviews: true,
    },
  });

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  return product;
};

export const updateProduct = async (id: string, data: UpdateProductInput) => {
  const product = await getProductOrThrow(id);

  const updatedImagesIds =
    data.images?.filter((img) => img.id).map((img) => img.id) || [];

  const removedImages = product.images.filter(
    (img) => img.id && updatedImagesIds.includes(img.id),
  );

  await deleteCloudinaryImages(removedImages.map((img) => img.imageUrl));

  const imagesData = processUpdateImages(data.images);

  // Update product
  return prisma.product.update({
    where: { id },
    data: {
      ...data, // title, price, stock, etc.
      images: imagesData,
    },
    include: { images: true },
  });
};

export const deleteProduct = async (id: string) => {
  const product = await getProductOrThrow(id);

  await deleteCloudinaryImages(product.images.map((img) => img.imageUrl));

  return await prisma.product.delete({
    where: { id },
  });
};
