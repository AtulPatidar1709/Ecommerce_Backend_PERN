import { z } from 'zod';

const userIdField = z.uuid({
  message: 'Invalid user ID format',
});

const nameField = z
  .string()
  .min(2, 'First name must be at least 2 characters')
  .max(50, 'First name must not exceed 50 characters')
  .toUpperCase();

const phoneField = z
  .string()
  .min(10, 'Phone must be at least 10 digits')
  .regex(/^\d+$/, 'Phone must contain only digits');

const emailField = z
  .email({
    message: 'Please provide a valid email address',
  })
  .toLowerCase();

const passField = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' });

/// ------ Product Fiels Types ------ ///

const productIdField = z.uuid('Invalid product ID');

const retingField = z
  .number()
  .int('Rating must be an integer')
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating must not exceed 5');

const commentField = z
  .string()
  .max(1000, 'Comment must not exceed 1000 characters')
  .optional();

// ----- Order Types ------ //

const orderIdField = z.uuid('Invalid order ID');

const orderStatusSchema = z
  .enum(['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
  .default('PENDING');

const cartItemValidation = z
  .array(
    z.object({
      productId: z.uuid('Invalid product ID'),
      quantity: z
        .number()
        .int('Quantity must be whole number')
        .min(1, 'Quantity must be at least 1'),
      price: z.number().positive('Price must be greater than 0'),
    }),
  )
  .min(1, 'At least one item is required');

export {
  userIdField,
  nameField,
  phoneField,
  emailField,
  passField,
  productIdField,
  retingField,
  commentField,
  orderIdField,
  orderStatusSchema,
  cartItemValidation,
};
