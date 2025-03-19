<script lang="ts" setup>
import { ref } from 'vue';
import Autoplay from 'embla-carousel-autoplay'
const props = defineProps<{
  products: {
    id: number;
    image: string;
    name: string;
  }[];
}>();
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const { category } = useCategory();

const isHovered = ref(false);
const setHovered = (value: boolean) => {
  isHovered.value = value;
}
</script>
<template>
  <!-- class="flex flex-col w-1/4 p-2 relative" :href="`/category/${category}/item/${id}`"> -->
  <div class="flex flex-row w-full">

    <Carousel class="relative w-full" :plugins="[Autoplay({
      stopOnMouseEnter: true,
      stopOnInteraction: true,
      delay: Math.floor(Math.random() * 5000) + 5000,
    })]" :opts="{
      align: 'start',
      loop: true,
      dragFree: true,
      startIndex: 0,


    }">
      <!-- Add a on hover -->
      <CarouselContent :onmouseover="setHovered(true)" :onmouseout="setHovered(false)">
        <CarouselItem v-for="{ id, image, name } in products.slice(0, 10)" :key="id" class="md:basis-1/2 lg:basis-1/6 ">
          <a class="flex flex-col p-2 relative" :href="`/category/${category}/item/${id}`">
            <div class="flex flex-col">
              <img :src="image" alt="product" class="h-52 md:h-96 object-cover" />
              <!-- put a gradient black to transparent overlay on top of the image -->
              <div
                class="text-center font-bold absolute bottom-0 h-12 w-full bg-gradient-to-t from-black to-transparent text-white">
                <span class="">{{ name }}</span>
              </div>
            </div>
          </a>
        </CarouselItem>
      </CarouselContent>

    </Carousel>
  </div>
</template>