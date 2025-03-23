import { z } from 'zod';

// Define schema for filter value objects
export const filterValueSchema = z.object({
  id: z.number(),
  value: z.string().optional(),
  attributeType: z.string().optional(),
});
export type FilterValue = z.infer<typeof filterValueSchema>;

// Define the main filters patch schema
export const filters_id_patchSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  values: z.array(filterValueSchema).optional(),
});

export type FiltersIdPatch = z.infer<typeof filters_id_patchSchema>;
