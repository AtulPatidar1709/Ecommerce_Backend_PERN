import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  paymentMethod: z.enum(['COD', 'RAZORPAY']).default('COD'),
});

export const verifyRazorpayPaymentSchema = z.object({
  orderId: z.string().uuid('Invalid order ID'),
  razorpayOrderId: z.string().min(1, 'Razorpay order ID is required'),
  razorpayPaymentId: z.string().min(1, 'Razorpay payment ID is required'),
  razorpaySignature: z.string().min(1, 'Razorpay signature is required'),
});

export const getPaymentSchema = z.object({
  id: z.string().uuid('Invalid payment ID'),
});

export const paymentStatus = z.object({
  status: z.enum(['CREATED', 'SUCCESS', 'FAILED', 'REFUNDED']),
});

export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
export type VerifyRazorpayPaymentInput = z.infer<
  typeof verifyRazorpayPaymentSchema
>;
export type GetPaymentInput = z.infer<typeof getPaymentSchema>;

export type paymentStatusTypes = z.infer<typeof paymentStatus>;
