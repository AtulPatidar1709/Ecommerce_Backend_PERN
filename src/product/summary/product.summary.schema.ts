import { z } from 'zod';

export const productSummaryQuerySchema = z.object({
  promotion: z.enum(['FEATURED', 'DEAL_OF_THE_DAY', 'FLASH_SALE']).optional(),

  category: z.string().optional(),

  limit: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0 && val <= 20, {
      message: 'Limit must be between 1 and 20',
    })
    .optional(),
});

export type ProductSummaryQuery = z.infer<typeof productSummaryQuerySchema>;
