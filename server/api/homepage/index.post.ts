import { prisma } from '@/lib/db';
import { homemenuPostSchema } from '~/schemas/homemenu_post';
export default defineEventHandler(async (event) => {
  try {
    const data = await readValidatedBody(event, (body) =>
      homemenuPostSchema.parse(body),
    );

    const res = await prisma.$transaction(async (tx) => {
      const updatedItem = await tx.homePage.create({
        data: {
          name: data.name,
        },
      });
      return updatedItem;
    });
    return res;
  } catch (error) {
    if (error instanceof Error) {
      throw createError({
        ...error,
      });
    }
    throw createError({
      status: 500,
      ...new Error('An unknown error occurred'),
    });
  }
});
