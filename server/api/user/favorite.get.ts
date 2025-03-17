import { prisma } from '~/lib/db';
import { getServerSession } from '#auth';
export default defineEventHandler(async (event) => {
  const session = await getServerSession(event);

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      favorites: true,
    },
  });

  return user?.favorites || [];
});
