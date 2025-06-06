import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
export const filterFromFilterId = async (id: number) => {
  const filterData = await prisma.filters.findUnique({
    where: { id: id },
    include: {
      values: {
        include: {
          attributeType: true,
        },
      },
    },
  });

  let mappedFilters: Record<string, number[]> = {};
  for (const filter of filterData?.values ?? []) {
    if (!mappedFilters[filter.attributeType.slug]) {
      mappedFilters[filter.attributeType.slug] = [];
    }
    mappedFilters[filter.attributeType.slug].push(filter.id);
  }
  return mappedFilters;
};
