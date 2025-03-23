import { z } from 'zod';
import { prisma } from '~/lib/db';
import { filters_id_patchSchema } from '~/schemas/filters_[id].patch';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!;
  const result = await readValidatedBody(event, (body) =>
    filters_id_patchSchema.safeParse(body),
  );
  if (!result.success) {
    throw result.error.issues;
  }

  const filter = await prisma.filters.update({
    where: {
      id: Number(id),
    },
    data: {
      id: result.data.id,
      name: result.data.name,
      description: result.data.description,
      values: result.data.values
        ? {
            set: result.data.values.map((value) => ({
              id: value.id,
            })),
          }
        : undefined,
    },
  });
  return {
    filter,
  };
});
