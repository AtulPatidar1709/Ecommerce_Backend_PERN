import { z } from 'zod';

export const createOrderReturnSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  reason: z
    .string()
    .min(10, 'Reason must be at least 10 characters')
    .max(500, 'Reason must not exceed 500 characters'),
  quantity: z
    .number()
    .int('Quantity must be an integer')
    .positive('Quantity must be greater than 0'),
  images: z.array(z.string().url('Invalid image URL')).optional(),
});

export const updateOrderReturnSchema = z.object({
  status: z.enum(['REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED']),
  adminNotes: z
    .string()
    .max(500, 'Admin notes must not exceed 500 characters')
    .optional(),
  refundAmount: z
    .number()
    .nonnegative('Refund amount cannot be negative')
    .optional(),
});

export const getOrderReturnSchema = z.object({
  id: z.string().uuid('Invalid order return ID'),
});

export type CreateOrderReturnInput = z.infer<typeof createOrderReturnSchema>;
export type UpdateOrderReturnInput = z.infer<typeof updateOrderReturnSchema>;
export type GetOrderReturnInput = z.infer<typeof getOrderReturnSchema>;
