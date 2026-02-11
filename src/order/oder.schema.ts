import { z } from 'zod';
import { orderStatusSchema } from '../types/common/fields.schema';

export const getOrdersQuerySchema = z.object({
  page: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1))
    .optional()
    .default(1),
  limit: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(100))
    .optional()
    .default(10),
  status: orderStatusSchema,
  sortBy: z.enum(['createdAt', 'totalAmount']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const getOrderByIdSchema = z.object({
  id: z.uuid('Invalid order ID'),
});

export const createOrderSchema = z.object({
  addressId: z.string().min(1, 'Invalid address ID'),
  couponId: z.string().optional(),
  paymentMethod: z.enum(['COD', 'RAZORPAY']).default('COD'),
});

export const updateOrderStatusSchema = z.object({
  status: orderStatusSchema,
});

export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;
export type GetOrderByIdInput = z.infer<typeof getOrderByIdSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
