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
  <UserMegaMenu subCategory="subCategory" :items="items" />
  <Clothes mainCategory="men" />
</template>
