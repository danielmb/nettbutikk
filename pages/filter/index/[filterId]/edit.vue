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
};

const open = ref(false);

</script>

<template>
  <Dialog v-model:open="open" v-on:update:open="updateOpen">
    <DialogContent>
      <DialogTitle>Edit Filter</DialogTitle>
      <DialogDescription> Edit your filter </DialogDescription>
      <FiltersEdit :filterId="Number(id)" @submit="updateOpen(false)" />
    </DialogContent>
  </Dialog>
</template>
