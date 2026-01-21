import { z } from 'zod';

export const createOrderCancellationSchema = z.object({
  orderId: z.uuid('Invalid order ID'),
  reason: z
    .string()
    .min(5, 'Reason must be at least 5 characters')
    .max(500, 'Reason must not exceed 500 characters'),
});

export const updateOrderCancellationSchema = z.object({
  status: z.enum(['REQUESTED', 'APPROVED', 'REJECTED', 'COMPLETED']),
});

export const getOrderCancellationSchema = z.object({
  id: z.uuid('Invalid order cancellation ID'),
});

export type CreateOrderCancellationInput = z.infer<
  typeof createOrderCancellationSchema
>;
export type UpdateOrderCancellationInput = z.infer<
  typeof updateOrderCancellationSchema
>;
export type GetOrderCancellationInput = z.infer<
  typeof getOrderCancellationSchema
>;
