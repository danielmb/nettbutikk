import { prisma } from '~/lib/db';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  console.log(event.context.params);
  const item = await prisma.item.findUnique({
    where: { id: Number(id) },
    include: {
      images: true,
    },
  });
  if (!item) {
    throw createError({ status: 404, message: 'Item not found' });
  }
  return item;
});
