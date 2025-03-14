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
import type { Item } from '@prisma/client'
import type { SerializeObject } from 'nitropack';
const props = defineProps<{
  item: SerializeObject<Item>;
}>();

const item = ref(props.item);

// const {
//   data: items,
// } = await useFetch('/api/items', { query: { category: props.mainCategory } });

const currency = useCurrencyStore();
currency.setCurrency('USD');
await currency.fetchExchangeRates();
const { isFavorited, toggleFavorite, favorites } = useFavoritesStore()
const favorite = computed(() => isFavorited(item.value.id))
</script>


<template>
  <div class="w-full relative">

    <a :href="`/item/${item.id}`">
      <Card class="w-[300px] border-none rounded-none shadow-none">
        <CardContent class="flex flex-col items-center">
          <!-- <div class="grid items-center w-full gap-4">
          <div class="text-2xl font-bold">${{ item.price }}</div>
          <div class="text-sm text-gray-500">In Stock: {{ item.stock }}</div>
        </div> -->

          <img :src="item.image" alt="item.title" class="h-80 object-cover" />
        </CardContent>
        <CardHeader>
          <CardTitle>{{ item.name }}</CardTitle>
          <CardDescription>{{ item.description }}
          </CardDescription>
        </CardHeader>

        <CardFooter class="flex justify-between">
          <!-- {{ item.price }} -->
          <Price :price="item.price" />
        </CardFooter>
      </Card>
    </a>
    <!-- favorite -->
    <Button class="absolute bottom-24 right-0 w-2" variant="ghost" @click="toggleFavorite(item.id)">

      <!-- <div class="pi pi-heart"></div> -->
      <div class="pi" :class="{ 'pi-heart-fill': favorite, 'pi-heart': !favorite }"></div>
    </Button>
  </div>
</template>