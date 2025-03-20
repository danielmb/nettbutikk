import { z } from 'zod';
import { prisma } from '~/lib/db';

const postDataSchema = z.object({
  name: z.string(),
});
export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    postDataSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  await prisma.filters.create({
    data: {
      name: result.data.name,
    },
  });
});
