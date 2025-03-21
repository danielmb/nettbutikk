<script lang="ts" setup>
import {
  filters_id_patchSchema,
  filterValueSchema,
} from '~/schemas/filters_[id].patch';
import { AutoForm, AutoFormField } from '@/components/ui/auto-form';
import { z } from 'zod';
import { FiltersEdit, FiltersEditField } from '#components';
const e = ref({});
const props = defineProps<{
  filterId: string;
}>();
const { data: filters } = await useFetch(`/api/items/filters`);

// watch(
//   () => filters,
//   (val) => {
//     return filters_id_patchSchema;
//   },
// );
const modifiedSchema = computed(() => {
  if (!filters.value) {
    return filters_id_patchSchema;
  }
  const filtersArr = filters.value.map((filter: any) => filter.id.toString());
  const enumData = z.enum(filtersArr as any);
  return filters_id_patchSchema.extend({
    values: filterValueSchema.extend({
      attributeTypeId: enumData,
    }),
  });
});
</script>

<template>
  <AutoForm
    :schema="modifiedSchema"
    :field-config="{
      values: {
        component: FiltersEditField,
      },
    }"
    :submit="
      async () => {
        console.log('submit');
      }
    "
  />
</template>
