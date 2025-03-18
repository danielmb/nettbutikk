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



const route = useRoute();
// const readableFilter: ReadableFilterInput = {
//   filters: {
//     'main': [Array.isArray(route.params.id) ? route.params.id[0] : route.params.id]
//   },
// };
// const { data: defaultFilter } = await useFetch('/api/filter/readable', {
//   query: readableFilter,
//   method: 'GET',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

const id = ref(Number(route.params.id));
const { data: l } = await useFetch(`/api/filter/slugfromid/${id.value}`);
const defaultFilter = computed(() => {
  if (l.value) {
    return {
      filters: {
        // [l.value.slug]: [Array.isArray(route.params.id) ? route.params.id[0] : route.params.id]
        [l.value.slug]: [id.value]
      },
    };
  }
});

console.log(defaultFilter.value);




</script>
<template>

  <UserMegaMenu subCategory="subCategory" :items="items" />


  <Clothes :mainCategory="l?.name ?? ''" :default-filters="defaultFilter?.filters ?? undefined" />

</template>
