import { z } from 'zod';
import {
  emailField,
  nameField,
  passField,
  phoneField,
  userIdField,
} from '../types/common/fields.schema';

export const sendOtpSchema = z.object({
  email: emailField,
  phone: phoneField.optional(),
});

export const registerSchema = sendOtpSchema.extend({
  name: nameField,
  password: passField,
});

export const loginSchema = sendOtpSchema.extend({
  password: passField,
});

export const otpVerifySchema = z.object({
  userId: userIdField,
  otp: z.string().length(6, {
    message: 'OTP must be exactly 6 digits',
  }),
});

/* ---------- TYPES (Derived) ---------- */

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
