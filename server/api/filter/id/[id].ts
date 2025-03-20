import { prisma } from '~/lib/db';
export default defineEventHandler(async (event) => {
  const filterData = await prisma.filters.findUnique({
    where: { id: Number(event.context.params!.id) },
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
});
