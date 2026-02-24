import { z } from 'zod';
import { nameField, phoneField } from '../types/common/fields.schema.js';

export const createAddressSchema = z.object({
  name: nameField.transform((val) => val.toUpperCase()),
  phone: phoneField,
  street: z
    .string()
    .min(3, 'Street address is required')
    .transform((val) => val.toUpperCase()),
  city: z
    .string()
    .min(2, 'City is required')
    .transform((val) => val.toUpperCase()),
  state: z
    .string()
    .min(2, 'State is required')
    .transform((val) => val.toUpperCase()),
  pincode: z
    .string()
    .min(5, 'Pincode must be at least 5 digits')
    .regex(/^\d+$/, 'Pincode must contain only digits'),
  country: z
    .string()
    .min(2, 'Country is required')
    .optional()
    .default('INDIA')
    .transform((val) => val.toUpperCase()),
});

export const updateAddressSchema = createAddressSchema.partial();

export const getAddressSchema = z.object({
  addressId: z.uuid('Invalid address ID format'),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type GetAddressInput = z.infer<typeof getAddressSchema>;
