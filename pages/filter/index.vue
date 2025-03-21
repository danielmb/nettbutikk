<script lang="ts" setup>
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
const filters = await useFetch('/api/filters');
const name = ref('');
const newFilter = async (name: string) => {
  console.log(name);
  const res = await $fetch('/api/filters', {
    method: 'POST',
    body: JSON.stringify({ name }),
  });
};
</script>

<template>
  <NuxtPage />
  <Filters />
</template>
