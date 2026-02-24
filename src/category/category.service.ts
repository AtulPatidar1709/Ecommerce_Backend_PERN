import { prisma } from '../config/prisma.js';
import { AppError } from '../utils/AppError.js';
import { CreateCategoryInput, UpdateCategoryInput } from "./category.schema.js";

export const createCategory = async (data: CreateCategoryInput) => {
  // Check if slug already exists
  const existingCategory = await prisma.category.findUnique({
    where: { slug: data.slug },
  });

  if (existingCategory) {
    throw new AppError('Category with this slug already exists', 409);
  }

  const category = await prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug,
      imageUrl: data.imageUrl,
    },
  });

  return {
    success: true,
    message: 'Category created successfully',
    data: category,
  };
};

export const getAllCategories = async (isActive?: boolean) => {
  const where = isActive !== undefined ? { isActive } : {};

  const categories = await prisma.category.findMany({
    where,
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    success: true,
    message: 'Categories fetched successfully',
    categories: categories,
    count: categories.length,
  };
};

export const getCategoryById = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: {
      products: {
        select: {
          id: true,
          title: true,
          price: true,
          discountPrice: true,
          stock: true,
          isActive: true,
        },
      },
      _count: {
        select: { products: true },
      },
    },
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return {
    success: true,
    message: 'Category fetched successfully',
    data: category,
  };
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        select: {
          id: true,
          title: true,
          price: true,
          discountPrice: true,
          stock: true,
          images: {
            where: { isPrimary: true },
            select: { publicId: true },
            take: 1,
          },
        },
      },
    },
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  return {
    success: true,
    message: 'Category fetched successfully',
    data: category,
  };
};

export const updateCategory = async (
  categoryId: string,
  data: UpdateCategoryInput,
) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existingCategory) {
    throw new AppError('Category not found', 404);
  }

  // Check if new slug is unique (if slug is being updated)
  if (data.slug && data.slug !== existingCategory.slug) {
    const slugExists = await prisma.category.findUnique({
      where: { slug: data.slug },
    });

    if (slugExists) {
      throw new AppError('Category with this slug already exists', 409);
    }
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: data.name,
      slug: data.slug,
      imageUrl: data.imageUrl,
    },
  });

  return {
    success: true,
    message: 'Category updated successfully',
    data: category,
  };
};

export const toggleCategoryStatus = async (categoryId: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!existingCategory) {
    throw new AppError('Category not found', 404);
  }

  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { isActive: !existingCategory.isActive },
  });

  return {
    success: true,
    message: `Category ${category.isActive ? 'activated' : 'deactivated'} successfully`,
    data: category,
  };
};

export const deleteCategory = async (categoryId: string) => {
  const existingCategory = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { products: true } } },
  });

  if (!existingCategory) {
    throw new AppError('Category not found', 404);
  }

  if (existingCategory._count.products > 0) {
    throw new AppError('Cannot delete category with associated products', 409);
  }

  await prisma.category.delete({
    where: { id: categoryId },
  });

  return {
    success: true,
    message: 'Category deleted successfully',
  };
};
