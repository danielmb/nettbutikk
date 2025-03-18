import { prisma } from '~/lib/db';
export default defineEventHandler(async (event) => {
  const { type } = event.context.params!;
  const attributeType = await prisma.attributeType.findUnique({
    where: { slug: type },
    include: {
      values: {
        orderBy: { sortOrder: 'asc' },
        include: {
          _count: {
            select: { items: true },
          },
        },
      },
    },
  });

  return attributeType;
});
