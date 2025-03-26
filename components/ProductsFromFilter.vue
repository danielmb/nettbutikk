<script lang="ts" setup>
import ProductGrid from './ProductGrid.vue';


const props = defineProps<{
  filterId: number;
  variant: 'grid' | 'carousel';
}>();

const filter = await useFetch(`/api/filters/${props.filterId}`);
const { products, filters, loading, setFilter, removeFilter, activeFilters } =
  await useProducts();
</script>

<template>
  <slot name="before" :filter="filter" :filters="filters" :setFilter="setFilter" :removeFilter="removeFilter"
    :activeFilters="activeFilters">

  </slot>
  <ProductGrid :products="products" v-if="variant === 'grid'" />
  <ProductCarousel :products="products" v-else-if="variant === 'carousel'" />

  <slot name="after" :filter="filter" :filters="filters" :setFilter="setFilter" :removeFilter="removeFilter"
    :activeFilters="activeFilters">
  </slot>

</template>
