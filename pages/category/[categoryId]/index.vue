<script lang="ts" setup>
import { ref } from 'vue';


const route = useRoute();

// TODO: Refactor this, this is a mess and hard to read and understand
const id = ref(Number.isNaN(Number(route.params.categoryId)) ? route.params.categoryId : Number(route.params.categoryId)) as Ref<number | string>;
const { data: l } =
  typeof id.value === 'number'
    ? await useFetch(`/api/filter/slugfromid/${id.value}`)
    : await useFetch(`/api/filter/typefromvalueslug/${id.value}`);
const defaultFilter = computed(() => {
  if (l.value) {
    let val: number;
    if (typeof id.value === 'number') {
      val = id.value
    } else {
      let foundId = l.value.values.find((v) => v.slug === id.value)?.id
      if (!foundId) {
        throw new Error('No id found')
      }
      val = foundId
    }
    return {
      filters: {
        [l.value.slug]: [val]
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



  <Clothes :default-filters="defaultFilter?.filters ?? undefined" />

</template>
