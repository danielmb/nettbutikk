<script setup lang="ts">
const route = useRoute();


</script>

<template>
  <div>
    <h1>Item {{ $route.params.itemId }}</h1>
  </div>
</template>