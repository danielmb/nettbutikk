<script lang="ts">
import { ref } from 'vue';
</script>
<template>
  <MegaMenu
    :model="subCategory as any"
    class="container mx-auto px-4 sm:px-6 lg:px-8"
  >
    <template #item="{ item }">
      <a
        v-if="item.root"
        class="flex items-center cursor-pointer px-4 py-2 overflow-hidden relative font-semibold text-lg uppercase"
        style="border-radius: 2rem"
      >
        <span>{{ item.label }}</span>
      </a>
      <a
        v-else-if="item.type === 'rounded'"
        class="flex flex-row items-center gap-2 p-4 hover:bg-none"
        :class="{ 'border-t': !item.first }"
      >
        <div
          class="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
        >
          <img alt="megamenu-demo" :src="item.image" class="w-16" />
        </div>
        <span class="self-center">{{ item.label }}</span>
      </a>
      <a
        v-else
        class="flex flex-row items-center gap-2 hover:bg-none"
        :href="item.route"
      >
        <span class="self-center">{{ item.label }}</span>
      </a>
    </template>
  </MegaMenu>
</template>
