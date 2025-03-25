<script setup lang="ts">
const { categoryUrl, category } = useCategory();
// const { data: megaMenu } = await useFetch(`/api/megamenu/${category.value}`);

// @ts-ignore
const { data: megaMenu } = useQuery({ queryKey: ['megamenu', category.value], queryFn: () => $fetch(`/api/megamenu/${category.value}`) });


const items = computed(() => {
  if (!megaMenu.value) return [];

  return megaMenu.value.categories.map(category => {
    return {
      label: category.label,
      root: category.root,
      items: category.columns.map(column => {
        return column.sections.map(section => {
          return {
            label: section.label,
            variant: section.variant || undefined,
            items: section.items.map(item => {
              return {
                label: item.label,
                type: item.type || undefined,
                image: item.image || undefined,
                route: item.route || undefined,
                first: item.first || false
              };
            })
          };
        });
      })
    };
  });
});
</script>

<template>
  <div v-if="items">
    <NavMegaMenu :items="items" />
  </div>
</template>