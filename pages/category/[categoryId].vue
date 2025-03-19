<script lang="ts" setup>
import { ref } from 'vue';


const route = useRoute();

const id = ref(Number(route.params.categoryId));
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

const option = computed(() => {
  if (l.value)
    return l.value.values.find((v) => v.id === id.value);

});




</script>
<template>



  <Clothes :mainCategory="option?.displayName ?? ''" :description="option?.description ?? ''"
    :default-filters="defaultFilter?.filters ?? undefined" />

</template>
