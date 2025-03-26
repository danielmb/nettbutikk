import { prisma } from '@/lib/db';
import { homeMenuSectionPostSchema } from '~/schemas/homemenu_post';
export default defineEventHandler(async (event) => {
  try {
    const data = await readValidatedBody(event, (body) =>
      homeMenuSectionPostSchema.parse(body),
    );

    const res = await prisma.$transaction(async (tx) => {
      const updatedItem = await tx.homePageSection.create({
        data: {
          name: data.name,
          homePageId: data.homePageId,
          description: data.description,
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
