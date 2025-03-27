<script lang="ts" setup>
import { ref } from 'vue';
import Autoplay from 'embla-carousel-autoplay'
const props = withDefaults(defineProps<{
  max?: number;
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
}>(), {
  max: 6,
})


</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">

    <ProductData v-for="{ id, image, name, brand, category } in products.slice(0, max)" :key="id"
      :product="{ id, name, brand, category }">
      <div class="flex flex-col relative">
        <img :src="image" alt="product" class="h-52 md:h-96 object-cover" />
        <div
          class="text-center font-bold absolute bottom-0 h-12 w-full bg-gradient-to-t from-black to-transparent text-white">
          <span class="">{{ name }}</span>
        </div>
      </div>
    </ProductData>
  </div>
</template>