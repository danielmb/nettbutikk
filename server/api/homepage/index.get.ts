import { prisma } from '~/lib/db';

export default defineEventHandler(async (event) => {
  const homepage = await prisma.homePage.findMany({
    include: {
      homePageSections: {
        include: {
          filter: true,
        },
      },
    },
  });

  return homepage;
});
