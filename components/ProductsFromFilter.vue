<script lang="ts" setup>
import ProductGrid from './ProductGrid.vue';
import ProductCarousel from './ProductCarousel.vue';

const props = defineProps<{
  filterId: number;
  variant: 'grid' | 'carousel';
}>();

const { data: filter } = await useFetch(`/api/filters/${props.filterId}`);
const { products, filters, loading, setFilter, removeFilter, activeFilters } =
  await useProducts();

// Define slot props type
const slotProps = {
  filter: filter,
  filters: filters,
  products: products,
  setFilter: setFilter,
  removeFilter: removeFilter,
  activeFilters: activeFilters
};

// Expose slot props type
defineSlots<{
  before?: (props: typeof slotProps) => any;
  after?: (props: typeof slotProps) => any;
}>();
</script>

<template>
  <slot name="before" v-bind="slotProps" />

  <ProductGrid :products="products" v-if="variant === 'grid'" />
  <ProductCarousel :products="products" v-else-if="variant === 'carousel'" />

  <slot name="after" v-bind="slotProps" />
</template>