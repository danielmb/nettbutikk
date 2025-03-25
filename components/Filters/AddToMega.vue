<script lang="ts" setup>
import {
  Select,
  SelectContent,
  SelectItem, SelectValue,
  SelectTrigger,
  SelectGroup
} from '@/components/ui/select/';

const props = defineProps<{
  route: string,
  name: string,
}>()
const { data: megaMenuItems } = useFetch('/api/megamenuSections')

</script>

<template>
  <Select>
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
</template>
