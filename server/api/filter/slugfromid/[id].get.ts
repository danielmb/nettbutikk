import { prisma } from '~/lib/db';
export default defineEventHandler(async (event) => {
  const { id } = event.context.params!;
  const attributeType = await prisma.attributeType.findFirst({
    where: {
      values: {
        some: {
          id: Number(id),
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
  console.log(attributeType);

  if (!attributeType) {
    throw createError({
      status: 404,
      message: 'Not found',
    });
  }
  return attributeType;
});
