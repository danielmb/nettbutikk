import { prisma } from '~/lib/db';
import { returnNumberIfValid } from '~/lib/utils';

export default defineEventHandler(async (event) => {
  const id = returnNumberIfValid(event.context.params!.id);
  const types = await prisma.attributeType.findUnique({
    where: {
      id: typeof id === 'number' ? id : undefined,
      slug: typeof id === 'string' ? id : undefined,
    },
    include: { values: true },
  });
  return types;
});
