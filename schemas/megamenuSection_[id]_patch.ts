import { z } from 'zod';
export const megaMenuSectionSchema = z.object({
  id: z.number(),
  label: z.string().min(1, 'Section label is required').optional(),
  variant: z.string().nullish(),
  sortOrder: z.number().default(0),
});
