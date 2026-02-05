import { z } from 'zod';
import { nameField } from '../types/common/fields.schema';

export const createCategorySchema = z.object({
  name: nameField,
  slug: z
    .string()
    .toLowerCase()
    .trim()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must contain only lowercase letters, numbers, and hyphens',
    ),
  imageUrl: z.string('Invalid Image URL').optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const getCategorySchema = z.object({
  id: z.uuid('Invalid category ID'),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type GetCategoryInput = z.infer<typeof getCategorySchema>;
