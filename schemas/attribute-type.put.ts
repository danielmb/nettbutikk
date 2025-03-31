import { z } from 'zod';
export const attributeType_ID_Put = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullish(),
  required: z.boolean(),
  values: z
    .array(
      z.object({
        id: z.number().optional(),
        slug: z.string().nullish(),
        value: z.string(),
        displayName: z.string(),
        sortOrder: z.number().optional(),
        attributeTypeId: z.number().optional(),
      }),
    )
    .optional(),
});
