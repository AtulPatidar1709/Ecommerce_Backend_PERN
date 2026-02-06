import { z } from 'zod';

export const getAllProductsQuerySchema = z.object({
  search: z
    .string()
    .optional()
    .transform((val) => val?.toUpperCase()),

  category: z
    .string()
    .transform((v) => v.split(','))
    .optional()
    .transform((val) => val?.map((v) => v.toUpperCase())),

  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),

  rating: z.coerce.number().min(1).max(5).optional(),

  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),

  sort: z.enum(['price_asc', 'price_desc', 'latest']).optional(),
});

export const createProductSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().positive('Price must be greater than 0'),
  discountPrice: z
    .number()
    .positive('Discount price must be greater than 0')
    .optional(),
  stock: z
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  category: z.string().optional(),
  categoryId: z.uuid('Invalid category ID format'),
  images: z
    .array(
      z.object({
        imageUrl: z.string('Image URL is required'),
        id: z.string().optional(),
        isPrimary: z.boolean().optional(),
      }),
    )
    .min(4, 'At least 3 images are required'),
  primaryIndex: z.number().min(0, 'Invalid primary index'),
  slug: z.string().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetAllProductsQueryInputType = z.infer<
  typeof getAllProductsQuerySchema
>;
