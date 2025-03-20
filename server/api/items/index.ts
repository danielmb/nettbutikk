import { filterFromFilterId, prisma } from '~/lib/db';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';

const filtersSchema = z.record(z.string(), z.array(z.number()));

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  // const filters = query.filters ? JSON.parse(String(query.filters)) : {};
  const filtersParser = filtersSchema.safeParse(
    JSON.parse(String(query.filters)),
  );
  if (!filtersParser.success) {
    console.error(filtersParser.error);
    throw createError({
      status: 400,
      message: 'Invalid filters',
    });
  }
  const filters = filtersParser.data;
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 20;
  const search = query.search ? String(query.search) : undefined;
  const filterId = query.defaultFilterId
    ? Number(query.defaultFilterId)
    : undefined;

  if (filterId) {
    const defaultFilters = await filterFromFilterId(filterId);
    for (const [typeSlug, valueIds] of Object.entries(defaultFilters)) {
      if (!filters[typeSlug]) {
        filters[typeSlug] = valueIds;
        continue;
      }

      filters[typeSlug] = Array.from(
        new Set([...filters[typeSlug], ...valueIds]),
      );
    }
  }

  // Build where clause based on filters
  const where: Prisma.ItemWhereInput = {};

  if (Object.keys(filters).length > 0) {
    // filters looks like:
    for (const [typeSlug, valueIds] of Object.entries(filters)) {
      where.AND = where.AND || [];
      Array.isArray(where.AND) &&
        where.AND?.push({
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
      images: {
        take: 1,
      },
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
