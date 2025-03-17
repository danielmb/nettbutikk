import { getServerSession } from '#auth';
import { prisma } from '~/lib/db';
export default defineEventHandler(async (event) => {
  const id = Number(event.context.params!.id);
  if (!id) {
    throw new Error('Invalid ID');
  }
  const session = await getServerSession(event);

  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      favorites: {
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          image: true,
        },
        where: {
          id: {
            equals: id,
          },
        },
      },
    },
  });
  // if get:

  return user?.favorites[0] || null;
});
