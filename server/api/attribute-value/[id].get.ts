import { prisma } from '~/lib/db';

const returnNumberIfValid = (id: string) => {
  const idNumber = Number(id);
  if (isNaN(idNumber)) {
    return id;
  }
  return idNumber;
};
export default defineEventHandler(async (event) => {
  const id = returnNumberIfValid(event.context.params!.id);

  const attributeValue = await prisma.attributeValue.findUnique({
    where: {
      id: typeof id === 'number' ? id : undefined,
      slug: typeof id === 'string' ? id : undefined,
    },
  });

  return attributeValue;
});
