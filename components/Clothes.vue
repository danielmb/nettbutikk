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
    <div v-for="(item, index) in items" :key="index" class="w-full relative">
      <Card class="w-[300px] border-none rounded-none shadow-none">
        <CardContent class="flex flex-col items-center">
          <!-- <div class="grid items-center w-full gap-4">
          <div class="text-2xl font-bold">${{ item.price }}</div>
          <div class="text-sm text-gray-500">In Stock: {{ item.stock }}</div>
        </div> -->

          <img :src="item.image" alt="item.title" class="h-80 object-cover" />
        </CardContent>
        <CardHeader>
          <CardTitle>{{ item.title }}</CardTitle>
          <CardDescription>{{ item.description }}
          </CardDescription>
        </CardHeader>

        <CardFooter class="flex justify-between">
          <!-- {{ item.price }} -->
          <Price :price="item.price" />
        </CardFooter>
      </Card>
      <!-- favorite -->
      <Button class="absolute bottom-24 right-0 w-2" variant="ghost">
        <div class="pi pi-heart"></div>
      </Button>
    </div>
  </div>
</template>