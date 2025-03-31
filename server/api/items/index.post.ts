import { itemsPostSchema } from '@/schemas/items-post-schema';
import { prisma } from '~/lib/db';
export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    itemsPostSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  const createdItem = await prisma.item.create({
    include: {
      brand: true,
      category: true,
    },
    data: {
      name: result.data.name,
      description: result.data.description,
      price: result.data.price,
      image: result.data.image,
      brandId: result.data.brandId,
      categoryId: result.data.categoryId,

      variants: {
        connect: result.data.variants?.map((id) => ({ id })),
      },
    },
  });
  return createdItem;
});
