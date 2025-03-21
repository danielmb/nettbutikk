import { z } from 'zod';
import { prisma } from '~/lib/db';

const postDataSchema = z.object({
  name: z.string(),
});
export default defineEventHandler(async (event) => {
  const { id } = event.context.params!;

  const filter = await prisma.filters.delete({
    where: {
      id: Number(id),
    },
  });

  return {
    filter,
  };
});
