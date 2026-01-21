import { z } from 'zod';

export const createBannerSchema = z.object({
  title: z
    .string()
    .min(2, 'Banner title must be at least 2 characters')
    .max(100, 'Banner title must not exceed 100 characters'),
  imageUrl: z.url({ message: 'Invalid image URL' }),
  linkUrl: z.url('Invalid link URL').optional(),  
});

export const updateBannerSchema = createBannerSchema.partial();

export const getBannerSchema = z.object({
  id: z.uuid('Invalid banner ID'),
});

export type CreateBannerInput = z.infer<typeof createBannerSchema>;
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>;
export type GetBannerInput = z.infer<typeof getBannerSchema>;
