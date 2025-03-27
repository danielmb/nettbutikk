<script lang="ts" setup>
import ProductGrid from './ProductGrid.vue';
import ProductCarousel from './ProductCarousel.vue';

const props = defineProps<{
  filterId: number;
  variant: 'grid' | 'carousel';
  max?: number;
  initalPagination?: UseProductsOptions['initialPagination'];
}>();

const { data: filter } = await useFetch(`/api/filters/${props.filterId}`);
const { products, filters, loading, setFilter, removeFilter, activeFilters } =
  useProducts({
    filterId: props.filterId,
    initialPagination: props.initalPagination,
  });

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

  <ProductGrid :products="products.slice(0, props.max)" v-if="variant === 'grid'" :max="props.max" />
  <ProductCarousel :products="products
    .slice(0, props.max)" v-else-if="variant === 'carousel'" />

  <slot name="after" v-bind="slotProps" />
</template>