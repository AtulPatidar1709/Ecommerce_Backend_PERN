import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import {
  deleteCloudinaryImages,
  getProductOrThrow,
  processUpdateImages,
  validateCategory,
} from './helper/helper';
import slugify from './helper/slugify';
import {
  CreateProductInput,
  GetAllProductsQueryInputType,
  UpdateProductInput,
} from './product.schema';

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
      slug: slugify(data.title),
    },
    include: {
      images: true,
      category: true,
    },
  });

  return product;
};

export const getAllProducts = async ({
  search,
  category,
  minPrice,
  maxPrice,
  rating,
  page = 1,
  limit = 12,
  sort,
}: GetAllProductsQueryInputType) => {
  //FILTERS
  const where: any = {
    isActive: true,
  };

  if (search) {
    where.title = {
      contains: search,
      mode: 'insensitive',
    };
  }

  if (category?.length) {
    where.category = {
      name: {
        in: category,
        mode: 'insensitive',
      },
    };
  }

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = minPrice;
    if (maxPrice) where.price.lte = maxPrice;
  }

  if (rating !== undefined) {
    where.rating = {
      gte: rating,
    };
  }

  //PAGINATION
  const skip = (page - 1) * limit;

  //SORTING
  let orderBy: any = { createdAt: 'desc' };

  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };
  if (sort === 'latest') orderBy = { createdAt: 'desc' };

  //DB QUERIES
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        id: true,
        title: true,
        price: true,
        discountPrice: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
        stock: true,
        slug: true,
        images: {
          orderBy: [{ isPrimary: 'desc' }, { position: 'asc' }],
          take: 2,
          select: {
            imageUrl: true,
            isPrimary: true,
          },
        },
      },
    }),

    prisma.product.count({ where }),
  ]);

  //RESPONSE
  return {
    products,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findUnique({
    where: { slug },
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
      ...data,
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
