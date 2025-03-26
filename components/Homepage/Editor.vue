<script lang="ts" setup>
const props = defineProps<{
  categoryId: number;
}>();
const { data: homepage } = await useFetch(`/api/homepage/${String(props.categoryId)}`);

</script>

<template>
  <h1>{{ homepage?.name }}</h1>

</template>