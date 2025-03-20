import { filterFromFilterId, prisma } from '~/lib/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filterId = query.filterId ? Number(query.filterId) : undefined;
  console.log(filterId, event.context.params);
  const filter = filterId ? await filterFromFilterId(filterId) : undefined;
  console.log(Object.keys(filter ?? {}));
  const attributeTypes = await prisma.attributeType.findMany({
    where: {
      filterable: true,
      // { ...(filterId && { NOT: { filters: { some: { id: filterId } } } }) },
      NOT: filterId
        ? {
            values: {
              some: {
                Filters: {
                  some: {
                    id: filterId,
                  },
                },
              },
            },
          }
        : undefined,
      // NOT: {
      //   values: {
      //     some: {
      //       Filters: {
      //         some: {
      //           id: filterId,
      //         },
      //       },
      //     },
      //   },
      // },
      // slug: { notIn: filter ? Object.keys(filter) : [] },
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

  return attributeTypes;
});
