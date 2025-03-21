<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { FieldProps } from '~/components/ui/auto-form';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Example: using Input for editing strings

const props = defineProps<{
  field: any; // Assuming 'field' contains form specific data
  form: any; // Assuming 'form' contains form control context
  fieldName: string; // The name of the field
  required?: boolean;
  config?: {
    label?: string;
    description?: string;
    // Add other relevant configurations
  };
}>();

const values = computed({
  get: () => props.form.getFieldValues()[props.fieldName] || [],
  set: (val) => props.form.setFieldValue(props.fieldName, val),
});

const localValues = ref<any[]>(values.value); // Use local ref to avoid direct mutation of form values

watch(values, (newVal) => {
  localValues.value = newVal;
});

const addFilter = () => {
  localValues.value.push(''); // Add a new empty filter (adjust based on your filter structure)
};

const updateFilter = (index: number, newValue: any) => {
  localValues.value[index] = newValue;
  values.value = localValues.value; // Update the form value
};

const removeFilter = (index: number) => {
  localValues.value.splice(index, 1);
  values.value = localValues.value;
};
</script>

<template>
  <div>
    <div
      v-for="(value, index) in localValues"
      :key="index"
      class="flex items-center space-x-2 mb-2"
    >
      <Input
        v-model="localValues[index]"
        @input="() => updateFilter(index, localValues[index])"
      />
      <Button
        type="button"
        variant="destructive"
        size="icon"
        @click="removeFilter(index)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="h-4 w-4"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </Button>
    </div>
    <Button type="button" @click="addFilter">Add new filter</Button>
  </div>
</template>
