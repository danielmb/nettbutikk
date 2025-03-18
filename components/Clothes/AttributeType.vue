<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';

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
  initialValues?: number[];
}

const props = defineProps<Props>();
const emit = defineEmits(['update-filters']);

const options = props.filter.values.map((value) => ({
  value: String(value.id),
  label: value.displayName,
}));

const selected = ref<string[]>([]);

// Watch for changes in the model value
watch(selected, (newValue) => {
  console.log('Selected values changed:', newValue);
  const selectedValues = newValue.map(Number); // Convert to numbers

  emit('update-filters', {
    slug: props.filter.slug,
    values: selectedValues,
  });
});

onMounted(() => {
  // Set initial values on mount
  if (props.initialValues) {
    selected.value = props.initialValues.map(String); // Convert numbers to strings
  }
});


</script>

<template>
  <ShadMultiSelect no-badge v-model="selected" :options="options" :placeholder="filter.name" />
</template>