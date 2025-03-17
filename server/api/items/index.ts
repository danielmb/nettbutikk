import { prisma } from '~/lib/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filters = query.filters ? JSON.parse(String(query.filters)) : {};
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;

  // Build where clause based on filters
  const where: any = {};

  // Process attribute filters
  if (Object.keys(filters).length > 0) {
    where.attributes = {
      some: {
        attributeValue: {
          attributeType: {
            slug: { in: Object.keys(filters) },
          },
          id: { in: [] },
        },
      },
    };

    // For each filter type, fetch matching attribute value IDs
    for (const [typeSlug, valueIds] of Object.entries(filters)) {
      if (Array.isArray(valueIds) && valueIds.length > 0) {
        where.attributes.some.attributeValue.id.in.push(...valueIds);
      }
    }
  }

  // Get products
  const products = await prisma.item.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      attributes: {
        include: {
          attributeValue: {
            include: {
              attributeType: true,
            },
          },
        },
      },
    },
  });

  // Get total count for pagination
  const total = await prisma.item.count({ where });

  return {
    products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
});
