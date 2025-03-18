// components/Clothes.vue
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
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger, } from './ui/select';
import type { AttributeType } from '@prisma/client';
import { type UseProductsOptions } from '~/composables/useProducts';
const props = defineProps<{
  defaultFilters?: UseProductsOptions['staticFilters'] | undefined;
  mainCategory: string;
  description?: string;
}>();


const {
  products,
  filters,
  loading,
  setFilter,
  removeFilter,
  activeFilters,
} = useProducts(
  {
    staticFilters: props.defaultFilters,
  }
)


const currency = useCurrencyStore();
currency.setCurrency('USD');
await currency.fetchExchangeRates();



const handleUpdateFilters = (event: { slug: string; values: number[] }) => {
  if (event.values.length === 0) {
    removeFilter(event.slug);
    return;
  }
  setFilter(event.slug, event.values);
};


</script>


<template>
  <div
    class="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 items-center justify-center flex flex-col space-y-10">
    <div>

    </div>

    <div class="flex flex-col items-center justify-center">

      <h1 class=" text-2xl font-bold mb-4">{{ mainCategory }}</h1>
      <!-- Category description -->
      <p class="text-center text-gray-500 mb-4">
        {{ props.description }}
      </p>
    </div>
    <!-- Filters -->
    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 w-full">
      <ClothesAttributeType v-for="filter in filters" :key="filter.id" :filter="filter"
        :initial-values="activeFilters[filter.slug]" @update-filters="handleUpdateFilters" />
    </div>

    <div class="grid grid-cols-4 w-fit gap-2">
      <div v-if="loading" class="w-full flex justify-center items-center">
        <div class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900">
          <div class="pi pi-spinner"></div>
        </div>
      </div>
      <div v-else-if="!products?.length" class="w-full flex justify-center items-center">
        <p>No items found</p>
      </div>
      <ClothesItem v-else :item="{ ...item }" v-for="item in products" :key="item.id" />
    </div>
  </div>

</template>
