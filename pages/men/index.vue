<script lang="ts" setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import type { UseProductsOptions } from '~/composables/useProducts';
import type { ReadableFilterInput } from '~/server/api/filter/readable.get';
import { urlFriendly } from '~/lib/utils';
const items = ref([
  { label: 'New Arrivals' },
  { label: 'Clothing' },
  { label: 'Shoes' },
  { label: 'Accessories' },
]);


const mainFilterReadable: ReadableFilterInput = {
  filters: {
    'main': ['men']
  },
};

const { data: mainFilter } = await useFetch('/api/filter/readable', {
  query: mainFilterReadable,
});
const { products: newArrivals } = await useProducts({
  staticFilters: mainFilter.value ?? {
  },
});
// newArrivals.value[0].category.slug



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
    <!-- <div class="w-full flex flex-col align-middle items-center">
      <h2 class="text-2xl font-bold text-center">
        New Arrivals
      </h2>
      <div class="w-full flex flex-wrap justify-center items-center">
        <ProductGrid :products="newArrivals.slice(0, 6)" />
      </div>
      <a href="/category/men/" class="text-lg font-bold ">
        <Button variant="link">View all new arrivals</Button>
      </a>
    </div>
    <div class="w-full flex flex-col align-middle items-center"> -->

    <!-- <div class="w-full flex flex-wrap justify-center items-center">
        <ProductCarousel :products="tShirts" />
      </div>
      <a :href="`/category/${tShirtsFilter?.category[0]}`" class="text-lg font-bold ">
        <Button variant="link">View all t-shirts</Button>
      </a> -->

    <!-- </div> -->

    <!-- <div class="flex flex-col">
      <div v-for="section in homePage?.homePageSections ?? []">
      </div>
      
    </div> -->
    <Homepage home-page-id="men" />
  </div>
</template>
