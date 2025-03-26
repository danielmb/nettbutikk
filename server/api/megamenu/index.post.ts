import type { Prisma } from '@prisma/client';
import { prisma } from '~/lib/db';
import { megaMenuNewSchema } from '~/schemas/megamenu_[id]';

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    megaMenuNewSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  const { id } = event.context.params!;
  const data = result.data;

  const res = await prisma.$transaction(
    async (tx) => {
      await tx.navigationMenu.create({
        data: {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
        },
      });
    },
    {
      maxWait: 25000,
      timeout: 60000,
    },
  );
  return res;
});
