<script lang="ts" setup>
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
const props = defineProps<{
  mainCategory: string;
}>();

const {
  data: items,
} = await useFetch('/api/items', { query: { category: props.mainCategory } });
const currency = useCurrencyStore();
currency.setCurrency('USD');
await currency.fetchExchangeRates();
</script>


<template>
  <div class="grid grid-cols-4 w-fit gap-2">
    <ClothesItem v-if="items" :item="{ ...item }" v-for="item in items" :key="item.id" />

  </div>
</template>