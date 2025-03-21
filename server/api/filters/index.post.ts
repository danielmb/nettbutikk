import { z } from 'zod';
import { prisma } from '~/lib/db';

const postDataSchema = z.object({
  name: z.string(),
});
export default defineEventHandler(async (event) => {
  // will have to protect this route with a middleware
  // to ensure that only authenticated users can access it
  // and that they have the necessary permissions

  // TODO: #1 validate that the user has the necessary permissions

  const result = await readValidatedBody(event, (body) =>
    postDataSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  const filter = await prisma.filters.create({
    data: {
      name: result.data.name,
    },
  });

  return {
    filter,
  };
});
