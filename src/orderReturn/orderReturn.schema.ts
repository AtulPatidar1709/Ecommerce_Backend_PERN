import { z } from 'zod';
import { orderIdField } from '../types/common/fields.schema.js';

export const createOrderReturnSchema = z.object({
  orderId: orderIdField,
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
});

export const getOrderReturnSchema = z.object({
  id: orderIdField,
});

export type CreateOrderReturnInput = z.infer<typeof createOrderReturnSchema>;
export type UpdateOrderReturnInput = z.infer<typeof updateOrderReturnSchema>;
export type GetOrderReturnInput = z.infer<typeof getOrderReturnSchema>;
