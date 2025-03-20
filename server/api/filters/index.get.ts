import { prisma } from '~/lib/db';
export default defineEventHandler(async (event) => {
  const filters = await prisma.filters.findMany({
    include: {
      values: {
        include: {
          attributeType: true,
        },
      },
    },
  });

  return filters;
});
