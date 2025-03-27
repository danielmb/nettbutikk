import { prisma } from '~/lib/db';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!;

  const deletedHomePageSection = await prisma.homePageSection.delete({
    where: {
      id: Number(id),
    },
  });

  if (!deletedHomePageSection) {
    throw createError({ status: 404, message: 'Homepage not found' });
  }

  return deletedHomePageSection;
});
