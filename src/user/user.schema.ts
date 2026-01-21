import { z } from 'zod';
import { nameField, phoneField } from '../types/common/fields.schema';

export const updateProfileSchema = z.object({
  name: nameField,
  phone: phoneField,
});

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, 'Current password is required')
      .toLowerCase(),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .toLowerCase(),
    confirmPassword: z.string().toLowerCase(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export const getUserSchema = z.object({
  id: z.uuid('Invalid user ID'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type GetUserInput = z.infer<typeof getUserSchema>;
