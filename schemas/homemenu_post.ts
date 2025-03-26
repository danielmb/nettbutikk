import z from 'zod';

export const homemenuPostSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const homeMenuSectionPostSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required').optional(),
  homePageId: z.number(),
});

export type HomeMenuSectionPost = z.infer<typeof homeMenuSectionPostSchema>;
