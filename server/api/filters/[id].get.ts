import { prisma } from '~/lib/db';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!;

  const filter = await prisma.filters.findUnique({
    where: {
      id: Number(id),
    },

    include: {
      values: {
        include: {
          attributeType: true,
        },
      },
    },
  });
  return {
    filter,
  };
});
