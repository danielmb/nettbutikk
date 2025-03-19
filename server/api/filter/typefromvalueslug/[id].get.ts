import { prisma } from '~/lib/db';
export default defineEventHandler(async (event) => {
  const { id } = event.context.params!;
  const attributeType = await prisma.attributeType.findFirst({
    where: {
      values: {
        some: {
          slug: id,
        },
      },
    },
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

  if (!attributeType) {
    throw createError({
      status: 404,
      message: 'Not found',
    });
  }
  return attributeType;
});
