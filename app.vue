<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>
<template>
  <ClientOnly>
    <Toaster />
  </ClientOnly>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.1s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>