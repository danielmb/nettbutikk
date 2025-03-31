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


const mainFilterReadable: ReadableFilterInput = {
  filters: {
    'main': ['women']
  },
};

const { data: mainFilter } = await useFetch('/api/filter/readable', {
  query: mainFilterReadable,
});
const { products: newArrivals } = await useProducts({
  staticFilters: mainFilter.value ?? {
  },
});

const { data: tShirtsFilter } = await useFetch('/api/filter/readable', {
  query: {
    filters: {
      'category': ['tshirts'],
    },
  },
});

const { products: tShirts } = await useProducts({
  staticFilters: {
    ...mainFilter.value,
    ...tShirtsFilter.value,
  },
});



</script>
<template>
  <div class="w-full flex flex-col space-y-4">
    <!-- SALE BANNER -->
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
        T-Shirts
      </h2>
      <div class="w-full flex flex-wrap justify-center items-center">
        <ProductCarousel :products="tShirts" />
      </div>
    </div>
  </div>
</template>
