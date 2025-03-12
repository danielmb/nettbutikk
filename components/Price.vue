<script lang="ts" setup>
import { ref } from 'vue';
import { useCurrencyStore } from '@/stores/currency';

const currency = useCurrencyStore();
const props = defineProps<{
  price: number;
}>();
// compute
const convertedPrice = computed(() => {
  return currency.formattedAmount(props.price);
});
</script>

<template>
  <span>{{ convertedPrice }}</span>
</template>