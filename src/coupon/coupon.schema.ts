import { z } from 'zod';

/* ---------------- BASE SCHEMA ---------------- */
const baseCouponSchema = z.object({
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

  minOrderAmount: z.number().nonnegative('Min order amount cannot be negative'),

  maxDiscountAmount: z
    .number()
    .positive('Max discount amount must be greater than 0'),

  validFrom: z.coerce.date(),
  validTo: z.coerce.date(),
});

export const createCouponSchema = baseCouponSchema.refine(
  (data) => data.validTo > data.validFrom,
  {
    message: 'Valid To date must be after Valid From date',
    path: ['validTo'],
  },
);

/* ---------------- UPDATE ---------------- */
export const updateCouponSchema = baseCouponSchema.partial();

/* ---------------- OTHER SCHEMAS ---------------- */
export const validateCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .transform((val) => val.toUpperCase()),
  orderAmount: z.number().positive('Order amount must be greater than 0'),
});

export const getCouponSchema = z.object({
  id: z.uuid('Invalid coupon ID'),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
export type ValidateCouponInput = z.infer<typeof validateCouponSchema>;
export type GetCouponInput = z.infer<typeof getCouponSchema>;
