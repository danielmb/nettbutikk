import { prisma } from '@/lib/db';
import { megaMenuItemSchema } from '~/schemas/megamenuItem_[id]_post';

export default defineEventHandler(async (event) => {
  try {
    const data = await readValidatedBody(event, (body) =>
      megaMenuItemSchema.parse(body),
    );

    const { id } = event.context.params!;

    const res = await prisma.$transaction(async (tx) => {
      const updatedItem = await tx.navigationItem.create({
        data: {
          label: data.label,
          sortOrder: data.sortOrder,
          route: data.route,
          image: data.image,
          first: data.first,
          type: data.type,
          navigationSectionId: data.navigationSectionId,
          filterId: data.filterId,
        },
      });
      console.log('updatedItem:', updatedItem);
    });
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
