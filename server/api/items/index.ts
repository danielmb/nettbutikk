import { prisma } from '~/lib/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const filters = query.filters ? JSON.parse(String(query.filters)) : {};
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const search = query.search ? String(query.search) : undefined;

  // Build where clause based on filters
  const where: any = {};

  if (Object.keys(filters).length > 0) {
    console.log(filters);

    for (const [typeSlug, valueIds] of Object.entries(filters)) {
      where.AND = where.AND || [];
      where.AND.push({
        attributes: {
          some: {
            attributeValue: {
              attributeType: {
                slug: typeSlug,
              },
              id: { in: valueIds },
            },
          },
        },
      });
    }
  }

  if (search) {
    where.OR = [
      {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      },
      {
        description: {
          contains: search,
          mode: 'insensitive',
        },
      },
    ];
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
