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
    'main': ['men']
  },
};
const { data: defaultFilter } = await useFetch('/api/filter/readable', {
  query: readableFilter,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});



</script>
<template>
  <UserMegaMenu subCategory="subCategory" :items="items" />
  <Clothes mainCategory="men" :default-filters="defaultFilter ?? undefined" />
</template>
