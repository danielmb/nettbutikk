<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
const route = useRoute();
const router = useRouter();
const id = route.params.filterId as string;

const updateOpen = (val: boolean) => {
  open.value = val;
  if (!val) {
    router.push('/filter?refetch=true');
  }
}; 1

const open = ref(true);

</script>

<template>
  <Dialog defaultOpen v-model:open="open" v-on:update:open="updateOpen">
    <DialogContent>
      <DialogTitle>Edit Filter</DialogTitle>
      <DialogDescription> Edit your filter </DialogDescription>
      <FiltersEdit :filterId="Number(id)" @submit="updateOpen(false)" />
    </DialogContent>
  </Dialog>
</template>
