<script lang="ts" setup>
import { defineProps, withDefaults } from 'vue';
import { Button } from '@/components/ui/button';
// const props = defineProps<{
//   images: Image[];
// }>();
interface Image {
  id: number;
  url: string;
};
const props = defineProps<{
  images: Image[];
}>();
const activeImage = ref(props.images[0]);
</script>

<template>
  <div class="flex flex-row justify-between">
    <div class="w-1/6 flex flex-col">
      <Button v-for="image in props.images" :key="image.id" variant="ghost" @click="activeImage = image"
        class="h-30 w-20 p-2">
        <img :src="image.url" alt="item" class="w-full h-full object-cover" />
      </Button>
    </div>
    <div class="w-5/6 flex flex-row" v-if="activeImage">
      <img :src="activeImage.url" alt="item" class="w-96 h-full object-cover" />
    </div>
  </div>
</template>