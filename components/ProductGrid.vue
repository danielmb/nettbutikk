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

const { category } = useCategory();

</script>
<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
    <a v-for="{ id, image, name } in products" :key="id" class="flex flex-col w-full p-2 relative"
      :href="`/category/${category}/item/${id}`">
      <div class="flex flex-col">
        <img :src="image" alt="product" class="h-52 md:h-96 object-cover" />
        <div
          class="text-center font-bold absolute bottom-0 h-12 w-full bg-gradient-to-t from-black to-transparent text-white">
          <span class="">{{ name }}</span>
        </div>
      </div>
    </a>
  </div>
</template>