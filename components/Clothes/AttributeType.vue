<script setup lang="ts">
// import type { AttributeType } from '@prisma/client';
import { watch, ref, defineProps } from 'vue';
interface Value {
  id: number;
  value: string;
  displayName: string;
  attributeTypeId: number;
  createdAt: string;
  updatedAt: string;
  _count: {
    items: number;
  }
}
interface Props {
  filter: {
    id: number;
    name: string;
    slug: string;
    filterable: boolean;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
    values: Value[];
  }
  activeFilters: Record<string, number[]>;
}

const { filter, activeFilters } = withDefaults(defineProps<Props>(), {
})

const options = filter.values.map((value) => {
  return {
    value: String(value.id),
    label: value.displayName,
  }
})

const selected = ref<string[]>([])

watch(selected, (newValue) => {
  console.log(newValue)
})

const handleChange = (value: string) => {
  const activeFilter = activeFilters[filter.slug]
  if (!activeFilter) {
    activeFilters[filter.slug] = []
  }
  const index = activeFilter.indexOf(Number(value))
  if (index === -1) {
    activeFilter.push(Number(value))
  } else {
    activeFilter.splice(index, 1)
  }

  selected.value = activeFilter.map(String)


}


</script>

<template>
  <pre>
    {{ activeFilters }}
  </pre>
  <ShadMultiSelect no-badge v-model="selected" :options="options" @change="handleChange" :placeholder="filter.name" />
</template>