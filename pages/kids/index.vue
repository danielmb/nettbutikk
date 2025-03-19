<script lang="ts" setup>
import { ref } from 'vue';
import type { UseProductsOptions } from '~/composables/useProducts';
import type { ReadableFilterInput } from '~/server/api/filter/readable.get';
const items = ref([
  { label: 'New Arrivals' },
  { label: 'Clothing' },
  { label: 'Shoes' },
  { label: 'Accessories' },
]);


const readableFilter: ReadableFilterInput = {
  filters: {
    'main': ['kids']
  },
};
const { data: defaultFilter } = await useFetch('/api/filter/readable', {
  query: readableFilter,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});


const { products: newArrivals } = await useProducts({
  staticFilters: defaultFilter.value ?? {},
  noUrl: true,
});



</script>
<template>
  <NuxtLayout name="category">
    <div class="w-full flex flex-col">
      <div class="w-full flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-800 py-2">
        <div class="text-center text-lg font-bold">
          <span>Free shipping on all orders over $100</span>
        </div>
        <div class="text-center text-lg font-bold">
          <span>
            Use code: <span class="text-red-500">FREESHIP</span>
          </span>
        </div>
      </div>
      <div class="w-full flex flex-col align-middle items-center">
        <h2 class="text-2xl font-bold text-center">
          New Arrivals
        </h2>
        <div class="w-full flex flex-wrap justify-center items-center">
          <ProductCarousel :products="newArrivals" />
        </div>
      </div>
      <div class="w-full flex flex-col align-middle items-center">
        <h2 class="text-2xl font-bold text-center">
          New Arrivals
        </h2>
        <div class="w-full flex flex-wrap justify-center items-center">
          <ProductCarousel :products="newArrivals" />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>
