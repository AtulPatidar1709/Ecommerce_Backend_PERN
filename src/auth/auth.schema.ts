import { z } from 'zod';
import {
  emailField,
  nameField,
  passField,
  phoneField,
  userIdField,
} from '../types/common/fields.schema';

export const verifiCationTypeSchema = z.object({
  email: emailField,
  phone: phoneField.optional(),
});

export const userLeftSchema = z.object({
  id: userIdField,
  role: z.enum(['USER', 'ADMIN']),
});

export const userSchema = verifiCationTypeSchema.extend(userLeftSchema.shape);

export const sendOtpSchema = z.object({
  email: emailField,
  phone: phoneField.optional(),
});

export const registerSchema = verifiCationTypeSchema.extend({
  name: nameField,
  password: passField,
});

export const loginSchema = verifiCationTypeSchema.extend({
  password: passField,
});

export const otpVerifySchema = userSchema.extend({
  otp: z.string().length(6, {
    message: 'OTP must be exactly 6 digits',
  }),
});

export const JwtUserPayload = z.object({
  id: userIdField,
  email: emailField,
  role: z.enum(['USER', 'ADMIN']),
  phone: phoneField.optional(),
});

/* ---------- TYPES (Derived) ---------- */

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type SendOtpInput = z.infer<typeof sendOtpSchema>;
export type userType = z.infer<typeof userSchema>;
export type userPayloadType = z.infer<typeof JwtUserPayload>;
