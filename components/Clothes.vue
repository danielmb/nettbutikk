// components/Clothes.vue
<script lang="ts" setup>
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { type UseProductsOptions } from '~/composables/useProducts';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectLabel,
} from '@/components/ui/select';
import { SelectIcon, type SelectTriggerProps, useForwardProps } from 'reka-ui';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps<{
  defaultFilters?: UseProductsOptions['staticFilters'] | undefined;
}>();
const route = useRoute();

const filterId = route.query.filterId as string;
const { data: filter } = await useFetch(`/api/filter/id/${filterId}`);
const { products, filters, loading, setFilter, removeFilter, activeFilters } =
  await useProducts({
    staticFilters: props.defaultFilters,
  });

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
    class="relative mx-auto max-w-7xl md:px-4 sm:px-6 lg:px-8 py-8 items-center justify-center flex flex-col space-y-10"
  >
    <div></div>

    <div class="flex flex-col items-center justify-center">
      <h1 class="text-2xl font-bold mb-4">{{ filter?.name }}</h1>
      <!-- Category description -->
      <!-- <p class="text-center text-gray-500 mb-4">
        {{ props.description }}
      </p> -->

      <Text :text="filter?.description ?? ''" :maxLength="150">
        <template #button="{ isExpanded, toggleExpand }">
          <Button
            v-if="!isExpanded"
            variant="ghost"
            class="pi pi-chevron-down"
            @click="toggleExpand"
          />
          <Button
            v-else
            variant="ghost"
            class="pi pi-chevron-up"
            @click="toggleExpand"
          />
        </template>
      </Text>
    </div>
    <!-- Filters -->

    <div
      class="hidden lg:grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 w-full"
    >
      <ClothesAttributeType
        v-for="filter in filters"
        :key="filter.id"
        :filter="filter"
        v-model:model-value="activeFilters[filter.slug]"
        @update:model-value="
          (values) => handleUpdateFilters({ slug: filter.slug, values })
        "
      />
    </div>
    <div class="lg:hidden w-full">
      <div class="flex w-full">
        <Select>
          <SelectTrigger as-child hide-chevron>
            <Button variant="outline" class="w-1/2">
              Sort
              <SelectIcon as-child>
                <ChevronDown class="w-4 h-4 opacity-50 shrink-0" />
              </SelectIcon>
            </Button>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="price">Price</SelectItem>
          </SelectContent>
        </Select>
        <Sheet>
          <SheetTrigger as-child>
            <Button class="w-1/2"> Filters </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle> Filters </SheetTitle>
            </SheetHeader>
            <div class="grid grid-cols-1 gap-4">
              <ClothesAttributeType
                v-for="filter in filters"
                :key="filter.id"
                :filter="filter"
                :initial-values="activeFilters[filter.slug]"
                @update-filters="handleUpdateFilters"
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>

    <div
      v-if="loading"
      class="w-full flex justify-center items-center absolute"
    >
      <div
        class="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 col-span-full"
      >
        <div class="pi pi-spinner"></div>
      </div>
    </div>
    <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 w-fit gap-2">
      <div
        v-if="!products?.length"
        class="w-full flex justify-center items-center"
      >
        <p>No items found</p>
      </div>
      <ClothesItem
        :item="{ ...item }"
        v-for="item in products"
        :key="item.id"
      />
    </div>
  </div>
</template>
