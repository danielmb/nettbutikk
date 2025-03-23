<script setup lang="ts">
import { ref, defineProps, defineEmits, watch, onMounted, computed } from 'vue';
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
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
export interface UpdateFiltersPayload {
  slug: string;
  values: number[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update-filters': [payload: UpdateFiltersPayload];
}>();

const options = props.filter.values.map((value) => ({
  value: String(value.id),
  label: value.displayName,
}));

const selected = defineModel<number[]>({ default: [] });
const search = defineModel<string>('search', { default: '' });
const isInitialRender = ref(true);

onMounted(() => {
  if (props.initialValues) {
    selected.value = [...props.initialValues];
  }
});

watch(selected, (newValue) => {
  if (isInitialRender.value) {
    isInitialRender.value = false;
    return;
  }

  // Add this emit back
  emit('update-filters', {
    slug: props.filter.slug,
    values: newValue,
  });
});

const selectedAsStrings = computed(() => {
  return selected.value.map(String);
});

const handleMultiSelectUpdate = (newStringValues: string[]) => {
  selected.value = newStringValues.map(Number);
};

const toggleSelection = (valueId: number) => {

  if (selected.value.includes(valueId)) {
    selected.value = selected.value.filter(v => v !== valueId);
  } else {
    selected.value = [...selected.value, valueId];
  }
};


const values = computed(() => {

  if (!search.value || props.filter.values.length <= 5

  ) return props.filter.values;
  return props.filter.values.filter((value) => value.displayName.toLowerCase().includes(search.value.toLowerCase()));
});

</script>

<template>
  <div class="hidden md:block">
    <ShadMultiSelect no-badge :model-value="selectedAsStrings" @update:model-value="handleMultiSelectUpdate"
      :options="options" :placeholder="filter.name" />
  </div>
  <div class="md:hidden p-0">
    <Sheet>
      <SheetTrigger as-child>
        <Button variant="ghost" class="w-full border flex flex-col h-auto">
          {{ filter.name }}
          <div class="flex space-x-4 max-w-full overflow-x-hidden">
            <template v-for="value in filter.values" :key="value.id">
              <span v-if="selected.includes(value.id)" class="text-sm text-gray-500">
                {{ value.displayName }} ({{ value._count.items }})
              </span>
            </template>
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetTitle>
          {{ filter.name }}
        </SheetTitle>
        <SheetDescription class="flex justify-between">
          <div>
            Select one or more options to filter the results.
          </div>
          <Button variant="ghost" class="text-sm text-blue-500" @click="selected = []" v-if="selected.length > 0">
            Clear all
          </Button>
        </SheetDescription>
        <Divider />
        <Input v-if="filter.values.length > 5" v-model="search" placeholder="Search" />
        <Button v-for="value in values" :key="value.id" @click="toggleSelection(value.id)" variant="ghost"
          class="flex items-center justify-between w-full p-2 border-b">
          <div class="flex space-x-4 items-center">
            <div class="text-lg" :class="{ 'font-bold': selected.includes(value.id) }">
              {{ value.displayName }}
            </div>
            <div class="text-sm text-gray-500">
              ({{ value._count.items }})
            </div>
          </div>
          <div>
            <Checkbox :model-value="selected.includes(value.id)" />
          </div>
        </Button>
      </SheetContent>
    </Sheet>
  </div>
</template>