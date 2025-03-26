<script lang="ts" setup>
import {
  Select,
  SelectContent,
  SelectItem, SelectValue,
  SelectTrigger,
  SelectGroup
} from '@/components/ui/select/';
import { Button } from '@/components/ui/button/';
import { useToast } from '../ui/toast';

const { toast } = useToast();
const props = defineProps<{
  filterId: number,
  route: string,
  name: string,
}>()
const selectedSectionId = ref<number | null>(null)
const { data: megaMenuItems } = useFetch('/api/megamenuSections')
const addMegaMenu = async (
) => {
  try {
    const res = await $fetch(`/api/megamenuItems`, {
      method: 'POST',
      body: JSON.stringify({
        route: props.route,
        name: props.name,
        label: props.name,
        navigationSectionId: selectedSectionId.value,
        filterId: props.filterId,
      }),
    })
  } catch (e) {
    toast({
      title: 'Error',
      description: 'Failed to add to Mega Menu, check console for more details',
      variant: 'destructive',
    });
    console.error(e)
  }

}
</script>

<template>
  <Select v-model="selectedSectionId">
    <SelectTrigger>
      <SelectValue />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem v-for="item in megaMenuItems" :key="item.id" :value="item.id">
          {{ item.label }}
        </SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>

  <Button @click="addMegaMenu">Add to Mega Menu</Button>
</template>
