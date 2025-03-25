<script lang="ts" setup>
import { ref } from 'vue';

const items = ref([
  { label: 'New Arrivals' },
  { label: 'Clothing' },
  { label: 'Shoes' },
  { label: 'Accessories' },
]);







</script>
<template>
  <div>
    <AppHeader />
    <UserMegaDB subCategory="subCategory" :items="items" />
    <slot />
  </div>
</template>
