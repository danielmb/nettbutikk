import { prisma } from '~/lib/db';
import { urlFriendly } from '~/lib/utils';

export default defineEventHandler(async (event) => {
  const { id: paramsId } = event.context.params!;
  const id = Number(paramsId) ? Number(paramsId) : paramsId;
  console.log('id:', id);
  try {
    const navigationMenu = await prisma.navigationMenu.findUnique({
      where: {
        isActive: true,
        id: typeof id === 'number' ? id : undefined,
        name: typeof id === 'string' ? id : undefined,
      },
      include: {
        categories: {
          orderBy: {
            sortOrder: 'asc',
          },
          include: {
            columns: {
              orderBy: {
                sortOrder: 'asc',
              },
              include: {
                sections: {
                  orderBy: {
                    sortOrder: 'asc',
                  },
                  include: {
                    items: {
                      orderBy: {
                        sortOrder: 'asc',
                      },
                      include: {
                        relatedFilter: true,
                        relatedCategory: {
                          include: {
                            attributeType: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!navigationMenu) {
      return {
        categories: [],
      };
    }

    return {
      ...navigationMenu,
      categories: navigationMenu.categories.map((category) => ({
        ...category,
        columns: category.columns.map((column) => ({
          ...column,
          sections: column.sections.map((section) => ({
            ...section,
            items: section.items.map((item) => {
              const { relatedFilter, relatedCategory, ...rest } = item;
              if (relatedFilter) {
                return {
                  ...rest,
                  route: `/${navigationMenu.name}/cftr/${urlFriendly(
                    relatedFilter.name,
                  )}/cat?filterId=${relatedFilter.id}`,
                };
              }
              return rest;
            }),
          })),
        })),
      })),
    };
  } catch (error) {
    console.error('Error fetching navigation menu:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch navigation menu',
    });
  } finally {
    await prisma.$disconnect();
  }
});
