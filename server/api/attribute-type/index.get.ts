import { prisma } from '~/lib/db';

export default defineEventHandler(async () => {
  const types = await prisma.attributeType.findMany({
    include: { values: true },
    orderBy: { sortOrder: 'asc' },
  });
  return types;
});
