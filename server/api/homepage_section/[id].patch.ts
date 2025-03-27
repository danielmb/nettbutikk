import { prisma } from '@/lib/db';
import { homeMenuSectionPatchSchema } from '~/schemas/homemenu';
export default defineEventHandler(async (event) => {
  try {
    const data = await readValidatedBody(event, (body) =>
      homeMenuSectionPatchSchema.parse(body),
    );
    const { id } = event.context.params!;
    const sectionId = parseInt(id);

    const res = await prisma.$transaction(async (tx) => {
      const updatedItem = await tx.homePageSection.update({
        where: {
          id: sectionId,
        },
        data: {
          name: data.name,
          homePageId: data.homePageId,
          description: data.description,
          filterId: data.filterId,
          variant: data.variant,
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
