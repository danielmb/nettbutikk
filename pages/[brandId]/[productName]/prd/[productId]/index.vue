<script setup lang="ts">
const route = useRoute();


</script>

<template>
  <Item :item-id="Number($route.params.productId)" />
</template>