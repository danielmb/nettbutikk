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
  productId?: number;
}[]>([]);

const { category } = useCategory();
if (category.value) {
  crumbs.value.push({ label: String(category.value), route: `/${category.value}` });
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
  <!-- Example -->
  <!-- <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem>
        <BreadcrumbLink href="/">
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbLink href="/components">
          Components
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb> -->
  <Breadcrumb>
    <BreadcrumbList>
      <BreadcrumbItem v-for="crumb in data.crumbs" :key="crumb.label">
        <BreadcrumbLink :href="crumb.route">
          {{ crumb.label }}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <BreadcrumbPage>{{ data.currentPage?.label }}</BreadcrumbPage>
      </BreadcrumbItem>
    </BreadcrumbList>
  </Breadcrumb>
</template>
