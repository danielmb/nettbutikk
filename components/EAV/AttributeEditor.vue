<script lang="ts" setup>
import { AutoForm } from '@/components/ui/auto-form';
import { z } from 'zod';
import { attributeType_ID_Put } from '~/schemas/attribute-type.put';
import { Button } from '@/components/ui/button';
const props = defineProps({
  attribute: {
    type: Object,
    required: true
  },
});
// const schema = z.object({
//   id: z.string().default(props.attribute.id),
//   name: z.string().default(props.attribute.name),
//   description: z.string().nullish().default(props.attribute.description),
//   required: z.boolean().default(props.attribute.required),
//   values: z.array(z.object({
//     id: z.string().optional(),
//     slug: z.string().nullish(),
//     value: z.string(),
//     displayName: z.string(),
//     sortOrder: z.number().optional(),
//     attributeTypeId: z.number().optional(),
//   })).optional().default(props.attribute.values),
// })

const schema = computed(() => {
  return attributeType_ID_Put.extend({
    id: z.number().default(props.attribute.id),
    name: z.string().default(props.attribute.name),
    description: z.string().nullish().default(props.attribute.description),
    required: z.boolean().default(props.attribute.required),
    values: z.array(z.object({
      id: z.number().optional(),
      slug: z.string().nullish(),
      value: z.string(),
      displayName: z.string(),
      sortOrder: z.number().optional(),
      attributeTypeId: z.number().optional(),
    })).optional().default(props.attribute.values),
  })
});

const { mutateAsync: updateAttribute } = useMutation({
  mutationFn: async (data: z.infer<typeof attributeType_ID_Put>) => {
    const res = await $fetch(`/api/attribute-type/${data.id}`, {
      method: 'PUT',
      body: data,
    })
    return res
  },
})

</script>

<template>
  <pre>

  </pre>
  <AutoForm :field-config="{
    id: {
      component: h('input', {
        type: 'hidden',
        value: attribute.id
      }),
    },

    values: {
      id: {

        component: h('input', {
          type: 'hidden',
          value: attribute.id
        }),
      },
      attributeTypeId: {
        component: h('input', {
          type: 'hidden',
          value: attribute.attributeTypeId
        }),
      },
    }
  }" :schema="schema" :model="attribute" @submit="async (data) => {
    await updateAttribute(data)

  }">
    <Button type="submit" class="w-full">Save</Button>
  </AutoForm>
</template>