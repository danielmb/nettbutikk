<script setup lang="ts" generic="T extends z.ZodAny">
import { computed } from 'vue';
import type { Config, ConfigItem, FieldProps } from '~/components/ui/auto-form';
import { AutoFormLabel, getBaseType } from '@/components/ui/auto-form';

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { FieldArray, FieldContextKey, useField } from 'vee-validate';
import { z } from 'zod';
import AutoFormField from '~/components/ui/auto-form/AutoFormField.vue';
import { Button } from '@/components/ui/button';
import { PlusIcon, TrashIcon } from 'lucide-vue-next';
import { Separator } from '@/components/ui/separator';
function isZodArray(
  item: z.ZodArray<any> | z.ZodDefault<any>,
): item is z.ZodArray<any> {
  return item instanceof z.ZodArray;
}

function isZodDefault(
  item: z.ZodArray<any> | z.ZodDefault<any>,
): item is z.ZodDefault<any> {
  return item instanceof z.ZodDefault;
}
const props = defineProps<{
  fieldName: string;
  required?: boolean;
  config?: Config<T>;
  schema?: z.ZodArray<T>;
  disabled?: boolean;
}>();
const itemShape = computed(() => {
  if (!props.schema) return;

  const schema: z.ZodAny = isZodArray(props.schema)
    ? props.schema._def.type
    : isZodDefault(props.schema)
    ? // @ts-expect-error missing schema
      props.schema._def.innerType._def.type
    : null;

  return {
    type: getBaseType(schema),
    schema,
  };
});

watch(
  () => props,
  (val) => {
    console.log(val);
  },
  { deep: true },
);

const { data: filters } = await useFetch(`/api/items/filters`);
</script>

<template>
  <FieldArray v-slot="{ fields, remove, push }" as="section" :name="fieldName">
    <!-- <div v-for="(field, index) in fields" :key="index">
      {{ field }}
    </div> -->
    <template v-for="(field, index) of fields" :key="field.key">
      <div class="mb-4 p-1">
        <AutoFormField
          :field-name="`${fieldName}[${index}]`"
          :label="fieldName"
          :shape="itemShape!"
          :config="config as ConfigItem"
        />

        <div class="!my-4 flex justify-end">
          <Button
            type="button"
            size="icon"
            variant="secondary"
            @click="remove(index)"
          >
            <TrashIcon :size="16" />
          </Button>
        </div>
        <Separator v-if="!field.isLast" />
      </div>
    </template>

    <Button
      type="button"
      variant="secondary"
      class="mt-4 flex items-center"
      @click="push(null)"
    >
      <PlusIcon class="mr-2" :size="16" />
      Add
    </Button>
  </FieldArray>
</template>
