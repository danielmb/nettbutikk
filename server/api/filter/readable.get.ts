import { z } from 'zod';
import { prisma } from '~/lib/db';

export const readableFilterSchema = z.object({
  filters: z.record(z.array(z.string())),
});
export type ReadableFilterInput = z.infer<typeof readableFilterSchema>;
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  // should be in format:
  // filters: {
  //   "color": ["red", "blue"],
  //   "size": ["small", "medium"]
  // }
  // then return in the format:
  // {
  //   "color": [
  //     {
  //       "id": 0,
  //       "value": "red",
  //       "count": 1
  //     },
  //     {
  //       "id": 1,
  //       "value": "blue",
  //       "count": 1
  //     }
  //   ],
  //   "size": [
  //     {
  //       etc..
  //     }
  //   ]
  // }
  const filters = query.filters ? JSON.parse(String(query.filters)) : {};
  const attributeTypes = await prisma.attributeType.findMany({
    where: {
      slug: { in: Object.keys(filters) },
    },
    orderBy: { sortOrder: 'asc' },
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

  let mappedFilters: Record<string, number[]> = {};
  // attributeTypes.forEach((type) => {
  //   if (!mappedFilters[type.slug]) {
  //     mappedFilters[type.slug] = [];
  //   }
  // });
  for (const filter in filters) {
    // console.log(filter);
    if (!mappedFilters[filter]) {
      mappedFilters[filter] = [];
    }

    const attributeType = attributeTypes.find((type) => type.slug === filter);
    if (attributeType) {
      for (const value of filters[filter]) {
        const attributeValue = attributeType.values.find(
          (v) => v.value === value,
        );
        if (attributeValue) {
          mappedFilters[filter].push(attributeValue.id);
        }
      }
    }
  }
  return mappedFilters;
});
