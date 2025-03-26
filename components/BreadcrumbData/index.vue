<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
const route = useRoute();

const crumbs = ref<{
  label: string; route: string,
  filterId?: number;
}[]>([
  { label: 'Home', route: '/' },
]);



const { category } = useCategory();



if (route.params.itemId || route.params.productId) {
  const itemId = Number(route.params.itemId ?? route.params.productId);
  await $fetch(`/api/items/${itemId}`).then(({ name, id, category, attributes }) => {
    console.log('category', category);
    const gender = attributes.find(attr => attr.attributeValue.attributeType.slug === 'main')?.attributeValue
    gender && crumbs.value.push({ label: String(gender.displayName), route: `/${gender.slug ?? gender.id}` });
    category && crumbs.value.push({ label: String(category.displayName), route: `/${category.slug ?? category.id}` });
    crumbs.value.push({ label: name ?? '', route: `/item/${id}` });
  });
} else {
  if (category.value) {
    crumbs.value.push({ label: String(category.value), route: `/${category.value}` });
  }
}
if (route.query.filterId) {
  await $fetch(`/api/filters/${route.query.filterId}`).then(({ filter }) => {
    crumbs.value.push({ label: filter?.name ?? '', route: `/${category.value}?filterId=${filter?.id ?? 0}` });
  });
}


const data = computed(() => {
  return {
    crumbs: crumbs.value.slice(0, -1),
    currentPage: crumbs.value.at(-1),
  }
});


</script>

<template>

  <Breadcrumb>
    <BreadcrumbList>
      <template v-for="crumb in data.crumbs" :key="crumb.label">
        <BreadcrumbItem>
          <BreadcrumbLink :href="crumb.route" class="capitalize">
            {{ crumb.label }}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="data.crumbs.length > 0" />
      </template>
      <BreadcrumbItem v-if="data.currentPage">
        <BreadcrumbPage class="capitalize">{{ data.currentPage?.label }}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
