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
    router.push(`/filter`);
  }
};

const open = ref(true);

const { data: filter } = await useFetch(`/api/filter/id/${id}`);
</script>

<template>
  <Dialog defaultOpen v-model:open="open" v-on:update:open="updateOpen">
    <DialogContent>
      <DialogTitle>Edit Filter</DialogTitle>
      <DialogDescription> hi </DialogDescription>
      <FiltersEdit :filterId="id" />
    </DialogContent>
  </Dialog>
</template>
