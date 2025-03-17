import { prisma } from '~/lib/db';

export default defineEventHandler(async () => {
  const attributeTypes = await prisma.attributeType.findMany({
    where: { filterable: true },
    orderBy: { sortOrder: 'asc' },
    include: {
      values: {
        orderBy: { value: 'asc' },
        include: {
          _count: {
            select: { items: true },
          },
        },
      },
    },
  });

  return attributeTypes;
});
