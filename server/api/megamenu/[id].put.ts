import type { Prisma } from '@prisma/client';
import { prisma } from '~/lib/db';
import { megaMenuSchema } from '~/schemas/megamenu_[id]';

export default defineEventHandler(async (event) => {
  const result = await readValidatedBody(event, (body) =>
    megaMenuSchema.safeParse(body),
  );

  if (!result.success) throw result.error.issues;

  const { id } = event.context.params!;
  const data = result.data;
  const menuId = parseInt(id);

  const res = await prisma.$transaction(
    async (tx) => {
      // 1. Update the main navigation menu
      const updatedMenu = await tx.navigationMenu.update({
        where: { id: menuId },
        data: {
          name: data.name,
          description: data.description,
          isActive: data.isActive,
        },
      });
      console.log('updatedMenu:', updatedMenu);
      // 2. Get all existing categories, columns, sections, and items for cleanup later
      const existingCategories = await tx.navigationCategory.findMany({
        where: { navigationMenuId: menuId },
        include: {
          columns: {
            include: {
              sections: {
                include: {
                  items: true,
                },
              },
            },
          },
        },
      });

      // Track IDs of entities that will remain after update
      const remainingCategoryIds = new Set<number>();
      const remainingColumnIds = new Set<number>();
      const remainingSectionIds = new Set<number>();
      const remainingItemIds = new Set<number>();

      for (const category of data.categories) {
        let categoryId: number;

        if (category.id) {
          // Update existing category
          remainingCategoryIds.add(category.id);

          const updatedCategory = await tx.navigationCategory.update({
            where: { id: category.id },
            data: {
              label: category.label,
              root: category.root,
              sortOrder: category.sortOrder,
            },
          });

          categoryId = updatedCategory.id;
        } else {
          const newCategory = await tx.navigationCategory.create({
            data: {
              label: category.label,
              root: category.root,
              sortOrder: category.sortOrder,
              navigationMenuId: menuId,
            },
          });

          categoryId = newCategory.id;

          remainingCategoryIds.add(categoryId);
        }

        // Process columns for this category
        for (const column of category.columns) {
          let columnId: number;

          if (column.id) {
            // Update existing column
            remainingColumnIds.add(column.id);

            const updatedColumn = await tx.navigationColumn.update({
              where: { id: column.id },
              data: {
                sortOrder: column.sortOrder,
              },
            });

            columnId = updatedColumn.id;
          } else {
            // Create new column
            const newColumn = await tx.navigationColumn.create({
              data: {
                sortOrder: column.sortOrder,
                navigationCategoryId: categoryId,
              },
            });

            columnId = newColumn.id;

            remainingColumnIds.add(columnId);
          }

          // Process sections for this column
          for (const section of column.sections) {
            let sectionId: number;

            if (section.id) {
              // Update existing section
              remainingSectionIds.add(section.id);

              const updatedSection = await tx.navigationSection.update({
                where: { id: section.id },
                data: {
                  label: section.label,
                  variant: section.variant,
                  sortOrder: section.sortOrder,
                },
              });

              sectionId = updatedSection.id;
            } else {
              // Create new section
              const newSection = await tx.navigationSection.create({
                data: {
                  label: section.label,
                  variant: section.variant,
                  sortOrder: section.sortOrder,
                  navigationColumnId: columnId,
                },
              });

              sectionId = newSection.id;

              remainingSectionIds.add(sectionId);
            }

            // Process items for this section
            for (const item of section.items) {
              if (item.id) {
                // Update existing item
                remainingItemIds.add(item.id);

                await tx.navigationItem.update({
                  where: { id: item.id },
                  data: {
                    label: item.label,
                    route: item.route,
                    type: item.type,
                    image: item.image,
                    first: item.first,
                    sortOrder: item.sortOrder,
                    filterId: item.filterId,
                    categoryValueId: item.categoryValueId,
                  },
                });
              } else {
                // Create new item
                const createdItem = await tx.navigationItem.create({
                  data: {
                    label: item.label,
                    route: item.route,
                    type: item.type,
                    image: item.image,
                    first: item.first,
                    sortOrder: item.sortOrder,
                    filterId: item.filterId,
                    categoryValueId: item.categoryValueId,
                    navigationSectionId: sectionId,
                  },
                });

                remainingItemIds.add(createdItem.id);
              }
            }
          }
        }
      }

      // 4. Clean up removed entities (from bottom up to respect foreign key constraints)

      // Delete items that are no longer present
      await tx.navigationItem.deleteMany({
        where: {
          section: {
            column: {
              category: {
                navigationMenuId: menuId,
              },
            },
          },
          id: {
            notIn: Array.from(remainingItemIds),
          },
        },
      });

      // Delete sections that are no longer present
      await tx.navigationSection.deleteMany({
        where: {
          column: {
            category: {
              navigationMenuId: menuId,
            },
          },
          id: {
            notIn: Array.from(remainingSectionIds),
          },
        },
      });

      // Delete columns that are no longer present
      await tx.navigationColumn.deleteMany({
        where: {
          category: {
            navigationMenuId: menuId,
          },
          id: {
            notIn: Array.from(remainingColumnIds),
          },
        },
      });

      // Delete categories that are no longer present
      await tx.navigationCategory.deleteMany({
        where: {
          navigationMenuId: menuId,
          id: {
            notIn: Array.from(remainingCategoryIds),
          },
        },
      });

      return updatedMenu;
    },
    {
      maxWait: 25000,
      timeout: 60000,
    },
  );
  return res;
  1;
});
