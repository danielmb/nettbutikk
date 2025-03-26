import { z } from 'zod';

export const megaMenuItemSchema = z.object({
  navigationSectionId: z.number(),
  label: z.string().min(1, 'Section label is required'),
  sortOrder: z.number().default(0),
  route: z.string().nullish(),
  image: z.string().nullish(),
  first: z.boolean().optional(),
  type: z.string().nullish(),
  filterId: z.number().nullish(),
});
