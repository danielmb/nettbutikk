<script setup lang="ts">
const route = useRoute();

const { data: item } = await useFetch(`/api/items/${Number(route.params.id)}`);
const { addItem } = useCartStore();
</script>

<template>
  <Item />
</template>