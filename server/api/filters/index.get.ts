import { prisma } from '~/lib/db';
export default defineEventHandler(async (event) => {
  const filters = await prisma.filters.findMany({
    include: {
      values: {
        orderBy: {
          attributeType: {
            slug: 'asc',
          },
        },
        include: {
          attributeType: true,
        },
      },
    },
  });

  return filters;
});
