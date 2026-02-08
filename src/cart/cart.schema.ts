import { z } from 'zod';

// Base validation schemas
const productIdSchema = z.uuid({ message: 'Invalid product ID format' });
const quantitySchema = z
  .number()
  .int('Quantity must be a whole number')
  .min(1, 'Quantity must be at least 1')
  .max(10, 'Quantity cannot exceed 999');

// Composed schemas
export const addToCartSchema = z.object({
  productId: productIdSchema,
  quantity: quantitySchema,
});

export const removeFromCartSchema = z.object({
  productId: productIdSchema,
});

export const updateCartItemSchema = removeFromCartSchema.extend({
  quantity: quantitySchema,
});

// Type inference
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartItemInput = z.infer<typeof updateCartItemSchema>;
export type RemoveFromCartInput = z.infer<typeof removeFromCartSchema>;
