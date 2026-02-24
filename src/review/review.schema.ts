import { z } from 'zod';
import {
  commentField,
  productIdField,
  retingField,
} from '../types/common/fields.schema.js';

export const createReviewSchema = z.object({
  productId: productIdField,
  rating: retingField,
  comment: commentField,
});

export const updateReviewSchema = createReviewSchema
  .partial()
  .omit({ productId: true });

export const getReviewSchema = z.object({
  id: z.uuid('Invalid review ID'),
});

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type GetReviewInput = z.infer<typeof getReviewSchema>;
