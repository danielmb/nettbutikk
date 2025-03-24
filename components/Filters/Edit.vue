<script lang="ts" setup>
import {
  filters_id_patchSchema,
  filterValueSchema,
  type FilterValue,
} from '~/schemas/filters_[id].patch';
import { z } from 'zod';
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
const toast = useToast();
const e = ref({});
const props = defineProps<{
  filterId: number;
  onSubmit?: () => void;
}>();

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import type { UpdateFiltersPayload } from '../Clothes/AttributeType.vue';

const { data: filters } = await useFetch(`/api/items/filters`);
const { data: filterData } = await useFetch(`/api/filters/${props.filterId}`);
// watch(
//   () => filters,
//   (val) => {
//     return filters_id_patchSchema;
//   },
// );
// const modifiedSchema = computed(() => {
//   if (!filters.value) {
//     return filters_id_patchSchema;
//   }
//   const filtersArr = filters.value.map((filter: any) => filter.id.toString());
//   const enumData = z.enum(filtersArr as any);
//   return filters_id_patchSchema.extend({
//     values: filterValueSchema.extend({
//       attributeTypeId: enumData,
//     }),
//   });
// });
const formSchema = toTypedSchema(filters_id_patchSchema);
const { isFieldDirty, handleSubmit, errors } = useForm({
  validationSchema: formSchema,
  initialValues: {
    id: props.filterId,
    description: filterData.value?.filter?.description ?? undefined,
    name: filterData.value?.filter?.name ?? undefined,
    values: filterData.value?.filter?.values.map((value) => ({
      id: value.id,
      attributeType: value.attributeType.slug,
    })) ?? [],
  }
})



const onSubmit = handleSubmit(async (values) => {
  console.log(values);

  await $fetch(`/api/filters/${props.filterId}`, {
    method: 'PATCH',
    body: JSON.stringify(values),
  });
  // toast.add({ summary: 'Page loaded' });

  toast.add({
    summary: 'Filter updated',
    severity: 'success',
  });

  if (props.onSubmit) {
    props.onSubmit();
  }
});

// const fieldArrayToObj = (fieldArray: FilterValue[]) => {
//   return fieldArray.reduce((acc, field) => {
//     if (!field.attributeType || !field.id) {
//       return acc;
//     }
//     acc[field.attributeType] = field.id;
//     return acc;
//   }, {} as Record<string, number>);
// };

const fieldArrayToNumberArray = (fieldArray: FilterValue[], attributeType: string) => {
  return fieldArray
    .filter((field) => field.attributeType === attributeType)
    .map((field) => field.id ?? 0);

};

// const objToFieldArray = (obj: Record<string, number>) => {
//   return Object.entries(obj).map(([attributeType, id]) => {
//     return {
//       attributeType,
//       id,
//     };
//   });
// };

const updateFilters = (payload: UpdateFiltersPayload,
  attributeType: string,
  field: FilterValue[],
  onChange: (
    values: FilterValue[],
  ) => void

) => {
  const newValues = payload.values.map((value) => {
    return {
      attributeType,
      id: value,
    };
  });
  const filteredValues = field.filter((value) => value.attributeType !== attributeType);
  newValues.forEach((value) => {
    filteredValues.push(value);
  });
  onChange(filteredValues);
};

watch(
  () => errors,
  (val) => {
    console.error(val);
  },
);
</script>

<template>
  <!-- <AutoForm
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
  /> -->

  <div>
    <div>
      <form class="w-2/3 space-y-6" @submit="onSubmit">
        <div>
          <FormField v-slot="{ componentField }" name="name" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="e.g. Men's T-Shirts" v-bind="componentField" />
              </FormControl>
              <FormDescription>
                This is the name of the filter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField }" name="description" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <div class="relative">

                  <Input type="text" placeholder="Description" v-bind="componentField" />
                  <Button type="button" class="absolute right-0 top-0 p-2">
                    <div class="pi pi-fw pi-search"></div>
                  </Button>
                </div>
              </FormControl>
              <FormDescription>
                This is the description of the filter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <FormField v-slot="{ componentField, field, }" name="values" :validate-on-blur="!isFieldDirty">
            <FormItem>
              <FormLabel>Set filters</FormLabel>
              <FormControl>
                <div class="flex flex-row space-x-4 overflow-x-auto p-4">
                  <div v-for="filter in filters" :key="filter.id">
                    <ClothesAttributeType :filter="filter"
                      :initialValues="fieldArrayToNumberArray(field.value ?? [], filter.slug)"
                      @update-filters=" updateFilters($event, filter.slug, field.value ?? [], field.onChange)" />

                  </div>
                </div>
              </FormControl>
              <FormDescription>
                This is the description of the filter.
              </FormDescription>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div>
          <Button type=" submit">Submit</Button>
        </div>
      </form>
    </div>


  </div>
</template>
