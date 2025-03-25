import { prisma } from '@/lib/db';
import { megaMenuSectionSchema } from '~/schemas/megamenuSection_[id]_patch';

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    megaMenuSectionSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  const { id } = event.context.params!;
  const data = result.data;
  const sectionId = parseInt(id);

  const res = await prisma.$transaction(async (tx) => {
    const updatedSection = await tx.navigationSection.update({
      where: { id: sectionId },
      data: {
        label: data.label,
        variant: data.variant,
        sortOrder: data.sortOrder,
      },
    });
    console.log('updatedSection:', updatedSection);
  });
});
