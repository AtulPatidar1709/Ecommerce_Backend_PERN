import { z } from 'zod';

export const createAddressSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(10, 'Phone must be at least 10 digits')
    .regex(/^\d+$/, 'Phone must contain only digits'),
  street: z.string().min(3, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z
    .string()
    .min(5, 'Pincode must be at least 5 digits')
    .regex(/^\d+$/, 'Pincode must contain only digits'),
  country: z.string().min(2, 'Country is required').optional().default('India'),
});

export const updateAddressSchema = createAddressSchema.partial();

export const getAddressSchema = z.object({
  addressId: z.string().uuid('Invalid address ID format'),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
export type GetAddressInput = z.infer<typeof getAddressSchema>;
