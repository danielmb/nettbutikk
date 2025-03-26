import { prisma } from '~/lib/db';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!;

  const homepage = await prisma.homePage.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      homePageSections: {
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
