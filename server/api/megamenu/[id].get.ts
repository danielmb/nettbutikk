import { prisma } from '~/lib/db';

export default defineEventHandler(async (event) => {
  try {
    // Fetch the active navigation menu with all its related data
    const navigationMenu = await prisma.navigationMenu.findFirst({
      where: {
        isActive: true,
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

    return navigationMenu;
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
