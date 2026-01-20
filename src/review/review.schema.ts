import { z } from 'zod';

export const createReviewSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must not exceed 5'),
  comment: z
    .string()
    .max(1000, 'Comment must not exceed 1000 characters')
    .optional(),
});

export const updateReviewSchema = createReviewSchema
  .partial()
  .omit({ productId: true });

export const getReviewSchema = z.object({
  id: z.string().uuid('Invalid review ID'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type GetReviewInput = z.infer<typeof getReviewSchema>;
