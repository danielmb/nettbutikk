<script lang="ts" setup>  

const route = useRoute();
const filterId = route.params.filterId as string;

const { data: filter } = await useFetch(`/api/filter/id/${filterId}`);
</script>

<template>
  <pre>
    {{ filter }}
  </pre>
</template>