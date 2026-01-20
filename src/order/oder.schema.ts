import { z } from 'zod';

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
  status: z
    .enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .optional(),
  sortBy: z.enum(['createdAt', 'totalAmount']).optional().default('createdAt'),
  order: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const getOrderByIdSchema = z.object({
  id: z.string().uuid('Invalid order ID'),
});

export const createOrderSchema = z.object({
  addressId: z.string().uuid('Invalid address ID'),
  couponId: z.string().uuid('Invalid coupon ID').optional(),
  cartItems: z
    .array(
      z.object({
        productId: z.string().uuid('Invalid product ID'),
        quantity: z
          .number()
          .int('Quantity must be whole number')
          .min(1, 'Quantity must be at least 1'),
        price: z.number().positive('Price must be greater than 0'),
      }),
    )
    .min(1, 'At least one item is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z
    .enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
    .default('PENDING'),
});

export type GetOrdersQuery = z.infer<typeof getOrdersQuerySchema>;
export type GetOrderByIdInput = z.infer<typeof getOrderByIdSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
