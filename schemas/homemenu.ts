import { filterFns } from '@tanstack/vue-table';
import z from 'zod';

export const homemenuPostSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

export const homeMenuSectionPostSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required').optional(),
  homePageId: z.number(),
  filterId: z.number().optional(),
});

export type HomeMenuSectionPost = z.infer<typeof homeMenuSectionPostSchema>;

export const homeMenuSectionPatchSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  description: z.string().min(1, 'Description is required').nullish(),
  homePageId: z.number().nullish(),
  variant: z.enum(['grid', 'carousel']).nullish(),
  filterId: z.number().nullish(),
});
