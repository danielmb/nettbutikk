import { prisma } from '~/lib/db';

export default defineEventHandler(async (event) => {
  const { id } = event.context.params!;

  const homepage = await prisma.homePage.delete({
    where: {
      id: Number(id),
    },
  });

  if (!homepage) {
    throw createError({ status: 404, message: 'Homepage not found' });
  }

  return homepage;
});
