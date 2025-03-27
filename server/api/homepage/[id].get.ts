import { prisma } from '~/lib/db';
import { returnNumberIfValid } from '~/lib/utils';

export default defineEventHandler(async (event) => {
  const id = returnNumberIfValid(event.context.params!.id);
  const query = getQuery(event);
  const homepage = await prisma.homePage.findUnique({
    where: {
      id: typeof id === 'number' ? id : undefined,
      name: typeof id === 'string' ? id : undefined,
    },
    include: {
      homePageSections: {
        orderBy: {
          sortOrder: 'asc',
        },
        include: {
          filter: true,
        },
      },
    },
  });

  if (!homepage) {
    throw createError({ status: 404, message: 'Homepage not found' });
  }

  return homepage;
});
