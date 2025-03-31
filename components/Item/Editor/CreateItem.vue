<script setup>
import { AutoForm } from '@/components/ui/auto-form';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { urlFriendly } from '~/lib/utils';
import { itemsPostSchema } from '~/schemas/items-post-schema';

const { mutateAsync: createItem } = useMutation({
  mutationFn: async (data) => {
    const res = await $fetch('/api/items', {
      method: 'POST',
      body: data,
    });

    await navigateTo(`/${urlFriendly(res.brand.slug ?? res.brand.id)}/${urlFriendly(res.name)}/prd/${res.id}`);
  },
});

const { data: brands } = useFetch('/api/attribute-type/brand');
const { data: categories } = useFetch('/api/attribute-type/category');

const schema = computed(() => {
  if (!brands.value || !categories.value) {
    return itemsPostSchema;
  }
  return itemsPostSchema.extend({
    brandId: z.enum(brands.value.values?.map((brand) => String(brand.id))).transform((val) => {

      return Number(val);
    }),
    categoryId: z.enum(categories.value.values?.map((category) => String(category.id))).transform((val) => {
      return Number(val);
    }),
  })
})

const categorySelectOptions = computed(() => {
  const options = new Map(categories.value.values?.map((category) => [String(category.id), category.displayName]));
  return options;
});
const brandSelectOptions = computed(() => {
  const options = new Map(brands.value.values?.map((brand) => [String(brand.id), brand.displayName]));
  return options;
});
</script>

<template>

  <div class="w-full p-4">
    <AutoForm :schema="schema" @submit="async (data) => {
      try {
        await createItem(data);
        // Optionally, you can redirect or show a success message here
      } catch (error) {
        // Handle error
        console.error('Error creating item:', error);
      }
    }">

      <template #categoryId="slotProps">
        <AutoFormField v-bind="slotProps" :select-options="categorySelectOptions" />
      </template>
      <template #brandId="slotProps">
        <AutoFormField v-bind="slotProps" :select-options="brandSelectOptions" />
      </template>
      <Button type="submit">
        Create Item
      </Button>
    </AutoForm>
  </div>
</template>
