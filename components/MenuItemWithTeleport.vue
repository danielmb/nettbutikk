<script lang="ts" setup>
import { Button } from '@/components/ui/button';

const props = defineProps<{
  item: any;
  isActive: boolean;
  to: string;
}>();

const emit = defineEmits(['toggle-menu']);

const toggleMenu = () => {
  emit('toggle-menu');
};
</script>

<template>
  <div class="relative">
    <!-- Button to toggle the teleport content -->
    <Button class="p-2" @click.prevent="toggleMenu">
      {{ item.label }}
    </Button>

    <!-- Teleport content, only rendered when this item is active -->
    <Teleport :to="to" v-if="isActive">
      <div v-if="isActive" class="teleport-content">
        <div class="bg-white p-4 shadow-md rounded">
          <h3 class="font-bold mb-2">{{ item.label }} Details</h3>
          <div v-if="item.description" class="mb-2">{{ item.description }}</div>
          <div v-if="item.subItems" class="mt-2">
            <div
              v-for="(subItem, subIndex) in item.subItems"
              :key="subIndex"
              class="py-1"
            >
              {{ subItem.label }}
            </div>
          </div>
          <Button class="mt-2" @click="toggleMenu">Close</Button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
