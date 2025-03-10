<script setup lang="ts">
const { data } = await useFetch('/api/hello');
const value = ref('');
</script>

<template>
  <div></div>
</template>
