import { z } from 'zod';
import { nameField, phoneField } from '../types/common/fields.schema';

export const createAddressSchema = z.object({
  name: nameField,
  phone: phoneField,
  street: z.string().min(3, 'Street address is required').toLowerCase(),
  city: z.string().min(2, 'City is required').toLowerCase(),
  state: z.string().min(2, 'State is required').toLowerCase(),
  pincode: z
    .string()
    .min(5, 'Pincode must be at least 5 digits')
    .regex(/^\d+$/, 'Pincode must contain only digits'),
  country: z
    .string()
    .min(2, 'Country is required')
    .toUpperCase()
    .optional()
    .default('INDIA'),
});

export const updateAddressSchema = createAddressSchema.partial();

export const getAddressSchema = z.object({
  addressId: z.uuid('Invalid address ID format'),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type GetAddressInput = z.infer<typeof getAddressSchema>;
