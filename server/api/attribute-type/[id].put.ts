import { prisma } from '~/lib/db';
import { attributeType_ID_Put } from '../../../schemas/attribute-type.put';
export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    attributeType_ID_Put.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  const { id } = event.context.params!;

  const data = result.data;

  await prisma.attributeType.update({
    where: { id: Number(id) },
    data: {
      name: data.name,
      description: data.description,
      required: data.required,
      values: {
        upsert:
          data.values?.map((value) => ({
            where: { id: value.id },
            create: {
              slug: value.slug,
              value: value.value,
              displayName: value.displayName,
              sortOrder: value.sortOrder,
            },
            update: {
              slug: value.slug,
              value: value.value,
              displayName: value.displayName,
              sortOrder: value.sortOrder,
            },
          })) ?? [],
      },
    },
  });
});
