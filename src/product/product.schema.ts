import { z } from 'zod';

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
  brand: z.string().optional(),
  categoryId: z.string().uuid('Invalid category ID format'),
  images: z
    .array(
      z.object({
        imageUrl: z.string('Image URL is required'),
        id: z.string().optional(),
        isPrimary: z.boolean().optional(),
      }),
    )
    .min(3, 'At least 3 images are required'),
  primaryIndex: z.number().min(0, 'Invalid primary index'),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
