import { z } from 'zod';

export const createCouponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .toUpperCase()
      .min(3, 'Coupon code must be at least 3 characters')
      .max(20, 'Coupon code must not exceed 20 characters'),
    description: z
      .string()
      .min(5, 'Description must be at least 5 characters')
      .max(200, 'Description must not exceed 200 characters'),
    discountType: z.enum(['PERCENTAGE', 'FLAT']),
    discountValue: z.number().positive('Discount value must be greater than 0'),
    minOrderAmount: z
      .number()
      .nonnegative('Min order amount cannot be negative'),
    maxDiscountAmount: z
      .number()
      .positive('Max discount amount must be greater than 0'),
    validFrom: z.coerce.date(),
    validTo: z.coerce.date(),
  })
  .refine((data) => data.validTo > data.validFrom, {
    message: 'Valid To date must be after Valid From date',
    path: ['validTo'],
  });

export const updateCouponSchema = createCouponSchema.partial();

export const validateCouponSchema = z.object({
  code: z.string().trim().toUpperCase(),
  orderAmount: z.number().positive('Order amount must be greater than 0'),
});

export const getCouponSchema = z.object({
  id: z.string().uuid('Invalid coupon ID'),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
export type GetCouponInput = z.infer<typeof getCouponSchema>;
