import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters long' }),

  email: z.email({ message: 'Please provide a valid email address' }),

  phone: z.string().min(10, { message: 'Phone number must contain at least 10 digits' }).optional(),

  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
});

export const sendOtpSchema = z.object({
  email: z.email({
    message: 'Please provide a valid email address',
  }),
  phone: z
    .string()
    .min(10, {
      message: 'Phone number must contain at least 10 digits',
    })
    .optional(),
});

export const loginSchema = sendOtpSchema.extend({
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters long',
  }),
});

export const otpVerifySchema = z.object({
  userId: z.uuid({
    message: 'Invalid user ID format',
  }),
  otp: z.string().length(6, {
    message: 'OTP must be exactly 6 digits',
  }),
});

/* ---------- TYPES (Derived) ---------- */

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
