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
import type { InternalApi } from 'nitropack/types';
const props = defineProps<{
  // item: InternalApi['/api/items']['default'][]
  item: any
}>();

const item = ref(props.item);

const currency = useCurrencyStore();
currency.setCurrency('USD');
await currency.fetchExchangeRates();
const addFavorite = async (id: number) => {
  const res = await $fetch(`/api/user/favorites/${id}`, {
    method: 'POST'
  })

  if (res) {
    item.value.isFavorite = true
  }

}

const removeFavorite = async (id: number) => {
  const res = await $fetch(`/api/user/favorites/${id}`, {
    method: 'DELETE'
  })

  if (res) {
    item.value.isFavorite = false
  };


}

const toggleFavorite = async (id: number) => {
  if (item.value.isFavorite) {
    await removeFavorite(id)
  } else {
    await addFavorite(id)
  }
}


const route = useRoute();
const categoryId = route.params.categoryId;

</script>


<template>
  <div class="w-full relative">

    <!-- <a :href="`item/${item.id}`"> -->
    <a :href="`/category/${categoryId}/item/${item.id}`">
      <Card class="md:w-[300px] border-none rounded-none shadow-none">
        <CardContent class="flex flex-col items-center p-2 h-72 lg:p-0 group">

          <img :src="item.image" :alt="item.title" class="object-cover overflow-hidden"
            :class="{ 'group-hover:hidden ': item.images.length > 0 }" />
          <img v-if="item.images.length > 0" :src="item.images[0].url" :alt="item.title"
            class="object-cover hidden group-hover:block" />
        </CardContent>
        <CardHeader>
          <CardTitle>{{ item.name }}</CardTitle>
          <CardDescription>{{ item.description }}
          </CardDescription>
        </CardHeader>

        <CardFooter class="flex justify-between">
          <Price :price="item.price" />
        </CardFooter>
      </Card>
    </a>
    <!-- favorite -->
    <Button class="absolute bottom-24 right-0 w-2" variant="ghost" @click="toggleFavorite(item.id)">

      <!-- <div class="pi pi-heart"></div> -->
      <div class="pi" :class="{ 'pi-heart-fill': item.isFavorite, 'pi-heart': !item.isFavorite }"></div>
    </Button>
  </div>
</template>