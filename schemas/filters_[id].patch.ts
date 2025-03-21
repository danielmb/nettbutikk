import { z } from 'zod';

// Define schema for filter value objects
export const filterValueSchema = z.object({
  id: z.number().optional(),
  value: z.string().optional(),
  attributeTypeId: z.number().optional(),
});

// Define the main filters patch schema
export const filters_id_patchSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  description: z.string().optional(),
  values: z.array(filterValueSchema).optional(),
});
