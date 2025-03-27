<script lang="ts" setup>
import { ref } from 'vue';
import Autoplay from '@/lib/embla/autoplay';
const props = defineProps<{
  products: {
    id: number;
    image: string;
    name: string;
    category: {
      id: number;
      slug: string | null;
    } | null;
    brand: {
      id: number;
      slug: string | null;
    } | null;
  }[];
}>();
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const { category } = useCategory();

const isHovered = ref(false);
const setHovered = (value: boolean) => {
  isHovered.value = value;
}

// const delay = ref(1000);
const plugins = ref([
  Autoplay({
    delay: 5000,
    stopOnMouseEnter: true,
    stopOnInteraction: true,
    playOnInit: true,
    nextOnInit: true,
  })]
);

onMounted(() => {
  // setTimeout(() => {
  //   plugins.value[0].setOptions({
  //     delay: 5000,
  //   });
  // }, 5000);
});

</script>
<template>
  <!-- class="flex flex-col w-1/4 p-2 relative" :href="`/category/${category}/item/${id}`"> -->
  <div class="flex flex-row" style="width: calc(100% - 20px); height: 100%; position: relative;">
    <Carousel class="w-fit px-10" v-bind:plugins="plugins" :opts="{
      align: 'start',
      loop: true,
      dragFree: true,
      startIndex: 0,
    }">
      <!-- Add a on hover -->

      <CarouselContent :onmouseover="setHovered(true)" :onmouseout="setHovered(false)">
        <CarouselItem v-for="{ id, image, name, category, brand } in products.slice(0, 10)" :key="id"
          class="md:basis-1/2 lg:basis-1/6 ">
          <ProductData class="flex flex-col p-2 relative" :product="{ id, category, brand, name }">
            <div class="flex flex-col">
              <img :src="image" alt="product" class="h-52 md:h-96 object-cover" />
              <div
                class="text-center font-bold absolute bottom-0 h-12 w-full bg-gradient-to-t from-black to-transparent text-white">
                <span class="">{{ name }}</span>
              </div>
            </div>
          </ProductData>
        </CarouselItem>
      </CarouselContent>
      <CarouselPrevious class="absolute top-1/2 left-0 transform -translate-y-1/2 z-10  p-2 rounded-full" />
      <CarouselNext class="absolute top-1/2 right-0 transform -translate-y-1/2 z-10  p-2 rounded-full" />

    </Carousel>
  </div>
</template>